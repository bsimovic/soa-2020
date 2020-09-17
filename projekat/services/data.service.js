"use strict"
const mongo = require('mongoose');

module.exports = {
    name: "data",
    actions: {
        get: {
            params: {
                min: {type: "number"},
                max: {type: "number"}
            },

            async handler(ctx) {
                // ako je power izmedju min i max
                let doc = await this.model.findOne({$and: [{power: {$lte: ctx.params.max}}, {power: {$gte: ctx.params.min}}]});
                return doc;
            }
        },

        post: {
            params: {
                timestamp: {type: "string"},
                power: {type: "number"}
            },
            
            async handler(ctx) {
                let doc = new this.model({timestamp: ctx.params.timestamp, power: ctx.params.power});
                doc.save();
            }
        }
    },

    events: {
        "data.read": {
            group: "other",
            handler(payload) {
                this.broker.call("data.post", payload);
                this.broker.emit("analytics.analyze", payload);
            }
        }
    },

    created() {
        const Reading = new mongo.Schema({
            timestamp: String,
            power: Number
        });
        mongo.connect('mongodb://mongo:27017/maindb');
        this.model = mongo.model('reading', Reading);
    },

    stopped() {
        mongo.disconnect();
    }
}