var mongoose = require('mongoose')

//esquema 
var agentSchema = mongoose.Schema({
	id: String,
	state: {type:Boolean,default:false},
	money: Number,
	typeEvent: String,
	timeSale: Number,
	gain: Number,
	numSales: {type:Number,default:0},
	request: {type:String,default:'None'}
});
//Export the schema
module.exports = mongoose.model('Agent', agentSchema);