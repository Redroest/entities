import {Mongo} from 'meteor/mongo';
import {Entity} from '../common/entity.js';


Entity.prototype.initCollection = function() {
    this.collection = new Mongo.Collection(this.identifier);
};

Entity.prototype.getStatistics = function() {
    return {
        total: this.collection.find().count()
    }
};

Entity.prototype.publish = function() {
    return this.collection.find();
};
