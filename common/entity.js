import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import {_} from 'meteor/underscore';


export class Entity {
    constructor(identifier, options) {
        this.identifier = identifier;
        this.options = _.extend({}, options ? options : {});

        if (Meteor.isClient) {
            this.collection = new Mongo.Collection(identifier); //Client is always minimongo
        } else {
            this.initCollection();
        }

        if(this.options.schema) {
            this.initSchema();
        }
    }

    initSchema() {
        this.schema = new SimpleSchema(this.options.schema);
        this.collection.attachSchema(this.schema);
    }

    cleanDoc(doc) {
        if(this.schema) {
            return this.schema.clean(doc);
        }
        return doc;
    }
}

export class RestEntity extends Entity {}
