"use strict"
const fs = require('fs');

module.exports = {
    name: "device",
    methods: {
        reset() {
            if (typeof this.timer !== 'undefined')
                clearInterval(this.timer);
            this.timer = setInterval(() => {
                console.log("COUNT: " + this.count);
                console.log("FACTOR: " + this.factor);
                
                let d = this.data[this.count++].split(',');
                console.log("TIMESTAMP: " + d[0]);
                console.log("POWER: " + (parseFloat(d[1]) * this.factor));
                
               
                this.broker.emit("data.read", {
                    timestamp: d[0],
                    power: parseFloat(d[1]) * this.factor
                });
            }, this.interval);
        }
    },

    events: {
        "device.poweroutput": {
            group: 'other',
            handler(payload) {
                this.factor += payload.factor;
            }
        }
    },

    actions: {
        get: {
            async handler(ctx) {
                return {
                    interval: this.interval,
                    factor: this.factor
                };
            }
        },

        // postavi interval
        post: {
            params: {
                interval: {type: 'number'}
            },

            async handler(ctx) {
                this.interval = ctx.params.interval;
                this.reset();
                return ("Interval changed to " + this.interval);
            }
        }
    },

    created() {
        this.interval = 5000;
        this.factor = 1;
        this.data = fs.readFileSync('data/podaci.csv').toString().split('\n');
        this.count = 1;
        this.timer = undefined;
        this.reset();
    }
}