// components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Profile = ({ memberId }) => {
	const [member, setMember] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	useEffect(() => {
		// For demo purposes, we'll use mock data
		const mockMember = {
			memberID: '123e4567-e89b-12d3-a456-426614174000',
			profilePicture: {
				url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
				publicId: 'profile_abc123',
			},
			fullname: 'Alex Johnson',
			LpuId: '12345678',
			email: 'alex.johnson@example.com',
			program: 'Computer Science',
			year: 3,
			hosteler: true,
			hostel: 'BH-3',
			socialLinks: [
				{ platform: 'GitHub', url: 'https://github.com/alexjohnson' },
				{ platform: 'LinkedIn', url: 'https://linkedin.com/in/alexjohnson' },
			],
			department: 'Technical',
			designation: 'Head',
			bio: 'Passionate about technology and innovation. Currently working on AI projects.',
			joinedAt: '2022-01-15T00:00:00.000Z',
			status: 'active',
			restriction: {
				time: null,
				reason: null,
				isRestricted: false,
			},
		};

		setMember(mockMember);
		reset(mockMember);
		setIsLoading(false);
	}, [memberId, reset]);

	const onSubmit = async (data) => {
		try {
			// In a real app, you would make an API call here
			// const response = await axios.put(`/api/members/${memberId}`, data);
			setMember(data);
			setIsEditing(false);
			setMessage('Profile updated successfully!');
			setTimeout(() => setMessage(''), 3000);
		} catch (error) {
			console.error('Error updating profile:', error);
			setMessage('Failed to update profile');
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
				<div className="text-white text-xl">Loading profile...</div>
			</div>
		);
	}

	if (!member) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
				<div className="text-white text-xl">Profile not found</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
				{/* Cover Photo */}
				<div className="h-48 sm:h-64 relative overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
						alt="Cover"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
				</div>

				{/* Profile Header */}
				<div className="px-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-end relative -mt-16 sm:-mt-20">
					<div className="relative group">
						<img
							src={member.profilePicture?.url || '/default-avatar.png'}
							alt={member.fullname}
							className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-800 bg-slate-800 object-cover"
						/>
						{isEditing && (
							<div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
								<span className="text-white text-sm">Change</span>
							</div>
						)}
					</div>

					<div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
						<h1 className="text-2xl sm:text-3xl font-bold text-white">
							{member.fullname}
						</h1>
						<p className="text-slate-300 mt-1">{member.bio || 'No bio provided'}</p>
						<p className="text-blue-400 mt-1">
							{member.designation} • {member.department}
						</p>
					</div>

					{!isEditing ? (
						<button
							className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
							onClick={() => setIsEditing(true)}
						>
							Edit Profile
						</button>
					) : (
						<div className="flex space-x-2 mt-4 sm:mt-0">
							<button
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
								onClick={handleSubmit(onSubmit)}
							>
								Save
							</button>
							<button
								className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
								onClick={() => {
									setIsEditing(false);
									reset(member);
								}}
							>
								Cancel
							</button>
						</div>
					)}
				</div>

				{/* Profile Content */}
				<div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						<PersonalInfo
							member={member}
							isEditing={isEditing}
							register={register}
							errors={errors}
						/>

						<AcademicInfo
							member={member}
							isEditing={isEditing}
							register={register}
							errors={errors}
						/>

						<SocialLinks member={member} isEditing={isEditing} register={register} />
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<DepartmentCard member={member} />
						<StatusCard member={member} />
					</div>
				</div>

				{message && (
					<div className="px-6 sm:px-8 pb-6">
						<div
							className={`p-3 rounded-lg ${message.includes('success') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}
						>
							{message}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// Sub-components
const PersonalInfo = ({ member, isEditing, register, errors }) => (
	<div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
		<h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label className="block text-slate-400 text-sm mb-1">Email</label>
				{isEditing ? (
					<>
						<input
							type="email"
							defaultValue={member.email}
							className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^\S+@\S+$/i,
									message: 'Invalid email address',
								},
							})}
						/>
						{errors.email && (
							<span className="text-red-400 text-sm">{errors.email.message}</span>
						)}
					</>
				) : (
					<p className="text-white">{member.email}</p>
				)}
			</div>

			<div>
				<label className="block text-slate-400 text-sm mb-1">LPU ID</label>
				{isEditing ? (
					<>
						<input
							type="text"
							defaultValue={member.LpuId}
							className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register('LpuId', {
								required: 'LPU ID is required',
								pattern: {
									value: /^\d{8}$/,
									message: 'Must be 8 digits',
								},
							})}
						/>
						{errors.LpuId && (
							<span className="text-red-400 text-sm">{errors.LpuId.message}</span>
						)}
					</>
				) : (
					<p className="text-white">{member.LpuId}</p>
				)}
			</div>

			<div>
				<label className="block text-slate-400 text-sm mb-1">Hosteler</label>
				{isEditing ? (
					<select
						defaultValue={member.hosteler}
						className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						{...register('hosteler')}
					>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				) : (
					<p className="text-white">{member.hosteler ? 'Yes' : 'No'}</p>
				)}
			</div>

			{member.hosteler && (
				<div>
					<label className="block text-slate-400 text-sm mb-1">Hostel</label>
					{isEditing ? (
						<select
							defaultValue={member.hostel}
							className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register('hostel')}
						>
							<option value="">Select Hostel</option>
							<option value="BH-1">BH-1</option>
							<option value="BH-2">BH-2</option>
							<option value="BH-3">BH-3</option>
							<option value="BH-4">BH-4</option>
							<option value="BH-5">BH-5</option>
							<option value="BH-6">BH-6</option>
							<option value="BH-7">BH-7</option>
							<option value="GH-1">GH-1</option>
							<option value="GH-2">GH-2</option>
							<option value="GH-3">GH-3</option>
							<option value="GH-4">GH-4</option>
							<option value="GH-5">GH-5</option>
						</select>
					) : (
						<p className="text-white">{member.hostel}</p>
					)}
				</div>
			)}
		</div>
	</div>
);

const AcademicInfo = ({ member, isEditing, register, errors }) => (
	<div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
		<h2 className="text-xl font-semibold text-white mb-4">Academic Information</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label className="block text-slate-400 text-sm mb-1">Program</label>
				{isEditing ? (
					<input
						type="text"
						defaultValue={member.program}
						className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						{...register('program')}
					/>
				) : (
					<p className="text-white">{member.program || 'Not specified'}</p>
				)}
			</div>

			<div>
				<label className="block text-slate-400 text-sm mb-1">Year</label>
				{isEditing ? (
					<select
						defaultValue={member.year}
						className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						{...register('year')}
					>
						<option value="">Select Year</option>
						<option value="1">1st Year</option>
						<option value="2">2nd Year</option>
						<option value="3">3rd Year</option>
						<option value="4">4th Year</option>
					</select>
				) : (
					<p className="text-white">
						{member.year ? `${member.year} Year` : 'Not specified'}
					</p>
				)}
			</div>
		</div>
	</div>
);

const SocialLinks = ({ member, isEditing, register }) => (
	<div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
		<h2 className="text-xl font-semibold text-white mb-4">Social Links</h2>
		{isEditing ? (
			<div className="space-y-3">
				{member.socialLinks &&
					member.socialLinks.map((link, index) => (
						<div key={index} className="flex space-x-2">
							<input
								type="text"
								placeholder="Platform (e.g., GitHub)"
								defaultValue={link.platform}
								className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								{...register(`socialLinks[${index}].platform`)}
							/>
							<input
								type="url"
								placeholder="URL"
								defaultValue={link.url}
								className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								{...register(`socialLinks[${index}].url`)}
							/>
						</div>
					))}
				<button
					type="button"
					className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-1"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clipRule="evenodd"
						/>
					</svg>
					Add Another Link
				</button>
			</div>
		) : (
			<div className="flex flex-wrap gap-2">
				{member.socialLinks && member.socialLinks.length > 0 ? (
					member.socialLinks.map((link, index) => (
						<a
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-slate-700 hover:bg-slate-600 text-blue-400 px-4 py-2 rounded-lg transition-colors"
						>
							{link.platform}
						</a>
					))
				) : (
					<p className="text-slate-400">No social links added</p>
				)}
			</div>
		)}
	</div>
);

const DepartmentCard = ({ member }) => (
	<div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
		<h3 className="text-lg font-semibold text-white mb-4">Department</h3>
		<div className="bg-blue-900 bg-opacity-50 text-blue-300 inline-block px-3 py-1 rounded-full text-sm mb-3">
			{member.department}
		</div>
		<p className="text-slate-300 mt-2">
			Designation: <span className="text-white">{member.designation}</span>
		</p>
		<p className="text-slate-300 mt-2">
			Joined:{' '}
			<span className="text-white">{new Date(member.joinedAt).toLocaleDateString()}</span>
		</p>
	</div>
);

const StatusCard = ({ member }) => (
	<div
		className={`bg-slate-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border ${member.status === 'active' ? 'border-green-700' : 'border-red-700'}`}
	>
		<h3 className="text-lg font-semibold text-white mb-4">Status</h3>
		<div
			className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
				member.status === 'active'
					? 'bg-green-900 text-green-300'
					: 'bg-red-900 text-red-300'
			}`}
		>
			{member.status.toUpperCase()}
		</div>
		{member.restriction.isRestricted && (
			<div className="mt-4 pt-4 border-t border-slate-700">
				<p className="text-slate-300">
					<strong>Restriction Reason:</strong> {member.restriction.reason}
				</p>
				<p className="text-slate-300 mt-1">
					<strong>Until:</strong> {new Date(member.restriction.time).toLocaleDateString()}
				</p>
			</div>
		)}
	</div>
);

export default Profile;
