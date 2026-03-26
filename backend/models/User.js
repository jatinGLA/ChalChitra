import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ORGANISER', 'ADMIN'], default: 'USER' },
  phone: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
