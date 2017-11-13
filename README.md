# dht-iot
Using the BitTorrent DHT to store IoT data

I am using my forked version of the bitTorrent-dht module : https://github.com/EtienneV/bittorrent-dht

## Examples

### Put data

```javascript
var DHT_IOT = require('../index')

var keypair = {publicKey:Buffer.from("6ef441733b1510cc5c93b7201e256b1d9605825e4ea0caca8e202193be090da4", 'hex'),
			secretKey:Buffer.from("6809e0b94f41b1d72cbe29e433e488e1682c703f0ea6a2b5e8bb8a2e74bbf16811759cd5477a8f10b4d73e1f76aaaec81ea201d60ad0358e749c4d3426f5901a", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

dht_iot.put(50).then(function(hash) {
	console.log(hash)
	
	dht_iot.destroy()
})

```

### Get data

```javascript
var DHT_IOT = require('../index')

var keypair = {publicKey:Buffer.from("6ef441733b1510cc5c93b7201e256b1d9605825e4ea0caca8e202193be090da4", 'hex'),
			secretKey:Buffer.from("6809e0b94f41b1d72cbe29e433e488e1682c703f0ea6a2b5e8bb8a2e74bbf16811759cd5477a8f10b4d73e1f76aaaec81ea201d60ad0358e749c4d3426f5901a", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

dht_iot.get().then(function(val) {
	console.log(val.value)
	
	dht_iot.destroy()
})

```

### Get notified for new data

```javascript
var DHT_IOT = require('../index')

var keypair = {publicKey:Buffer.from("6ef441733b1510cc5c93b7201e256b1d9605825e4ea0caca8e202193be090da4", 'hex'),
			secretKey:Buffer.from("6809e0b94f41b1d72cbe29e433e488e1682c703f0ea6a2b5e8bb8a2e74bbf16811759cd5477a8f10b4d73e1f76aaaec81ea201d60ad0358e749c4d3426f5901a", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

var notif = dht_iot.get_notified()

dht_iot.on('new_value', function(hash, data){
	console.log('Hash : '+hash)
	console.log('Timestamp : '+data.timestamp)
	console.log('Value : '+data.value)
	console.log()
})
```