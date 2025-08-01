import { publicClient } from '../services/api.js';
import { load } from '@cashfreepayments/cashfree-js';

export const handlePayment = async ({
	formData,
	eventData,
	setLoading,
	setError,
	setShowPaymentForm,
	onSuccess,
	onFailure,
}) => {
	setLoading(true);
	setError('');

	try {
		// Validate form data
		const { name, email, phone, lpuId } = formData;
		if (!name || !email || !phone || !lpuId) {
			setError('Please fill all required fields.');
			setLoading(false);
			return;
		}

		// Create payment order
		const response = await publicClient.post('api/cashfree/create-order', {
			...formData,
			eventId: eventData?._id,
		});

		const orderData = response.data?.data;
		if (!orderData?.payment_session_id) {
			throw new Error('Invalid order response from server.');
		}

		// Load and initialize Cashfree
		const cashfree = await load({
            mode: import.meta.env.VITE_CASHFREE_MODE || 'sandbox',
        });

		// Close the payment form before redirecting
		if (setShowPaymentForm) {
			setShowPaymentForm(false);
		}

		// Initiate payment
		await cashfree.checkout({
			paymentSessionId: orderData.payment_session_id,
			redirectTarget: '_self', // Change to '_blank' for new tab
		});

		// Call success callback if provided
		if (onSuccess) {
			onSuccess(orderData);
		}
	} catch (error) {
		console.error('Payment error:', error);
		const errorMessage =
			error?.response?.data?.message || error?.message || 'Payment failed. Please try again.';
		setError(errorMessage);

		// Call failure callback if provided
		if (onFailure) {
			onFailure(error);
		}
	} finally {
		setLoading(false);
	}
};

export default handlePayment;
