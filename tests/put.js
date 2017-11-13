var DHT_IOT = require('../index')
var dht_iot = new DHT_IOT()

dht_iot.put(50).then(function(hash) {
	console.log(hash)
	
	dht_iot.destroy()
})
