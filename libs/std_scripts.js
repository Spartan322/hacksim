var scripts = {
	chats: {
		tell: function(args) {
			console.log("Telling to '"+args.to+"' saying '"+args.msg+"'");
		},
		send: function(args) {
			console.log("Sending to '"+args.channel+"' saying '"+args.msg+"'")
		},
		join: function(args) {
			console.log("Joining '"+args.channel+"'");
		},
		leave: function(args) {
			console.log("Leaving '"+args.channel+"'");
		}
	}
}

module.exports = exports = scripts;