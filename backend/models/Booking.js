import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentId: { type: String },
  eTicketUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
