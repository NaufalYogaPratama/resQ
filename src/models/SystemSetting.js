import mongoose from 'mongoose';

const SystemSettingSchema = new mongoose.Schema({
  modeDarurat: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);