var vm = require("vm");
var fs = require("fs");
var path = require("path");

var standard = require("./libs/std_scripts.js");

var hacksim = {
	objects: {
		context: {
			__standard: require("./libs/standard.js"),
			__db: require("./libs/database.js"),
			__scripts: standard.scripts,
		},
		userContext: {
			caller: 'Hackmud Simulation Account'
		},
		secLevels: [
			'nullsec',
			'lowsec',
			'midsec',
			'highsec',
			'fullsec'
		],
		scriptLevels: standard.level
	},
	preprocessCode: function (code) {
		if (typeof code !== "string") return undefined;
		var secLevel = hacksim.getCodeSecLevel(code);
		var code = "/*\"use strict\";*/(function(){return ("+code+")})();";
		code = code.replace(new RegExp("#s\.scripts", 'g'), "__standard");
		code = code.replace(/#s\.([^\.\s\(\{]+)\.([^\.\s\(\{]+)/g, "__scripts.$1.$2");
		code = code.replace(new RegExp("#[^a-zA-Z0-9\.]*", 'g'), "");
		if(code.search("this") !== -1)
			console.log("Warning: Hackmud does not like the use of 'this', even if not used as a keyword, this might not work in game, try hacking around it like 'th'+'is'");
		return {code, secLevel: secLevel};
	},
	getScriptSecLevel: function (scriptName) {
		if (typeof scriptName !== "string")
			return undefined;
		if (scriptName.startsWith('#s.'))
			scriptName = scriptName.replace('#s.','');
		if (scriptName.startsWith('__scripts.'))
			scriptName = scriptName.replace('__scripts.','');
		scriptName = scriptName.split('.');
		if (!hacksim.objects.scriptLevels[scriptName[0]] || hacksim.objects.scriptLevels[scriptName[0]][scriptName[1]])
			return undefined;
		return hacksim.objects.scriptLevels[scriptName[0]][scriptName[1]];
	},
	isSecHigher: function(sec, secondSec) {
		if (sec === undefined) return true;
		if (secondSec === undefined) return false;
		for (var s in hacksim.objects.secLevels) {
			if (s.toLowerCase() == sec.toLowerCase())
				return false;
			if (s.toLowerCase() == secondSec.toLowerCase())
				return true;
		}
		return undefined;
	},
	getCodeSecLevel: function (code) {
		if (typeof code !== "string")
			return undefined;
		var lowestResult = 'fullsec';
		var scriptor, regex = /#s\.([^\.\s\(\{]+)\.([^\.\s\(\{]+)/g;
		while ((scriptor = code.match(regex))) {
			var result = hacksim.getScriptSecLevel(scriptor)
			if (hacksim.isSecHigher(lowestResult, result))
				lowestResult = result;
			code = code.replace(regex, '');
		}
		return lowestResult;
	},
	getCodeFor: function(file) {
		if (typeof file !== "string")
			return undefined;
		if (!file.endsWith(".js")) file+=".js";
		var result = fs.readFileSync(file);
		resultingFileForCode = file;
		/*if (!result)
			file = 'mainScript.js';
			result = fs.readFileSync(file);*/
		if (result) {
			var resultingPreprocess = hacksim.preprocessCode(result.toString());
			result = {code: resultingPreprocess.code, secLevel: resultingPreprocess.secLevel, file: file};
		}
		return result ? result : undefined;
	},
	getScriptsForDir: function(directory) {
		if (typeof directory !== "string")
			return undefined;
		var result = {}, secLevels = {};
		fs.readdir(directory, function(err, files) {
			if (err) {
				console.log(err);
				result = undefined;
				return;
			}
			files.forEach(function(val, i) {
				if (path.extname(val) === ".js") {
					var arr = val.split(path.sep);
					if (arr[arr.length-2] == directory)
						return;
					if (!result[arr[arr.length-2]])
						result[arr[arr.length-2]] = {};
					if (!secLevels[arr[arr.length-2]])
						secLevels[arr[arr.length-2]] = {};
					var codeObj = hacksim.getCodeFor(val);
					result[arr[arr.length-2]][path.basename(val, ".js")] = codeObj.code;
					secLevels[arr[arr.length-2]][path.basename(val, ".js")] = codeObj.secLevel;
				}
			});
		});
		return {code: result, secLevels: secLevels};
	},
	handleArguments: function(args) {
		for(var a in args) {
			if(args.hasOwnProperty(a) && args[a].startsWith('#s.')) {
				var orignal = args[a];
				args[a] = args[a].replace(new RegExp("#s\.scripts", 'g'), "__standard");
				args[a] = args[a].replace(/#s\.([^\.\s\(\{]+)\.([^\.\s\(\{]+)/g, "__scripts.$1.$2");
				var arr = args[a].split('.');
				var context = objects.context;
				if (context[arr[0]] && context[arr[0]][arr[1]] && context[arr[0]][arr[1]][arr[2]]) {
					var func = context[arr[0]][arr[1]][arr[2]];
					var obj = {
						call: function(args) {
							return func(contextObject, args);
						}
					}
					args[a] = obj;
				} else console.log("Warning: Failed to find scriptor '"+original+"', any reference of it shall fail");
			}
		}
		return args;
	},
	processScript: function(scriptName, scriptorDir, argStr) {
		console.log("//////////////////////\n\nConsole Output:\n");
		var codeObj, scripts, secLevels;
		if (scriptName instanceof Array) {
			for (var name in scriptName) {
				codeObj = hacksim.getCodeFor(scriptName[name]);
				if (codeObj) break;
			}
		} else codeObj = hacksim.getCodeFor(scriptName);
		if (scriptorDir instanceof Array) {
			for (var name in scriptorDir) {
				scripts = hacksim.getScriptsForDir(scriptorDir[name]);
				if (scripts) break;
			}
		} else scripts = hacksim.getScriptsForDir(scriptorDir);
		secLevels =  scripts.secLevels;
		scripts = scripts.code;
		var context = hacksim.objects.context;
		var contextObject = hacksim.objects.userContext;
		for (var s in scripts)
			for (var ss in scripts[s]) {
				if (!context.__scripts[s])
					context.__scripts[s] = {};
				if (!objects.scriptLevels[s])
					objects.scriptLevels[s] = {};
				var func = vm.runInNewContext(scripts[s][ss], context, {filename: s+'/'+ss, displayErrors: true, timeout:5000});
				context.__scripts[s][ss] = function(args) {
					return func(contextObject, hacksim.handleArguments(args));
				}
				objects.scriptLevels[s][ss] = secLevels[s][ss];
			}
		var sandbox = vm.runInNewContext(codeObj.code, context, {filename: resultingFileForCode, displayErrors:true, timeout:5000});
		return sandbox(contextObject, (argStr ? hacksim.handleArguments(JSON.parse(argStr)): undefined));
	}
};

module.exports = exports = hacksim;

