import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
	{
		orderId: {
            type: String,
            required: true,
            unique: true
        },
		user: {
			name: {
                type: String,
                required: true
            },
			email: {
                type: String,
                required: true
            },
		},
		amount: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
			default: 'PENDING',
		},
		referenceId: {
			type: String,
		},
		paymentTime: {
			type: Date,
		},
		failureReason: {
			type: String,
		},
		upiId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
