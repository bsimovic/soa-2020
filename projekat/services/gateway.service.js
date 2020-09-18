"use strict"
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

module.exports = {
    name: "gateway",
    methods: {
        // DEVICE
        async deviceGet(req, res) {
            let ret = await this.broker.call('device.get');
            res.send(ret);
        },
        async devicePost(req, res) {
            if (typeof(req.body.interval) === 'number') {
                let ret = await this.broker.call('device.post', req.body);
                res.send(ret);
            }
            else
                res.send("Wrong parameter type");
        },
        // DATA
        async dataGet(req, res) {
            if (typeof(parseFloat(req.query.min)) === 'number' && typeof(parseFloat(req.query.max)) === 'number') {
                let ret = await this.broker.call('data.get', req.query);
                res.send(ret);
            }
            else
                res.send("Wrong parameter type");
        },
        async dataPost(req, res) {
            if (typeof(req.body.timestamp) === 'string' && typeof(req.body.power) === 'number') {
                let ret = await this.broker.call('data.post', req.body);
                res.send(ret);
            }
            else
                res.send("Wrong parameter type");
        },
        async dataGetAll(req, res) {
            let ret = await this.broker.call('data.getAll');
            res.send(ret);
        },
        // COMMAND
        async commandGet(req, res) {
            let ret = await this.broker.call('command.get');
            res.send(ret);
        },
        async commandPost(req, res) {
            if (typeof(req.body.commandName) === 'string' && typeof(req.body.paramName) === 'string' && typeof(req.body.paramValue) === 'number') {
                let ret = await this.broker.call('command.post', req.body);
                res.send(ret);
            }
            else
                res.send("Wrong parameter type");
        },
        // ANALYTICS
        async analyticsGet(req, res) {
            let ret = await this.broker.call('analytics.get');
            res.send(ret);
        },
        async analyticsPost(req, res) {
            if (typeof(req.body.upper) === 'number' && typeof(req.body.lower) === 'number') {
                let ret = await this.broker.call('analytics.post', req.body);
                res.send(ret);
            }
            else
                res.send("Wrong parameter type");
        },
        async analyticsGetAll(req, res) {
            let ret = await this.broker.call('analytics.getAll');
            res.send(ret);
        }
    },

    created() {
        const api = express();
        api.use(bodyparser.json());
        api.use(cors());

        //RUTE:
        api.get('/deviceParams', this.deviceGet); // vrati parametre merenja
        api.post('/setInterval', this.devicePost); // postavi interval merenja
        api.get('/dbQuery', this.dataGet); // pretrazi bazu po power
        api.post('/dbSend', this.dataPost); // ubaci u bazu
        api.get('/db', this.dataGetAll); // vrati celu bazu
        api.get('/listCommands', this.commandGet); // izlistaj komande
        api.post('/changeCommand', this.commandPost); // izmeni parametre komande
        api.get('/analyticsQuery', this.analyticsGet); // vrati zadnji dogadjaj
        api.post('/analyticsThreshold', this.analyticsPost); // postavi granice za power na osnovu kojih ce biti belezeni dogadjaji
        api.get('/analytics', this.analyticsGetAll); // vrati celu analytics bazu

        api.listen(3000);
    }

}