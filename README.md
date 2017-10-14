# Introduction

A simple Node DNS Server proxy based on [Peteris Rocks tutorial](https://peteris.rocks/blog/dns-proxy-server-in-node-js-with-ui/)

# Running

## Running localy

Build the project 

	npm install

Starting the server 

	npm start

## Running on docker
	
	npm install # install dependencies
	gradle build-dev # build docker image and run the container starting the app

# Testing if DNS is working

	$ host google.com 127.0.0.1
	Using domain server:
	Name: 127.0.0.1
	Address: 127.0.0.1#53
	Aliases:

# Adding DNS entries

you can edit `records.json` manually or use the **Gui Editor**

# Gui editor

the password is `cat`

	http://<localhost or docker container ip>:5380/

# Setting this proxy as default proxy 

	sudo echo 'nameserver <127.0.0.1 or docker container ip>' > /etc/resolv.conf

# A entry example

records.json

	[
	  {
	    "records": [
	      {
	        "type": "A",
	        "address": "127.0.0.1",
	        "ttl": 300,
	        "name": "testing.mageddo.com"
	      }
	    ],
	    "domain": "testing.mageddo.com"
	  }
	]

testing on terminal 

	$ host testing.mageddo.com 127.0.0.1
	Using domain server:
	Name: 127.0.0.1
	Address: 127.0.0.1#53
	Aliases: 

	testing3.mageddo.com has address 127.0.0.1
	testing3.mageddo.com has address 127.0.0.1
	testing3.mageddo.com has address 127.0.0.1

# License

This project is released under version 2.0 of the [Apache License][].
[Apache License]: http://www.apache.org/licenses/LICENSE-2.0

# Credits
* [Pēteris Ņikiforovs (project owner)](https://peteris.rocks/)