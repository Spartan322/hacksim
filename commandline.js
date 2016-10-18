var hacksim = require('./main.js');

function parseArgs(args) {
	var result = {};
	args.forEach(function (val, i) {
		var helper = val.split("=");
		if (helper.length > 1)
			result[helper[0]] = helper[1];
		else if (val.startsWith("--"))
			result[val.slice(2)] = true;
		else if (val.startsWith("-"))
			result[val.slice(1)] = true;
	});
	return result;
}

var args = parseArgs(process.argv.slice(2));

hacksim.processScript([args['scriptName'], args['file'], 'mainScript.js'], [args['scripts'], 'scripts'], args['arguments'])