"use strict"
const mongo = require('mongoose');

module.exports = {
    name: "data",
    actions: {
        // vrati sve iz baze gde je power izmedju min i max
        get: {
            params: {
                min: {type: "string"},
                max: {type: "string"}
            },

            async handler(ctx) {
                
                let doc = await this.model.find({$and: [{power: {$lte: parseFloat(ctx.params.max)}}, {power: {$gte: parseFloat(ctx.params.min)}}]});
                return doc;
            }
        },

        post: {
            params: {
                timestamp: {type: "string"},
                power: {type: "number"}
            },

            async handler(ctx) {
                this.broker.emit("analytics.analyze", ctx.params);
                let doc = new this.model({timestamp: ctx.params.timestamp, power: ctx.params.power});
                doc.save();
                return ("Successfuly added " + ctx.params.timestamp + " " + ctx.params.power);
            }
        },

        // vrati sve iz baze
        getAll: {
            async handler(ctx) {
                let doc = await this.model.find({});
                return doc;
            }
        }
    },

    events: {
        "data.read": {
            group: "other",
            handler(payload) {
                this.broker.call("data.post", payload);
            }
        }
    },

    created() {
        const Reading = new mongo.Schema({
            timestamp: String,
            power: Number
        });
        mongo.connect('mongodb://mongodb:27017/maindb');
        this.model = mongo.model('reading', Reading);
    },

    stopped() {
        mongo.disconnect();
    }
}