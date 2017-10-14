'use strict';

let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
let theRecordFile = process.cwd() + '/records.json';
let entries = app.entries = getTheJson(theRecordFile);
let password = 'cat';

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/load', (req, res) => {
	res.send(entries);
});

app.post('/save', (req, res) => {
	if (req.query.password == password) {
		entries = app.entries = req.body;
		writeJson(entries);
		res.send('ok');
	} else {
		res.status(401).send('wrong');
	}
});

function writeJson(json){
	fs.writeFileSync(theRecordFile, JSON.stringify(json, null, '  '), {
		flag: 'w'
	});
}
function getTheJson(name){
	try{
		return JSON.parse(fs.readFileSync(name).toString());
	}catch(e){
		writeJson([]);
		return getTheJson(name);
	}
}

app.listen(5380);
module.exports = app