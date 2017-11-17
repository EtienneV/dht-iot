# dht-iot
Using the BitTorrent DHT to store IoT data

I am using my forked version of the bitTorrent-dht module : https://github.com/EtienneV/bittorrent-dht

## install

```
npm install dht-iot
```

## Initialisation

```javascript
var DHT_IOT = require('dht-iot')

var keypair = {publicKey:Buffer.from("xxxxxxxxxxxxxxxxxxxx", 'hex'),
			secretKey:Buffer.from("xxxxxxxxxxxxxxxxxxxxxxx", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})
```

Initiate a dht-iot instance with a specified keypair.

```javascript
var DHT_IOT = require('dht-iot')

var dht_iot = new DHT_IOT()
```

Initiate a dht-iot instance with a random keypair.

## Keypair generation

```javascript
dht_iot.new_keypair()
```

It will display a new random keypair.


## Put data

Send data over the DHT at the hash corresponding to the specified keypair.

```javascript
dht_iot.put(val).then(function(hash) {})
```
IN
val : Value to publish on the DHT

OUT
hash : the hash corresponding to the value published

### Example

```javascript
var DHT_IOT = require('dht-iot')

var keypair = {publicKey:Buffer.from("xxxxxxxxxxxxxxxxxxxxx", 'hex'),
			secretKey:Buffer.from("xxxxxxxxxxxxxxxxxxxxxxxx", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

dht_iot.put(50).then(function(hash) {
	console.log(hash)
	
	dht_iot.destroy()
})

```

## Get data

Get data at the hash corresponding to the specified keypair.

```javascript
dht_iot.get().then(function(val) {})
```

OUT
val.v : the value
val.t : the date of the value (UNIX timestamp in seconds)

### Example

```javascript
var DHT_IOT = require('dht-iot')

var keypair = {publicKey:Buffer.from("xxxxxxxxxxxxxxxxxxxxxxxxxx", 'hex'),
			secretKey:Buffer.from("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

dht_iot.get().then(function(val) {
	console.log(val.value)
	
	dht_iot.destroy()
})

```

## Get notified for new data

Get notified at every new message. The checking resolution is about 3 seconds.

```javascript
dht_iot.get_notified() // Launch notification system
```

Everytime there is a new value an "new_value" event is fired

### Example

```javascript
var DHT_IOT = require('dht-iot')

var keypair = {publicKey:Buffer.from("xxxxxxxxxxxxxxxxxxxxxxxxxxxx", 'hex'),
			secretKey:Buffer.from("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

var notif = dht_iot.get_notified()

dht_iot.on('new_value', function(hash, data){
	console.log('Hash : '+hash)
	console.log('Timestamp : '+data.timestamp)
	console.log('Value : '+data.value)
	console.log()
})
```
