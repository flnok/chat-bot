const mongoose = require('mongoose');

const IntentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contexts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Context' }],
    event: {
      type: String,
      lowercase: true,
      trim: true,
    },
    trainingPhrases: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    action: {
      type: String,
      lowercase: true,
      trim: true,
    },
    followUp: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Intent' }],
    parameters: [{ key: String, value: String }],
    responses: [{ type: String, value: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Intent', IntentSchema, 'intents');
