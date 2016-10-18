/* Where we put the quicker standard scripts */

var standard = {
	lib: function() {
			return {
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
				}
			};
	},
	get_level: function (args) {
		if (args.name) {
			return 4;
		} else return {};
	}
};

module.exports = exports = standard;