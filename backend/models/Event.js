import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Concert', 'Comedy', 'Movie', 'Sports', 'Workshop'], required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  bookedSeats: [{ type: String }],
  organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Draft', 'Pending Approval'], default: 'Pending Approval' }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
