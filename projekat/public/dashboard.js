let cont = document.getElementById('mainContainer');
let notif = document.getElementById('notifications');
let lib = new ApiLib("http://localhost:3000");

// da ne bude bas cist json...
function JSONtoTable(jsonObj) {
    let table = document.createElement('table');

    for (key in jsonObj) {
        let row = document.createElement('tr');
        let k = document.createElement('td');
        let v = document.createElement('td');

        k.innerHTML = key + ': ';
        v.innerHTML = jsonObj[key];

        row.appendChild(k);
        row.appendChild(v);
        table.appendChild(row);
    }

    return table;
}

async function drawDevice() {
    cont.innerHTML = '';
    let getParams = document.createElement('button');
    getParams.innerHTML = "Parametri merenja";
    let params = document.createElement('div');
    let intervalBox = document.createElement('input');
    intervalBox.setAttribute('type', 'text');
    let setInterval = document.createElement('button');
    setInterval.innerHTML = 'Promeni interval';

    cont.appendChild(getParams);
    cont.appendChild(params);
    cont.appendChild(intervalBox);
    cont.appendChild(setInterval);

    getParams.onclick = async function() {
        let res = await lib.deviceParams();
        params.innerHTML = JSONtoTable(res).outerHTML;
    };

    setInterval.onclick = async function() {
        lib.setInterval(intervalBox.value);
    }
}

async function drawData() {
    cont.innerHTML = '';

    let results = document.createElement('div');
    let minLabel = document.createElement('div');
    minLabel.innerHTML = 'Min:';
    let maxLabel = document.createElement('div');
    maxLabel.innerHTML = 'Max:';
    let minBox = document.createElement('input');
    let maxBox = document.createElement('input');
    let search = document.createElement('button');
    minBox.setAttribute('type', 'text');
    maxBox.setAttribute('type', 'text');
    search.innerHTML = 'Pretraži';

    cont.appendChild(minLabel);
    cont.appendChild(minBox);
    cont.appendChild(maxLabel);
    cont.appendChild(maxBox);
    cont.appendChild(search);

    cont.appendChild(results);

    search.onclick = async function() {
        let res = await lib.dbQuery(minBox.value, maxBox.value);
        for (result in res) {
            results.appendChild(JSONtoTable({
                timestamp: res[result].timestamp,
                power: res[result].power + ' MW'
            }))
        }
    }
}

async function drawAnalytics() {
    cont.innerHTML = '';

    let upperLabel = document.createElement('div');
    upperLabel.innerHTML = 'Gornja granica: ';
    let lowerLabel = document.createElement('div');
    lowerLabel.innerHTML = 'Donja granica: ';
    let upperBox = document.createElement('input');
    upperBox.setAttribute('type', 'text');
    let lowerBox = document.createElement('input');
    lowerBox.setAttribute('type', 'text');
    let submitThresh = document.createElement('button');
    submitThresh.innerHTML = 'Izmeni threshold';
    cont.appendChild(upperLabel);
    cont.appendChild(upperBox);
    cont.appendChild(lowerLabel);
    cont.appendChild(lowerBox);
    cont.appendChild(submitThresh);

    submitThresh.onclick = async function() {
        lib.analyticsThreshold(upperBox.value, lowerBox.value);
    }
}

async function drawCommand() {
    cont.innerHTML = '';

    let listButton = document.createElement('button');
    listButton.innerHTML = 'Izlistaj komande';

    let nameLabel = document.createElement('div');
    nameLabel.innerHTML = 'Naziv komande: '
    let nameBox = document.createElement('input');
    nameBox.setAttribute('type', 'text');

    let paramLabel = document.createElement('div');
    paramLabel.innerHTML = 'Naziv parametra: '
    let paramBox = document.createElement('input');
    paramBox.setAttribute('type', 'text');

    let valueLabel = document.createElement('div');
    valueLabel.innerHTML = 'Vrednost parametra: '
    let valueBox = document.createElement('input');
    valueBox.setAttribute('type', 'text');

    let submitCmd = document.createElement('button');
    submitCmd.innerHTML = 'Izmeni komandu';

    let commandsDiv = document.createElement('div');

    cont.appendChild(nameLabel);
    cont.appendChild(nameBox);
    cont.appendChild(paramLabel);
    cont.appendChild(paramBox);
    cont.appendChild(valueLabel);
    cont.appendChild(valueBox);
    cont.appendChild(submitCmd);
    cont.appendChild(listButton);
    cont.appendChild(commandsDiv);

    submitCmd.onclick = async function() {
        lib.changeCommand(nameBox.value, paramBox.value, valueBox.value);
    }

    listButton.onclick = async function() {
        commandsDiv.innerHTML = '';
        let res = await lib.listCommands();
        for (cmd in res.commands) {
            commandsDiv.appendChild(JSONtoTable({
                Naziv: res.commands[cmd].name,
                Parametri: JSON.stringify(res.commands[cmd].params)
            }))
        }
    }
}

let oldid = '';
async function addNotification() {
    let res = await lib.analyticsQuery();
    if ((typeof(res[0]) !== 'undefined') && (res[0]._id !== oldid)) {
        oldid = res[0]._id;
        notif.appendChild(JSONtoTable(res[0]));
    }
}

let device = document.getElementById('buttonDevice');
let data = document.getElementById('buttonData');
let analytics = document.getElementById('buttonAnalytics');
let command = document.getElementById('buttonCommand');
device.onclick = drawDevice;
data.onclick = drawData;
analytics.onclick = drawAnalytics;
command.onclick = drawCommand;

setInterval(addNotification, 1000);