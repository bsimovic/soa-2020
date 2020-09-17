"use strict"
const mongo = require('mongoose');

module.exports = {
    name: "data",
    actions: {
        get: {
            params: {
                source: {type: "string"},
                min: {type: "number"},
                max: {type: "number"}
            },

            async handler(ctx) {
                // ako je taj source i ako je power izmedju min i max
                let doc = await this.model.findOne({$and: [{source: ctx.params.source}, {power: {$lte: ctx.params.max}}, {power: {$gte: ctx.params.min}}]});
                return doc;
            }
        },

        put: {
            params: {
                source: {type: "string"},
                timestamp: {type: "string"},
                power: {type: "number"}
            },

            async handler(ctx) {
                let doc = new this.model({source: ctx.params.source, timestamp: ctx.params.timestamp, power: ctx.params.power});
                doc.save();
            }
        }
    },

    events: {
        "data.read": {
            group: "other",
            handler(payload) {
                this.broker.call("data.put", payload);
            }
        }
    },

    created() {
        const Reading = new mongo.Schema({
            source: String,
            timestamp: String,
            power: Number
        });
        mongo.connect('mongodb://mongo:27017/baza');
        this.model = mongo.model('reading', Reading);
    },

    stopped() {
        mongo.disconnect();
    }
}