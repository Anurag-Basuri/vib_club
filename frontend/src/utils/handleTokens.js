import { jwtDecode } from 'jwt-decode';

export const setToken = (Tokens) => {
  try {
		localStorage.setItem('accessToken', Tokens.accessToken);
		localStorage.setItem('refreshToken', Tokens.refreshToken);
	} catch (err) {
		console.error('Error saving token', err);
	}
}