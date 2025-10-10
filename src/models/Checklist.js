import mongoose from 'mongoose';
import '@/models/User';

const ChecklistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  checkedItems: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Checklist || mongoose.model('Checklist', ChecklistSchema);