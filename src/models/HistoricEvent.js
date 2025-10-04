import mongoose from 'mongoose';

const HistoricEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['Banjir', 'Tanah Longsor', 'Gempa Bumi', 'Lainnya'],
    required: true,
  },
  impactedAreas: {
    type: {
      type: String,
      enum: ['MultiPoint'], 
      required: true,
    },
    coordinates: {
      type: [[Number]], 
      required: true,
    },
  },
  source: {
    type: String,
  }
}, {
  timestamps: true,
});

HistoricEventSchema.index({ impactedAreas: '2dsphere' });

export default mongoose.models.HistoricEvent || mongoose.model('HistoricEvent', HistoricEventSchema);