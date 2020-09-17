"use strict"
const mongo = require('mongoose');

module.exports = {
    name: "analytics",
    actions: {
        // vrati svaki event odredjenog tipa
        get: {
            params: {
                type: {type: "string"}
            },
            async handler(ctx) {
                let doc = await this.model.find({type: ctx.params.type});
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
                return "Success";
            }
        }
    },

    events: {
        "analytics.analyze": {
            group: "other",
            handler(payload) {
                if (this.powerTooHigh(payload.power)) {
                    this.broker.emit('command.increasepower', null);
                    this.notify(payload, 'powerTooHigh');
                }
                else if (this.powerTooLow(payload.power)) {
                    this.broker.emit('command.decreasepower', null);
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

            

            //TODO: POSALJI NA DASHBOARD
        }
    },

    created() {
        this.upperThreshold = 17000;
        this.lowerThreshold = 11000;
        const AEvent = new mongo.Schema({
            type: String,
            timestamp: String,
            power: Number,
            upperThreshold: Number,
            lowerThreshold: Number
        });
        mongo.connect('mongodb://mongo:27017/analyticsdb');
        this.model = mongo.model('event', AEvent);
    }
}