## Projekat - IoT sistem
Potrošena električna energija  
*Branko Simović 16326*  

Podaci preuzeti sa: https://www.kaggle.com/robikscube/hourly-energy-consumption?select=AEP_hourly.csv  

Pokretanje: `docker-compose up --build`

Dashboard je na http://localhost:8080  
Api je na http://localhost:3000  
Postman kolekcija za testiranje je fajl `soaprojekat.postman_collection.json`
Broker je NATS a baza je Mongo.  

Sistem prikuplja podatke iz fajla `data\podaci.csv`, podaci su potrošena električna energija po satu u SAD-u u megavatima i timestamp kada je izmerena vrednost. Ukoliko `analytics` servis primeti da je izmerena snaga manja ili veća od unapred određenih granica, `command` servis će postlati zahtev `device` servisu koji će procentualno povećati/smanjiti dalje merene vrednosti. `Analytics` servis ima sopstvenu bazu podataka u kojoj ubacuje izmerenu vrednost i timestamp kad god je vrednost izvan granica.  

Endpointi:  
* `/deviceparams` - GET - Vraća parametre očitavanja, uključujući faktor kojim se množi snaga
* `/setInterval` - POST - Postavi interval
* `/dbQuery` - GET - Vrati vrednosti iz baze gde je snaga između prosleđenih vrednosti
* `/dbSend` - POST - Ubaci u bazu
* `/db` - GET - Vrati celu bazu
* `/listCommands` - GET - Izlistaj komande
* `/changeCommand` - POST - Izmeni komandu
* `/analyticsQuery` - GET - Vrati poslednju vrednostu koju je analytics zabeležio
* `/analyticsThreshold` - POST - Izmeni gornju i donju granicu
* `/analytics` - GET - Vrati celu analytics bazu