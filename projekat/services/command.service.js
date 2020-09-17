"use strict"


module.exports = {
    name: "command",
    actions: {
        get: {
            async handler(ctx) {
                return {
                    commands: [
                        {
                            name: 'changeInterval', params: {interval: 'number'}
                        },
                        {
                            name: 'powerOutput', params: {factor: 'number'}
                        }
                    ]
                }
            }
        }
    },

    events: {
        "command.changeinterval": {
            group: 'other',
            handler(payload) {
                if (!(isNaN(payload.interval)) && payload.interval >= 200)
                    this.broker.emit('device.interval', payload.interval);
                else
                    console.log("command.changeinterval: bad interval");
            }
        },

        "command.poweroutput": {
            group: "other",
            handler(payload) {
                if (!(isNaN(payload.factor)) && payload.factor >= 0 && payload.factor <= 1)
                    this.broker.emit('device.poweroutput', payload.factor);
                else
                    console.log("command.poweroutput: bad factor");
            }
        }
    }
}