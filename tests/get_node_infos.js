var DHT_IOT = require('../index')
const request = require('request')

var keypair = {publicKey:Buffer.from("6ef441733b1510cc5c93b7201e256b1d9605825e4ea0caca8e202193be090da4", 'hex'),
			secretKey:Buffer.from("6809e0b94f41b1d72cbe29e433e488e1682c703f0ea6a2b5e8bb8a2e74bbf16811759cd5477a8f10b4d73e1f76aaaec81ea201d60ad0358e749c4d3426f5901a", 'hex')}
var dht_iot = new DHT_IOT({keypair: keypair})

dht_iot.get().then(function(val) {
	console.log(val.value)
})

dht_iot.on('get_peer', function (message, node) { 
	//console.log(message)

	geoip(node.address).then(function (res){
		//console.log(node)
		console.log(node.address)
		if(message.r.id) console.log("NODE ID : "+message.r.id.toString('hex'))
		console.log("Distance : "+distance(message.r.id.toString('hex'), dht_iot.get_infohash()))
		if(message.v){
			var client_id = message.v.toString('hex')

			var client_soft = String.fromCharCode(parseInt(client_id.slice(0, 2), 16))+String.fromCharCode(parseInt(client_id.slice(2, 4), 16))
			var client_ver = parseInt(client_id.slice(4, 8), 16)

			console.log("CLIENT : "+client_list[client_soft]+" v"+client_ver)
		}
		console.log()

		console.log("Localisation :"+res.city+", "+res.country)
		//console.log()
		//console.log(res.lat+", "+res.lon)
		console.log()

    	if(message.r.v) {
    		console.log("Ce noeud possède la valeur")
    		console.log("Valeur récupérée : "+message.r.v.toString('ascii'))
    	}
    	else console.log("Ce noeud ne possède pas la valeur")

    	console.log()
    	console.log()
    	console.log()
	})
})

function parseIp (buf, offset) {
  return buf[offset++] + '.' + buf[offset++] + '.' + buf[offset++] + '.' + buf[offset++]
}

function geoip(ip) {
	return new Promise((resolve, reject) => {
  		request('http://ip-api.com/json/'+ip, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		       var donnees = JSON.parse(body);

		       resolve(donnees)
		    }
		    reject(error)
		})
  	});
}


function distance(firstId, secondId) {
  var distance = 0
  var min = Math.min(firstId.length, secondId.length)
  var max = Math.max(firstId.length, secondId.length)
  for (var i = 0; i < min; ++i) distance = distance * 256 + (firstId[i] ^ secondId[i])
  for (; i < max; ++i) distance = distance * 256 + 255

  distance = distance / Math.pow(10, 80)

  return distance
}

var client_list = {"AG" : "Ares",
"A~" : "Ares",
"AR" : "Arctic",
"AV" : "Avicora",
"AX" : "BitPump",
"AZ" : "Azureus",
"BB" : "BitBuddy",
"BC" : "BitComet",
"BF" : "Bitflu",
"BG" : "BTG (uses Rasterbar libtorrent)",
"BR" : "BitRocket",
"BS" : "BTSlave",
"BX" : "~Bittorrent X",
"CD" : "Enhanced CTorrent",
"CT" : "CTorrent",
"DE" : "DelugeTorrent",
"DP" : "Propagate Data Client",
"EB" : "EBit",
"ES" : "electric sheep",
"FT" : "FoxTorrent",
"FX" : "Freebox BitTorrent",
"GS" : "GSTorrent",
"HL" : "Halite",
"HN" : "Hydranode",
"KG" : "KGet",
"KT" : "KTorrent",
"LH" : "LH-ABC",
"LP" : "Lphant",
"LT" : "libtorrent",
"lt" : "libTorrent",
"LW" : "LimeWire",
"MO" : "MonoTorrent",
"MP" : "MooPolice",
"MR" : "Miro",
"MT" : "MoonlightTorrent",
"NX" : "Net Transport",
"PD" : "Pando",
"qB" : "qBittorrent",
"QD" : "QQDownload",
"QT" : "Qt 4 Torrent example",
"RT" : "Retriever",
"S~" : "Shareaza alpha/beta",
"SB" : "~Swiftbit",
"SS" : "SwarmScope",
"ST" : "SymTorrent",
"st" : "sharktorrent",
"SZ" : "Shareaza",
"TN" : "TorrentDotNET",
"TR" : "Transmission",
"TS" : "Torrentstorm",
"TT" : "TuoTu",
"UL" : "uLeecher!",
"UT" : "µTorrent",
"VG" : "Vagaa",
"WD" : "WebTorrent Desktop",
"WT" : "BitLet",
"WW" : "WebTorrent",
"WY" : "FireTorrent",
"XL" : "Xunlei",
"XT" : "XanTorrent",
"XX" : "Xtorrent",
"ZT" : "ZipTorrent"}