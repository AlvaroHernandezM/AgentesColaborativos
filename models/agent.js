var mongoose = require('mongoose')

//esquema 
var agentSchema = mongoose.Schema({
	id: String,
	state: {type:Boolean,default:true},
	money: Number,
	typeEvent: String,
	timeSale: Number,
	gain: Number,
	numSales: {type:Number,default:0},
	request: String
});
//Export the schema
module.exports = mongoose.model('Agent', agentSchema);