var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ipAgentSchema = new Schema({
  date: { type: Date, required: true },
  ipaddress: { type: String, required: true },
  os: { type: String, required: true },
  device: { type: String, required: true },
  browser: { type: String, required: true }
});

var schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: { type: String, required: true },
    created: ipAgentSchema
  },
  { timestamps: true }
);

schema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

function autoPopulateSubs(next) {
  this.populate({ path: 'user', model: 'User' });
  next();
}

schema.pre('findOne', autoPopulateSubs).pre('find', autoPopulateSubs);

module.exports = mongoose.model('Token', schema);
