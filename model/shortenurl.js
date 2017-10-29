var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShortenUrl = new Schema({
		url: {type: String, required: true},
    shortened: { type: Number, 
                default: function() {
                  return Math.floor(Math.random() * 10000 + 5000);
                }, 
                required: true,
                unique: true},
		createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ShortenUrl', ShortenUrl);