const mongoose = require('mongoose');

const IntentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    contexts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Context' }],
    event: {
      type: String,
      uppercase: true,
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
    parameters: [
      {
        key: {
          type: String,
          lowercase: true,
          trim: true,
        },
        value: {
          type: String,
          lowercase: true,
          trim: true,
        },
      },
    ],
    responses: [
      {
        type: { type: String },
        value: String,
        list: [{}],
        image: {},
        chip: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Intent', IntentSchema, 'intents');
