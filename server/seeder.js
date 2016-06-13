/**
 * Created by Cloudspider on 31-5-2016.
 */

Seeder = class Seeder {
    constructor(collection, schema, timeoutMs) {
        this.collection = collection;
        this.schema = schema;
        this.cleanupTimeout = timeoutMs ? timeoutMs : 15000; //Default 15 seconds
    }

    /**
     * Check widget documents with a verification stamp. All documents that still have that stamp after n ms will be removed
     */
    cleanup() {
        this.collection.update({}, {
            $set: {
                verifyAt: new Date()
            }
        }, {multi: true});

        Meteor.setTimeout(() => {
            this.collection.remove({
                verifyAt: {
                    $exists: true
                }
            });
        }, this.cleanupTimeout);
    }

    ensure(input) {
        check(input, this.schema);
        let properties = this.schema.clean(input);
        let selector = this.getSelector(properties);

        return this.collection.upsert(selector, {
            $set: properties,
            $unset: {
                verifyAt: ''
            }
        })
    }

    getSelector(properties) {
        return {
            identifier: properties.identifier
        }
    }
};
