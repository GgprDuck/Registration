const mongoose = require("mongoose");

const schema = mongoose.Schema({
	login: 'String',
	password: 'String',
	Access_tocken: 'String',
	Refresh_tocken:'String',
})

module.exports = mongoose.model("User", schema);