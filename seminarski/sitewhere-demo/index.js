const mqtt = require('mqtt');
const si = require('systeminformation');
let date = new Date();

// uzmemo url prenesen preko argumenta, ako nije prenesen pretpostavimo na je localhostu i portu 1883
let url = 'mqtt://localhost:1883';
if (process.argv.length > 2)
	url = process.argv[2];

// funkcija koja izvlaci vrednosti temperature i clocka pomocu systeminformation i salje na sitewhere input topic
async function measureAndSend() {
	let t = await si.cpuTemperature();
	let c = await si.cpuCurrentspeed();
	let payload = {
		hardwareId: "laptop-123",
		type: "DeviceMeasurements",
		request: {
			measurements: { 
				temp: t.main,
				clock: c.avg
			},
			updateState: true,
			eventDate: date.getTime()
		 }
	}

	client.publish('SiteWhere/input/json', JSON.stringify(payload));
}

console.log(url);

// konektujemo se na mqtt
let client = mqtt.connect(url);

// ako je konekcija uspesna, namestimo da salje podatke svakih 5 sekundi
client.on('connect', function() {
	timer = setInterval(measureAndSend, 5000);
});
