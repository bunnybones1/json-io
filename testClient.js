var JSONIO = require('./');
var defaultData = {
	title : "Lorem Ipsum",
	description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	timesRead: 0,
	iDontEvenKnow: true
}

//You can change the file-io-server port if you need to.
JSONIO.port = 3000;

var jsonIO = new JSONIO('test.json', defaultData, function() {
		console.log("READY!");
		jsonIO.data.timesRead++;
		jsonIO.save();
	},
	function(err) {
		throw err;
	}
);
