import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, 
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    referenceId: { type: String },
    paymentTime: { type: Date },
    failureReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);