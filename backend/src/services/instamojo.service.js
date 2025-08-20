import axios from 'axios';
import { config } from 'dotenv';
config();

const INSTAMOJO_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.instamojo.com/v2'
    : 'https://test.instamojo.com/v2';
const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY || '68422fce4df07f082b83f80ec8aa9eb6';
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN || 'd56633e22ecc452b397caae09f546ec7';

async function createInstamojoOrder(orderDetails) {
  try {
    const response = await axios.post(
      `${INSTAMOJO_BASE_URL}/payment-requests/`,
      orderDetails,
      {
        headers: {
          'X-Api-Key': INSTAMOJO_API_KEY,
          'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error('Instamojo error:', err.response.data);
      throw new Error(JSON.stringify(err.response.data));
    }
    throw new Error(err.message || 'Instamojo order creation failed');
  }
}

export default createInstamojoOrder;
