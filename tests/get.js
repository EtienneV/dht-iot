var DHT_IOT = require('../index')
var dht_iot = new DHT_IOT()

dht_iot.get().then(function(val) {
	console.log(val.value)
	
	dht_iot.destroy()
})

dht_iot.on('get_ok', function(p){
	console.log('event'+ p)
})
