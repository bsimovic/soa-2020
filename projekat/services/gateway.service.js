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
        api.get('/deviceParams', this.deviceGet);
        api.post('/setInterval', this.devicePost);
        api.get('/dbQuery', this.dataGet);
        api.post('/dbSend', this.dataPost);
        api.get('/db', this.dataGetAll);
        api.get('/listCommands', this.commandGet);
        api.post('/changeCommand', this.commandPost);
        api.get('/analyticsQuery', this.analyticsGet);
        api.post('/analyticsThreshold', this.analyticsPost);
        api.get('/analytics', this.analyticsGetAll);

        api.listen(3000);
    }

}