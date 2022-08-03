const mongoose = require('mongoose');

const IntentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    contexts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Context' }],
    trainingPhrases: [String],
    action: String,
    followUp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Intent' }],
    parameters: [{ key: String, value: String }],
    responses: [{ type: String, value: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Intent', IntentSchema, 'intents');
