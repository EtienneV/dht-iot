var DHT_IOT = require('../index')
var dht_iot = new DHT_IOT()

var notif = dht_iot.get_notified()

dht_iot.on('new_value', function(hash, data){
	console.log('Hash : '+hash)
	console.log('Timestamp : '+data.timestamp)
	console.log('Value : '+data.value)
	console.log()
})