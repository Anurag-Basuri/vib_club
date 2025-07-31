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
			phone: {
				type: String,
				required: true
			},
			lpuId: {
				type: String,
				required: true
			}
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
		paymentTime: {
			type: Date,
			default: Date.now,
		},
		failureReason: {
			type: String,
		},
		paymentMethod: {
			type: String,
			enum: ['UPI', 'CARD', 'NET_BANKING', 'WALLET', 'MULTIPLE_OPTIONS'],
			default: 'MULTIPLE_OPTIONS',
		},
		eventId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
