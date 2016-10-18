var vm = require("vm");
var fs = require("fs");
var path = require("path");

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

function preprocessCode(code) {
	if (typeof code !== "string") return undefined;
	var code = "/*\"use strict\";*/(function(){return ("+code+")})();";
	code = code.replace(new RegExp("#s\.scripts", 'g'), "__standard");
	code = code.replace(/#s\.([^\.\s\(\{]+)\.([^\.\s\(\{]+)/g, "__scripts.$1.$2");
	code = code.replace(new RegExp("#[^a-zA-Z0-9\.]*", 'g'), "");
	return code;
}

var resultingFileForCode;

function getCodeFor(file) {
	if (!file.endsWith(".js")) file+=".js";
	var result = fs.readFileSync(file);
	resultingFileForCode = file;
	if (!result)
		result = fs.readFileSync('main.js');
		resultingFileForCode = 'main.js';
	if (result)
		return preprocessCode(result.toString());
	resultingFileForCode = '';
	return undefined;
}

function getScriptsForDir(directory) {
	if (typeof directory !== "string")
		return undefined;
	result = {};
	fs.readdir(directory, function(err, files) {
		if (err) {
			console.log(err);
			return;
		}
		files.forEach(function(val, i) {
			if (path.extname(val) === ".js") {
				var arr = val.split(path.sep);
				if (arr[arr.length-2] == directory)
					return;
				if (!result[arr[arr.length-2]])
					result[arr[arr.length-2]] = {};
				result[arr[arr.length-2]][path.basename(val, ".js")] = getCodeFor(val);
			}
		});
	});
	return result;
}

var context = {
	__standard: require("./libs/standard.js"),
	__db: require("./libs/database.js"),
	__scripts: require("./libs/std_scripts.js"),
};

var contextObject = {
	caller: 'Hackmud Simulation Account'
};

var code = getCodeFor(args['scriptName'], true);
if (!code)
	code = getCodeFor(args['file'], true);

var scripts = getScriptsForDir(args['scripts']);
if (!scripts)
	scripts = getScriptsForDir('scripts');

for (var s in scripts)
	for (var ss in scripts[s]) {
		if (!context.__scripts[s])
			context.__scripts[s] = {};
		var func = vm.runInNewContext(scripts[s][ss], context, {filename: s+'/'+ss, displayErrors: true, timeout:5000});
		context.__scripts[s][ss] = function(args) {
			return func(contextObject, args);
		}
	}

var sandbox = vm.runInNewContext(code, context, {filename: resultingFileForCode, displayErrors:true, timeout:5000});
return sandbox(contextObject, (args['arguments']?JSON.parse(args['arguments']): {}));