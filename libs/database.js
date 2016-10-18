var MongoServer = require("mongo-sync").Server;

var database = {
	collection: null,
	database: null,
	result: [],
	flag: false,
	server: null,
	connect: function() {
		this.server = new MongoServer("127.0.0.1");
		this.database = this.server("hackmud");
		this.collection = this.database.getCollection("hacksim");
	},
	remove: function(id) {
		return this.collection.remove(id);
	},
	update: function (id, act) {
		return this.collection.update(id, act);
	},
	insert: function (obj) {
		return this.collection.insert(obj);
	},
	find: function (id) {
		var self = this;
		var res = self.collection.find(id);
		return {
			array: function () {                
				return res.toArray();
			}
		};
	},
	cleanup: function () {},
	removeCollection: function () {
		database.collection.remove();
	},
	disconnect: function () {
		this.server.close();
	}
};

module.exports = exports = database;