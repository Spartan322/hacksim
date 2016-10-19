/* Where we put the quicker standard scripts */

var clone = require("clone"), merge = require("merge"), util = require("util");

var standard = {
	__getScriptLevel: function (name) { return 4; },
	__getSecNames: function () { return ['FULLSEC']; },
	scripts: {
		lib: function() {
				var logmsgs = [];
				return libres = {
					is_arr: function (obj) {
						return obj !== undefined && Array.isArray(obj);
					},
					get_log: function () {
						return logmsgs;
					},
					log: function (lmsg) {
						logmsgs[logmsgs.length] = lmsg;
						console.log(lmsg);
					},
					not_impl: function () {
						return { ok: false, msg: "not implemented" };
					},
					rand_int: function(min, max) {

					},
					are_ids_equal: function (id1, id2) {

					},
					is_obj: function (obj){

					},
					is_str: function (obj){
						return (obj.constructor === String);
					},
					is_num: function (obj){
						return (obj === obj && obj.constructor === Number);
					},
					is_int: function (obj){
						return (libres.is_num(obj) && (obj % 1 === 0));
					},
					is_neg: function (obj){
						return (libres.is_num(obj) && obj < 0);
					},
					is_arr: function (obj){
						return (obj.constructor === Array);
					},
					is_func: function (obj){
						return (obj.constructor === Function);
					},
					is_def: function (obj){
						return (obj !== undefined);
					},
					is_valid_name: function (name){
						return (name.search(/[a-z_][a-z1-9_]*/g) === 0);
					},
					dump: function (obj){
						obj = clone(obj);
						obj[util.inspect.custom] = undefined;
						obj.inspect = undefined;
						return util.inspect(obj, { showHidden: true, depth: null });
					},
					clone: function (obj){
						return clone(obj);
					},
					merge: function (){
						return merge.apply(arguments);
					},
					get_values: function (obj){
						return Object.keys(obj).map(function (k){return obj[k];});
					},
					hash_code: function (obj){
						//TODO
					},
					to_gc_str: function (num){
						//TODO
					},
					to_gc_num: function (str){
						if (!libres.is_str(str)) {
							console.log("WARNING: Hackmud's scripts.lib().to_gc_num can not handle non-string values, please fix the error.\n");
						}
						str = str.toUpperCase().replace("GC", "");
						if (str.search(/[1-9][1-9][1-9][1-9]/g) !== -1)
							return {ok: false, msg: "GC string \"1000GC\" is not in correct format. Example GC strings: \"1M234K567GC\", \"1B5KGC\", \"2MGC\", \"9GC\""}
						var amountRep = ['T','B','M','K'], result = 0, k, multi = 1000000000000;
						for (i = 0; i < amountRep.length+1; i++) {
							var loc;
							if (i === amountRep.length) loc = str.length;
							else loc = str.search(amountRep[i]);
							if (loc !== -1) {
								var val = str.slice(0, loc);
								str = str.slice(loc+1);
								if (val === '') val = 0;
								result += val * multi;
							}
							multi/=1000;
						}
						return result;
					},
					to_game_timestr: function (obj){
						//TODO
					},
					security_level_names: function() {
						return standard.__getSecNames();
					},
					get_security_level_name: function (sec) {
						return libres.security_level_names()[sec];
					}
				};
		},
		get_level: function (args) {
			return standard.__getScriptLevel(args.name);
		},
		get_access_level: function(args) {
			var level = standard.scripts.get_level(args);
			if (level.ok !== undefined)
				return level;
			return 'PUBLIC';
		}
	}
};

module.exports = exports = standard;