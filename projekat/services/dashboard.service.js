"use strict"
const express = require('express');
const cors = require('cors');

module.exports = {
    name: "dashboard",
    created() {
        const api = express();
        api.use(cors());
        api.use(express.static('public'));
        api.listen(8080);
    }

}