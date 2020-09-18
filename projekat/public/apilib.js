class ApiLib {
    constructor(url) {
        this.url = url;
    }

    async deviceParams() {
        let form = {
            method: 'GET'
        };
        let res = await fetch(this.url + '/deviceParams', form);
        return res.json();
    }

    async setInterval(interval) {
        let data = {"interval": parseFloat(interval)};
        console.log(data);
        let form = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(form);

        fetch(this.url + '/setInterval', form);
    }

    async dbQuery(min, max) {
        let form = {
            method: 'GET'
        };
        let res = await fetch(this.url + '/dbQuery?min=' + min + '&max=' + max, form);
        return res.json();
    }

    async listCommands() {
        let form = {
            method: 'GET'
        };
        let res = await fetch(this.url + '/listCommands', form);
        return res.json();
    }

    async changeCommand(commandName, paramName, paramValue) {
        let data = {
            "commandName": commandName,
            "paramName": paramName,
            "paramValue": parseFloat(paramValue)
        };
        console.log(JSON.stringify(data));

        let form = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(this.url + '/changeCommand', form);
    }

    async analyticsQuery(type) {
        let form = {
            method: 'GET'
        };
        let res = await fetch(this.url + '/analyticsQuery', form);
        return res.json();
    }

    async analyticsThreshold(upper, lower) {
        let data = {
            "upper": parseFloat(upper),
            "lower": parseFloat(lower)
        }
        let form = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        fetch(this.url + '/analyticsThreshold', form);
    }
}