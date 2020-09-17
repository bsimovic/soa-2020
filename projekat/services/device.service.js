"use strict"
const fs = require('fs');

module.exports = {
    name: "device",
    methods: {
        reset() {
            if (typeof this.timer !== 'undefined')
                clearInterval(this.timer);
            this.timer = setInterval(function() {
                let dataAEP = this.AEP[this.count++].split(',');
                let dataCOMED = this.COMED[this.count++].split(',');
                let dataDAYTON = this.DAYTON[this.count++].split(',');
    
                this.broker.emit("data.read", {
                    source: "AEP",
                    timestamp: dataAEP[0],
                    power: dataAEP[1]
                });
                this.broker.emit("data.read", {
                    source: "COMED",
                    timestamp: dataCOMED[0],
                    power: dataCOMED[1]
                });
                this.broker.emit("data.read", {
                    source: "DAYTON",
                    timestamp: dataDAYTON[0],
                    power: dataDAYTON[1]
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
        this.interval = 1000;
        this.AEP = fs.readFileSync('../data/AEP_hourly.csv').toString().split('/n');
        this.COMED = fs.readFileSync('../data/COMED_hourly.csv').toString().split('/n');
        this.DAYTON = fs.readFileSync('../data/DAYTON_hourly.csv').toString().split('/n');
        this.count = 1;
        this.timer = undefined;
        this.reset();
    }
}