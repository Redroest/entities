import {HTTP} from 'meteor/http';
import {_} from 'meteor/underscore';
import {RestEntity} from '../common/entity.js';


/**
 * initCollection - Create a in memory collection instance
 */
RestEntity.prototype.initCollection = function() {
    this.collection = new Mongo.Collection(this.identifier, {
        connection: null
    });
};


/**
 * request - Handle the request on the endpoint
 *
 * @param {get|post|put|del} method  The REST method
 * @param {type} url     absolute url of the endpoint
 * @param {type} options HTTP options as documented at http://docs.meteor.com/api/http.html
 *
 * @returns {Object} HTTP result object
 */
RestEntity.prototype.request = function(method, url, options) {
    return HTTP.call(method, url, options);
};

/**
 * publish - Publish data from a REST endpoint
 *
 * @param {Object} options: interval, url, method and http (for options as documented at http://docs.meteor.com/api/http.html)
 */
RestEntity.prototype.publish = function(options) {
    options = _.extend({
        interval: 5000,
        url: this.options.url,
        method: 'get',
        http: {
            headers: {
                'content-type': 'application/json'
            }
        }
    }, options ? options : {});

    let self = this;

    Meteor.publish(this.identifier, function() {
        self.pollEndpoint(this, options);

        return self.collection.find();
    });
};


/**
 * pollEndpoint - Poll the REST endpoint on a specific interval
 *
 * @param {*} sub      Publication handle to stop when user is unsubscribed
 * @param {Object} options: interval, url, method and http (for options as documented at http://docs.meteor.com/api/http.html)
 */
RestEntity.prototype.pollEndpoint = function(sub, options) {
    const poll = () => {
        const result = this.request(options.method, options.url, options.http);
        if(options.storeDocs) {
            options.storeDocs(result);
        } else {
            this.storeDocs(result);
        }
    };

    poll();

    const interval = Meteor.setInterval(poll, options.interval);

    sub.onStop(() => {
        Meteor.clearInterval(interval);
    });
};


/**
 * storeDocs - Saves the documents from the response body into a in memory mongo collection
 *
 * @param {Object} result object as described in Meteor's HTTP docs at http://docs.meteor.com/api/http.html
 */
RestEntity.prototype.storeDocs = function(result) {
    result.data.forEach((rawDoc) => { //Insert or update records in in-memory collection
        let _id = this.getID(rawDoc);
        delete rawDoc._id;
        let doc =  this.cleanDoc(rawDoc);

        if(doc) {
            this.collection.upsert(_id, {
                $set: this.cleanDoc(doc)
            });
        }
    });

    let _ids = result.data.map((doc) => {
        return this.getID(doc);
    });

    this.collection.remove({ //Remove deleted records
        _id: {
            $nin: _ids
        }
    });
};


/**
 * getID - Fetch the primarykey from a doc to uniquely identify it
 *
 * @param {Object} doc Object containing the primary key
 *
 * @returns {*} primary key
 */
RestEntity.prototype.getID = function(doc) {
    return doc._id ? doc._id : doc.id;
};
