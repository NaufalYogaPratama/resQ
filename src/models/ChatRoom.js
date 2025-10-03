import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
    unique: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);