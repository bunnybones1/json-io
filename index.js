function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {

		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);

	} else if (typeof XDomainRequest != "undefined") {

		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);

	} else {

		// Otherwise, CORS is not supported by the browser.
		xhr = null;

	}
	return xhr;
}

function put(url, data, callback, errorCallback){

	var xhr = createCORSRequest('PUT', url);
	if (!xhr){
		throw new Error('CORS not supported');
	}

	xhr.send(data);

	/*SUCCESS -- do somenthing with data*/
	if(callback) {
		xhr.onload = function(){
			// process the response.
			callback(xhr.responseText);
		};
	}

	if(errorCallback) {
		xhr.onerror = function(e){
			errorCallback(e);
		};
	}
}

function getJSON(url, callback, errorCallback){

	var xhr = createCORSRequest('GET', url);
	if (!xhr){
		throw new Error('CORS not supported');
	}
	xhr.send();

	/*SUCCESS -- do somenthing with data*/
	xhr.onload = function(){
		// process the response.
		if(xhr.status == '404' && errorCallback) {
			errorCallback(xhr.responseText);
		} else if(callback) {
			callback(xhr.responseText);
		}
	};

	if(errorCallback) {
		xhr.onerror = function(e){
			errorCallback(e);
		};
	}
}

function JSONIO(filePath, defaultData, callback, errorCallback) {
	this.filePath = filePath;
	if(JSONIO.debugLevel >= 1) console.log('IO open to', filePath, 'on port: ' + JSONIO.port);
	this.fileioPath = JSONIO.fileIOServerString + filePath;
	var _this = this;
	getJSON(this.fileioPath, function(response) {
			if(JSONIO.debugLevel >= 1) console.log(response);
			_this.data = JSON.parse(response);
			if(callback) callback();
		},
		function(response) {
			if(JSONIO.debugLevel >= 1) console.log(response);
			put(_this.fileioPath, JSON.stringify(defaultData, undefined, JSONIO.pretty ? '\t' : undefined), function(response) {
				console.log(response);
				_this.data = defaultData;
				if(callback) callback();
			}, errorCallback);
		}
	);
}

JSONIO.prototype = {
	save: function(callback, errorCallback) {
		put(this.fileioPath, JSON.stringify(this.data, undefined, JSONIO.pretty ? '\t' : undefined), callback, errorCallback);
	},
	load: function(callback, errorCallback) {
		getJSON(this.fileioPath, callback, errorCallback)
	}
}

//module parameters
JSONIO.setPort = function (port) {
	JSONIO.port = port;
	JSONIO.debugLevel = 0;
	var loc = window.location;
	JSONIO.fileIOServerString = loc.protocol + '//' + loc.hostname + ':' + JSONIO.port + loc.pathname;
}
JSONIO.setPort(3000);

JSONIO.pretty = true;

module.exports = JSONIO;