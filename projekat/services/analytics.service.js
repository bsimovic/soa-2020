"use strict"
const mongo = require('mongoose');

module.exports = {
    name: "analytics",
    actions: {
        // vrati zadnji ubacen dogadjaj
        get: {
            async handler(ctx) {
                let doc = await this.model.find().sort({_id: -1}).limit(1);
                return doc;
            }
        },

        // izmeni threshold
        post: {
            params: {
                upper: {type: "number"},
                lower: {type: "number"}
            },
            async handler(ctx) {
                this.lowerThreshold = ctx.params.lower;
                this.upperThreshold = ctx.params.upper;
                return ("Threshold updated to: " + ctx.params.lower + '-' + ctx.params.upper);
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
        "analytics.analyze": {
            group: "other",
            handler(payload) {
                if (this.powerTooHigh(payload.power)) {
                    this.broker.emit('command.decreasepower', null);
                    this.notify(payload, 'powerTooHigh');
                }
                else if (this.powerTooLow(payload.power)) {
                    this.broker.emit('command.increasepower', null);
                    this.notify(payload, 'powerTooLow');
                }
            }
        }
    },

    methods: {
        powerTooHigh(power) {
            return (power > this.upperThreshold);
        },

        powerTooLow(power) {
            return (power < this.lowerThreshold);
        },

        notify(payload, typeString) {
            // smesti u bazu
            let data = {
                type: typeString,
                timestamp: payload.timestamp,
                power: payload.power,
                upperThreshold: this.upperThreshold,
                lowerThreshold: this.lowerThreshold
            }
            let doc = new this.model(data);
            doc.save();
        }
    },

    created() {
        this.upperThreshold = 14000;
        this.lowerThreshold = 12000;
        const AEvent = new mongo.Schema({
            type: String,
            timestamp: String,
            power: Number,
            upperThreshold: Number,
            lowerThreshold: Number
        });
        mongo.connect('mongodb://mongodb:27017/analyticsdb');
        this.model = mongo.model('event', AEvent);
    },

    stopped() {
        mongo.disconnect();
    }
}