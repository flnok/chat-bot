const mongoose = require('mongoose');

const ContextSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    lifeSpan: Number,
    parameters: [{ key: String, value: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Context', ContextSchema, 'contexts');
