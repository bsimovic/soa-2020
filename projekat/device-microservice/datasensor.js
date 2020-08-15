const csv = require('csv-parse');

const parser = parse({delimiter: ','});

// 
export class DataSensor {
    constructor(threshold, source) {
        this.threshold = threshold;
        this.source = source;
    }

    read() {

    }
}