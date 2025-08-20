import axios from 'axios';
import { config } from 'dotenv';
config();

const INSTAMOJO_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.instamojo.com/v2'
    : 'https://test.instamojo.com/v2';

const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY;
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;

console.log('Instamojo Key:', INSTAMOJO_API_KEY);
console.log('Instamojo Token:', INSTAMOJO_AUTH_TOKEN);

async function createInstamojoOrder(orderDetails) {
  try {
    console.log('Instamojo Key (runtime):', INSTAMOJO_API_KEY);
    console.log('Instamojo Token (runtime):', INSTAMOJO_AUTH_TOKEN);
    const response = await axios.post(
      `${INSTAMOJO_BASE_URL}/payment_requests/`,
      orderDetails,
      {
        headers: {
          'X-Api-Key': INSTAMOJO_API_KEY,
          'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
