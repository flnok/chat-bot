const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema(
  {
    content: String,
    intent: { type: mongoose.Schema.Types.ObjectId, ref: 'Intent' },
    responses: [{ type: String, value: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Training', TrainingSchema, 'training');
