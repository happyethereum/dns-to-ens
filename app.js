'use strict';

let ui = require('./ui/index.js')
let dns = require('native-dns');
let server = dns.createServer();
let async = require('async');

const http = require('http');
const httpProxy = require('http-proxy');
const http_proxy = httpProxy.createProxyServer({});

const http_port = 80;

const http_requestHandler = (request, response) => {
  console.log("HTTP: ", request.url)
	http_proxy.web(request, response, { target: `http://147.135.130.181/ipfs/QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX/` });

}

const http_server = http.createServer(http_requestHandler);

http_server.listen(http_port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${http_port}`)
})

///////// DNS //////

server.on('listening', () => console.log('server listening on', server.address()));
server.on('close', () => console.log('server closed', server.address()));
server.on('error', (err, buff, req, res) => console.error(err.stack));
server.on('socketError', (err, socket) => console.error(err));

server.serve(53);

let authority = {
	address: '8.8.8.8',
	port: 53,
	type: 'udp'
};

function proxy(question, response, cb) {
	//console.log('proxying', JSON.stringify(question));


	var request = dns.Request({
		question: question, // forwarding the question
		server: authority, // this is the DNS server we are asking
		timeout: 1000
	});


	request.on('timeout', function() {
		console.log('Timeout in making request no forwarding', question.name);
	});

	// when we get answers, append them to the response
	request.on('message', (err, msg) => {
		msg.answer.forEach(a => {
			response.answer.push(a);
			//console.log('remote DNS response: ', a)
		});
	});

	request.on('end', cb);
	request.send();
}


function handleRequest(request, response) {
	var question = request.question[0];
	//console.log('request from', request.address.address, 'for', question.name);
	//console.log('questions', request);
	console.log(question.name);
	let f = [];

	request.question.forEach(question => {
		let entry = ui.entries.filter(r => new RegExp(r.domain, 'i').exec(question.name));

		// a local resolved host
		if (question.name.includes(".eth")) {
			let record = {};
			record.name = question.name;
			record.ttl = record.ttl || 1800;
			record.address = "127.0.0.1";
			response.answer.push(dns["A"](record));
		} else {
			// forwarding host
			console.log("forwarding host");
			f.push(cb => proxy(question, response, cb));
		}
	});

	async.parallel(f, function() {
		response.send();
	});
}

server.on('request', handleRequest);
