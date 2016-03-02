var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StanzaSchema = new Schema({
  text: {
    type: String,
    required: true,
    unique: true
  },
  loc: { 
    type: { type: String }, 
    coordinates: []
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
});

StanzaSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Stanzas', StanzaSchema);
