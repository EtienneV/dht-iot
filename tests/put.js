var DHT_IOT = require('../index')

var keypair = {publicKey:Buffer.from("6ef441733b1510cc5c93b7201e256b1d9605825e4ea0caca8e202193be090da4", 'hex'),
			secretKey:Buffer.from("6809e0b94f41b1d72cbe29e433e488e1682c703f0ea6a2b5e8bb8a2e74bbf16811759cd5477a8f10b4d73e1f76aaaec81ea201d60ad0358e749c4d3426f5901a", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

dht_iot.put(20).then(function(hash) {
	console.log(hash)
	
	dht_iot.destroy()
})
