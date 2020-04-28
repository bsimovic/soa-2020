const mqtt = require('mqtt');
const si = require('systeminformation');
const date = new Date();

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

// konektujemo se na mqtt, podrazumevamo da je na localhostu i portu 1883
let client = mqtt.connect('mqtt://localhost:1883');

// ako je konekcija uspesna, namestimo da salje podatke svakih 5 sekundi
client.on('connect', function() {
	let timer = setInterval(measureAndSend, 5000);
});
