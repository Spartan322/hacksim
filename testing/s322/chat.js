function (context, args) {
	if (!args) {
		return {
			ok:true,
			msg:"Operation of s322.chat allows you to supply a chat name as a key and a msg as a value\
			\nYou may also supply s322.chat with values starting with @ to chat to specific players\
			\ns322.chat also allows multiple messages sent by one command to either channels or users\
			\nUsage: s322.chat {channelName:\"msg to send\", \"@userName\":\"msg to user\""
		}
	}
	
    var chans = [],
    msgs = [],
    response = {ok:true, msg:"Empty Parameters"};
    for (var arr = Object.keys(args), i = 0; i < arr.length; i++) {
        if (args.hasOwnProperty(arr[i]) && args[arr[i]]) {
			if (arr[i].charAt(0) == "@") {
				response = #s.chats.tell({to:arr[i].substring(1), msg:args[arr[i]]});
			} else
				response = #s.chats.send({channel:arr[i], msg:args[arr[i]]});
        }
    }
    return response;
}