/*

Keypair generation
-> Storing in a file / Just show it

Put value
-> Send value in the DHT (only mutable)

Get value

Get value alive
-> Check every hour

Destroy DHT

** Events **

Get notified for new value

Get notified for new node response after a get
-> Infos on the node

Get notified for a new response after a lookup

*/
module.exports = dht_iot

var DHT = require('bittorrent-dht')
var ed = require('ed25519-supercop')
var crypto = require('crypto')
var inherits = require('inherits')
var CronJob = require('cron').CronJob;
var EventEmitter = require('events').EventEmitter;

// Clés de cryptage
var keyp = {publicKey:Buffer.from("6ef441733b1510cc5c93b7201e256b1d9605825e4ea0caca8e202193be090da4", 'hex'),
				secretKey:Buffer.from("6809e0b94f41b1d72cbe29e433e488e1682c703f0ea6a2b5e8bb8a2e74bbf16811759cd5477a8f10b4d73e1f76aaaec81ea201d60ad0358e749c4d3426f5901a", 'hex')}

inherits(dht_iot, EventEmitter);

function dht_iot(opts){
	//if (!(this instanceof DHT)) return new DHT(opts)
  	if (!opts) opts = {}

  	var self = this

  	this.dht = new DHT({ verify: ed.verify })
  	this.keypair = keyp

	dht_iot.prototype.put = function(value) {
		// TO DO : verifying the lenght of value (1000 bytes max)
		// TO DO : use the salt (channel)

		//var dht = new DHT({ verify: ed.verify })

		return new Promise((resolve, reject) => {

			var message = {
			    t : Math.floor(new Date() / 1000),
			    v : value
			}

			var opts = {
			    k: self.keypair.publicKey,
			    seq: Math.floor(new Date() / 1000), // SEQ = UNIX time, so it is always up to date
			    v: JSON.stringify(message),
			    sign: function (buf) {
			      	return ed.sign(buf, self.keypair.publicKey, self.keypair.secretKey)
			    }
			}

			self.dht.put(opts, function (err, hash) {
				//dht.destroy()

				resolve(hash)
		    })
		})
	}

	dht_iot.prototype.get = function() {
		// TO DO : use the salt (channel)

		return new Promise((resolve, reject) => {
		  	var dht = new DHT({ verify: ed.verify})

		  	var infohash = infohash_from_key(self.keypair.publicKey)

		  	dht.get(infohash, function (err, res) {
		  		dht.destroy()

		  		var value = JSON.parse(res.v.toString('ascii'))

		  		self.emit('get_response', res)

				resolve({
					timestamp: value.t,
					value: value.v
				})
			})
		});
	}

	dht_iot.prototype.get_notified = function() {
		// TO DO : use the salt (channel)
		// TO DO : delete cron job

		var last_timestamp = 0

		var job = new CronJob('*/3 * * * * *', function() {

			var infohash = infohash_from_key(self.keypair.publicKey)

			self.get().then(function(val) {
				if(val.timestamp > last_timestamp) {
					last_timestamp = val.timestamp

					self.emit('new_value', infohash, val)
				}
			})

		}, null, true, null);
	}

	dht_iot.prototype.destroy = function() {
		self.dht.destroy()
	}

	function sha1 (buf) {
	  return crypto.createHash('sha1').update(buf).digest()
	}

	function infohash_from_key (key){
		return sha1(key).toString('hex')
	}
}