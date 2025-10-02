import mongoose from 'mongoose';

const SystemSettingSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'global',
    unique: true,
  },
  modeDarurat: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);