
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, 'Message cannot be empty'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Helps retrieve messages between users in chronological order.
messageSchema.index({
  sender: 1,
  receiver: 1,
  createdAt: 1,
});

messageSchema.index({
  receiver: 1,
  read: 1,
  createdAt: -1,
});

module.exports = mongoose.model('Message', messageSchema);
