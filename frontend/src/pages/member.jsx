import React, { useState, useEffect, useRef, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User,
	Mail,
	BookOpen,
	Edit,
	Globe,
	Linkedin,
	Github,
	Lock,
	Upload,
	Check,
	Eye,
	EyeOff,
	X,
	Copy,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { apiClient } from "../services/api.js";
import { useNavigate } from 'react-router-dom';

const MemberProfile = () => {
	const { user, loading, logoutMember } = useAuth();
	const [currentUser, setCurrentUser] = useState({});

	useEffect(() => {
		const fetchCurrentUser = async () => {
			try {
				const response = await apiClient.get('api/members/me');
				console.log('Current User:', response.data);
				setCurrentUser(response.data);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchCurrentUser();
	}, []);

	return (
		<div>
			{/* dummy content */}
			<div className="p-4 bg-white rounded-lg shadow-md">
				<div className="flex items-center space-x-4">
					<img
						src={currentUser.profileImage || '/default-profile.png'}
						alt="Profile"
						className="w-16 h-16 rounded-full"
					/>
					<div>
						<h2 className="text-xl font-semibold">{currentUser.fullname}</h2>
						<p className="text-gray-600">{currentUser.department}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberProfile;
