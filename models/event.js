var mongoose = require('mongoose')

//esquema 
var eventSchema = mongoose.Schema({
	name: String,
	state: {type:Boolean,default:true},
	numTickets: Number,
	price: Number,
	typeEvent: String,
	dateEvent: Number,
	agent: String
});
//Export the schema
module.exports = mongoose.model('Event', eventSchema);