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
            let ret = await this.broker.call('device.post', req.body);
            res.send(ret);
        },
        // DATA
        async dataGet(req, res) {
            let ret = await this.broker.call('data.get', req.query);
            res.send(ret);
        },
        async dataPost(req, res) {
            let ret = await this.broker.call('data.post', req.body);
            res.send(ret);
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
            let ret = await this.broker.call('command.post', req.body);
            res.send(ret);
        },
        // ANALYTICS
        async analyticsGet(req, res) {
            let ret = await this.broker.call('analytics.get', req.query);
            res.send(ret);
        },
        async analyticsPost(req, res) {
            let ret = await this.broker.call('analytics.post', req.body);
            res.send(ret);
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
        api.get('/analyticsQuery', this.analyticsGet); // pretrazi analytics bazu po tipu dogadjaja
        api.post('/analyticsThreshold', this.analyticsPost); // postavi granice za power na osnovu kojih ce biti belezeni dogadjaji
        api.get('/analytics', this.analyticsGetAll); // vrati celu analytics bazu

        api.listen(3000);
    }

}