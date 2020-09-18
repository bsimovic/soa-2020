"use strict"

module.exports = {
    name: "command",
    actions: {
        // vrati listu komandi i trenutne parametre
        get: {
            async handler(ctx) {
                return {
                    commands: [
                        {
                            name: 'increasePower', params: {factor: this.incFactor}
                        },
                        {
                            name: 'decreasePower', params: {factor: this.decFactor}
                        }
                    ]
                };
            }
        },

        // postavi parametar
        post: {
            params: {
                commandName: {type: "string"},
                paramName: {type: "string"},
                paramValue: {type: "number"}
            },

            async handler(ctx) {
                if (ctx.params.commandName === "increasePower") {
                    if (ctx.params.paramName === "factor")
                        this.incFactor = ctx.params.paramValue;
                }
                else if (ctx.params.commandName === "decreasePower") {
                    if (ctx.params.paramName === "factor")
                        this.decFactor = ctx.params.paramValue;
                }

                return ("Success");
            }
        }
    },

    events: {
        "command.increasepower": {
            group: 'other',
            handler(payload) {
                this.broker.emit('device.poweroutput', {factor: this.incFactor});
            }
        },

        "command.decreasepower": {
            group: "other",
            handler(payload) {
                this.broker.emit('device.poweroutput', {factor: this.decFactor});
            }
        }
    },

    created() {
        this.incFactor = 0.05;
        this.decFactor = -0.05;
    }
}