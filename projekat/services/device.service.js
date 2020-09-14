"use strict"
const fs = require('fs');

module.exports = {
    name: "device",
    methods: {
        reset() {
            if (typeof this.timer !== 'undefined')
                clearInterval(this.timer);
            this.timer = setInterval(function() {
                let data;
                switch (this.source) {
                    case 0: data = this.AEP[this.count++].split(','); break;
                    case 1: data = this.COMED[this.count++].split(','); break;
                    case 2: data = this.DAYTON[this.count++].split(','); break;
                }

                this.broker.emit("data.read", {
                    timestamp: data[1],
                    reading: data[2]
                });

            }, this.interval);
        }
    },

    events: {
         // command servis ce vrsiti provere validnosti pre nego sto gurne payload preko nats
        "change.source": {
            group: 'other',
            handler(payload) {
                this.source = payload.source;
            }
        },

        "change.interval": {
            group: 'other',
            handler(payload) {
                this.interval = payload.interval;
                this.reset();
            }
        }
    },

    actions: {
        getMetadata: {
            async handler() {
                return {
                    source: this.source,
                    interval: this.interval
                }
            }
        }
    },

    created() {
        this.source = 0; // 0 - aep, 1 - comed, 2 - dayton
        this.interval = 1000;
        this.AEP = fs.readFileSync('../data/AEP_hourly.csv').toString().split('/n');
        this.COMED = fs.readFileSync('../data/COMED_hourly.csv').toString().split('/n');
        this.DAYTON = fs.readFileSync('../data/DAYTON_hourly.csv').toString().split('/n');
        this.count = 1;
        this.timer = undefined;
        this.reset();
    }
}