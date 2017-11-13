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
var KP = require('bittorrent-dht-store-keypair')
var EventEmitter = require('events').EventEmitter;


inherits(dht_iot, EventEmitter);

/**
opts =
{
	keypair
}
**/
function dht_iot(opts){
	//if (!(this instanceof DHT)) return new DHT(opts)
  	if (!opts){
  		opts = {}
  		var kp = KP()
		opts.keypair = {
		  publicKey: kp.publicKey,
		  secretKey: kp.secretKey
		}

		console.log("New keypair generated : ")
		console.log("PublicKey : " + opts.keypair.publicKey.toString('hex'))
		console.log("SecretKey : " + opts.keypair.secretKey.toString('hex'))
		console.log()
  	}

  	var self = this

  	this.dht = new DHT({ verify: ed.verify })
  	this.keypair = opts.keypair

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

		  	dht.get(infohash, function (err, res, nodes) {
		  		dht.destroy()

		  		var value = JSON.parse(res.v.toString('ascii'))

		  		self.emit('get_response', res, nodes)

				resolve({
					timestamp: value.t,
					value: value.v, 
					nodes: nodes
				})
			})

			dht.on('get_peer', function (message, node) { 
				//console.log("get peer")
				self.emit('get_peer', message, node)
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
					self.emit('get_nodes', val.nodes)
				}
			})

		}, null, true, null);
	}

	dht_iot.prototype.destroy = function() {
		self.dht.destroy()
	}

	dht_iot.prototype.new_keypair = function() {
		var kp = KP()
		console.log(JSON.stringify({
		  publicKey: kp.publicKey.toString('hex'),
		  secretKey: kp.secretKey.toString('hex')
		}))
	}

	function sha1 (buf) {
	  return crypto.createHash('sha1').update(buf).digest()
	}

	function infohash_from_key (key){
		return sha1(key).toString('hex')
	}
}