"use strict"
const fs = require('fs');

module.exports = {
    name: "device",
    methods: {
        reset() {
            if (typeof this.timer !== 'undefined')
                clearInterval(this.timer);
            this.timer = setInterval(function() {
                let data = this.DATA[this.count++].split(',');

                this.broker.emit("data.read", {
                    timestamp: data[0],
                    power: data[1] * this.factor
                });
            }, this.interval);
        }
    },

    events: {
         // command servis ce vrsiti provere validnosti pre nego sto gurne payload preko nats
        "device.interval": {
            group: 'other',
            handler(payload) {
                this.interval = payload.interval;
                this.reset();
            }
        },

        "device.poweroutput": {
            group: 'other',
            handler(payload) {
                this.factor = payload.factor;
            }
        }
    },

    actions: {
        get: {
            async handler(ctx) {
                return {
                    interval: this.interval,
                    factor: this.factor
                }
            }
        }
    },

    created() {
        this.interval = 2000;
        this.factor = 1;
        this.DATA = fs.readFileSync('../data/AEP_hourly.csv').toString().split('/n');
        this.count = 1;
        this.timer = undefined;
        this.reset();
    }
}