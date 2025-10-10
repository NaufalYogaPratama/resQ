import mongoose from 'mongoose';
import '@/models/User';

const MessageSchema = new mongoose.Schema({
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

MessageSchema.index({ chatRoomId: 1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);