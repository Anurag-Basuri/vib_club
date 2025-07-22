import { createContext, useEffect, useState, useCallback } from 'react';
import { memberLogin, memberLogout, memberRegister, adminLogin, adminLogout, adminRegister } from '../services/authServices.js';
import { getToken, decodeToken, removeToken } from '../utils/handleToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	// Load user from token on mount
	useEffect(() => {
		const { accessToken } = getToken();
		if (accessToken) {
			const decoded = decodeToken(accessToken);
			if (decoded) {
				setUser(decoded);
				setIsAuthenticated(true);
			} else {
				removeToken();
			}
		}
		setLoading(false);
	}, []);

	// Member Login
	const loginMember = useCallback(async (credentials) => {
		const data = await memberLogin(credentials);
		const decoded = decodeToken(data.accessToken);
		setUser(decoded);
		setIsAuthenticated(true);
	}, []);

	// Member Register
	const registerMember = useCallback(async (details) => {
		const data = await memberRegister(details);
		const decoded = decodeToken(data.accessToken);
		setUser(decoded);
		setIsAuthenticated(true);
	}, []);

	// Member Logout
	const logoutMember = useCallback(async () => {
		await memberLogout();
		setUser(null);
		setIsAuthenticated(false);
	}, []);

	// Admin Login
	const loginAdmin = useCallback(async (credentials) => {
		const data = await adminLogin(credentials);
		const decoded = decodeToken(data.accessToken);
		setUser(decoded);
		setIsAuthenticated(true);
	}, []);

	// Admin Register
	const registerAdmin = useCallback(async (details) => {
		const data = await adminRegister(details);
		const decoded = decodeToken(data.accessToken);
		setUser(decoded);
		setIsAuthenticated(true);
	}, []);

	// Admin Logout
	const logoutAdmin = useCallback(async () => {
		await adminLogout();
		setUser(null);
		setIsAuthenticated(false);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				loading,
				loginMember,
				registerMember,
				logoutMember,
				loginAdmin,
				registerAdmin,
				logoutAdmin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
