/*

Check de la valeur toutes les minutes

*/

var DHT_IOT = require('../index')
var CronJob = require('cron').CronJob;
 
var keypair = {publicKey:Buffer.from("f3699d17d219bc7beac6fc115fbc249c0d2e4f2c4a50d02a669fe7b8d0058d08", 'hex'),
            secretKey:Buffer.from("7882714bb3fb8cfc4e363fdb69a1aa16b6a1f219259c6f2688404553a42ee96a4d2db52db7c8566fc9b887736e9795184b0d6db253ad6388080dd6b9102567c7", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})
 
var t = 0;

var job = new CronJob('1 * * * * *', function() {

	dht_iot.get().then(function(val) {
	    console.log(val.value + " - " + t + " min")
	    
	    dht_iot.destroy()
	})

	t++;

}, null, true, null);