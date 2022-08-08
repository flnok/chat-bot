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
    inContexts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Context' }],
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
      },
    ],
    responses: [
      {
        _id: false,
        type: { type: String },
        text: String,
        options: {
          _id: false,
          type: [{ title: String, link: String, event: String }],
          default: undefined,
        },
        image: {
          _id: false,
          type: [{ rawUrl: String, text: String }],
          default: undefined,
        },
        chips: { _id: false, type: [{ text: String }], default: undefined },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Intent', IntentSchema, 'intents');
