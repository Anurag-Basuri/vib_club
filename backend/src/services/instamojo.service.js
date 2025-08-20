import axios from "axios";
import { config } from "dotenv";
config();

const INSTAMOJO_AUTH_URL = "https://api.instamojo.com/oauth2/token/"

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  if (accessToken && tokenExpiry && now < tokenExpiry) {
    return accessToken; // still valid
  }

  try {
    const response = await axios.post(
      INSTAMOJO_AUTH_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in - 60;

    console.log("✅ Instamojo token fetched successfully");
    return accessToken;
  } catch (error) {
    console.error("❌ Failed to fetch Instamojo token:", error.response?.data || error.message);
    throw new Error("Instamojo authentication failed");
  }
}

/**
 * Create Instamojo Payment Request
 */
export async function createInstamojoOrder(orderDetails) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${INSTAMOJO_BASE_URL}/gateway/orders/`,
      orderDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Instamojo order error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Instamojo order creation failed");
  }
}
