"use strict"
const influx = require('influx');

module.exports = {
    name: "data",
    actions: {
        get: {
            params: {
                source: {type: "string"},
                min: {type: "number"},
                max: {type: "number"}
            },

            async handler(ctx) {
                try {
                    const res = await this.
                }
            }
        }
    }
}