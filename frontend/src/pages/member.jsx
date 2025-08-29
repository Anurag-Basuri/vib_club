import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

// Icon Components
const EditIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
	</svg>
);

const SaveIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
			clipRule="evenodd"
		/>
	</svg>
);

const UserIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
			clipRule="evenodd"
		/>
	</svg>
);

const MailIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
		<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
	</svg>
);

const IdIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
			clipRule="evenodd"
		/>
	</svg>
);

const HomeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
	</svg>
);

const BuildingIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-6v2zm0-4h6V8h-6v2z"
			clipRule="evenodd"
		/>
	</svg>
);

const AcademicIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
	</svg>
);

const BookIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12z" />
	</svg>
);

const CalendarIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
			clipRule="evenodd"
		/>
	</svg>
);

const LinkIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
			clipRule="evenodd"
		/>
	</svg>
);

const TrophyIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M3 4a1 1 0 000 2h.5l.5 2h9l.5-2H14a1 1 0 100-2H3zm2.5 3l.5 2v3a3 3 0 106 0V9l.5-2h-7zM10 15a1 1 0 100-2 1 1 0 000 2z"
			clipRule="evenodd"
		/>
	</svg>
);

const StatusIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
			clipRule="evenodd"
		/>
	</svg>
);

const ChartIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
	</svg>
);

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
			clipRule="evenodd"
		/>
	</svg>
);

const AlertIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
			clipRule="evenodd"
		/>
	</svg>
);

const PlusIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
	</svg>
);

const CancelIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
	</svg>
);

// Helper function to get social icons
const getSocialIcon = (platform) => {
	const lowerPlatform = platform.toLowerCase();

	if (lowerPlatform.includes('github')) {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clipRule="evenodd"
				/>
			</svg>
		);
	} else if (lowerPlatform.includes('linkedin')) {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
			</svg>
		);
	} else if (lowerPlatform.includes('twitter') || lowerPlatform.includes('x')) {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
			</svg>
		);
	} else if (lowerPlatform.includes('instagram')) {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fillRule="evenodd"
					d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.509.5.902 1.104 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.903 4.903 0 01-1.153 1.772c-.5.509-1.104.902-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.903 4.903 0 01-1.772-1.153 4.903 4.903 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.903 4.903 0 011.153-1.772A4.903 4.903 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
					clipRule="evenodd"
				/>
			</svg>
		);
	} else {
		return (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
				<path
					fillRule="evenodd"
					d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
					clipRule="evenodd"
				/>
			</svg>
		);
	}
};

// Utility Components
const GlassCard = ({ title, icon, children, className = '' }) => (
	<div
		className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 ${className}`}
	>
		<h3 className="text-xl font-semibold text-white mb-6 flex items-center">
			<span className="text-cyan-400 mr-3">{icon}</span>
			{title}
		</h3>
		{children}
	</div>
);

const InputField = ({
	label,
	value,
	isEditing,
	register,
	name,
	type = 'text',
	validation,
	error,
	icon,
	placeholder,
}) => (
	<div>
		<label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
		{isEditing ? (
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
					{icon}
				</div>
				<input
					type={type}
					{...register(name, validation)}
					defaultValue={value}
					placeholder={placeholder}
					className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
				/>
				{error && <span className="text-red-400 text-sm mt-1 block">{error.message}</span>}
			</div>
		) : (
			<div className="text-white bg-white/5 rounded-xl py-3 px-4 border border-white/10">
				{value || 'Not provided'}
			</div>
		)}
	</div>
);

const SelectField = ({ label, value, isEditing, register, name, options, icon }) => (
	<div>
		<label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
		{isEditing ? (
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
					{icon}
				</div>
				<select
					{...register(name)}
					defaultValue={value}
					className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent backdrop-blur-sm appearance-none transition-all duration-200"
				>
					{options.map((option) => (
						<option key={option.value} value={option.value} className="bg-gray-800 text-white">
							{option.label}
						</option>
					))}
				</select>
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
					<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>
		) : (
			<div className="text-white bg-white/5 rounded-xl py-3 px-4 border border-white/10">
				{options.find((opt) => opt.value === value)?.label || value}
			</div>
		)}
	</div>
);

const StatCard = ({ label, value, suffix = '' }) => (
	<div className="text-center">
		<div className="text-3xl font-bold text-white mb-1">
			{value}
			{suffix}
		</div>
		<div className="text-white/60 text-sm">{label}</div>
	</div>
);

const AnimatedSection = ({ show, children }) => (
	<div
		className={`transition-all duration-500 ${show ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8 pointer-events-none absolute'}`}
	>
		{children}
	</div>
);

const PersonalInfoCard = ({ member, isEditing, register, errors }) => (
	<GlassCard title="Personal Information" icon={<UserIcon />}>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InputField
				label="Full Name"
				value={member.fullname}
				isEditing={isEditing}
				register={register}
				name="fullname"
				validation={{
					required: 'Full name is required',
					minLength: { value: 2, message: 'Name must be at least 2 characters' },
				}}
				error={errors.fullname}
				icon={<UserIcon />}
				placeholder="Enter your full name"
			/>

			<InputField
				label="Email"
				value={member.email}
				isEditing={isEditing}
				register={register}
				name="email"
				type="email"
				validation={{
					required: 'Email is required',
					pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
				}}
				error={errors.email}
				icon={<MailIcon />}
				placeholder="your.email@example.com"
			/>

			<InputField
				label="LPU ID"
				value={member.LpuId}
				isEditing={isEditing}
				register={register}
				name="LpuId"
				validation={{
					required: 'LPU ID is required',
					pattern: { value: /^\d{8}$/, message: 'Must be 8 digits' },
				}}
				error={errors.LpuId}
				icon={<IdIcon />}
				placeholder="12345678"
			/>

			<SelectField
				label="Hosteler"
				value={member.hosteler}
				isEditing={isEditing}
				register={register}
				name="hosteler"
				options={[
					{ value: true, label: 'Yes' },
					{ value: false, label: 'No' },
				]}
				icon={<HomeIcon />}
			/>

			{(member.hosteler || member.hosteler === 'true') && (
				<SelectField
					label="Hostel"
					value={member.hostel}
					isEditing={isEditing}
					register={register}
					name="hostel"
					options={[
						{ value: '', label: 'Select Hostel' },
						{ value: 'BH-1', label: 'BH-1' },
						{ value: 'BH-2', label: 'BH-2' },
						{ value: 'BH-3', label: 'BH-3' },
						{ value: 'BH-4', label: 'BH-4' },
						{ value: 'BH-5', label: 'BH-5' },
						{ value: 'BH-6', label: 'BH-6' },
						{ value: 'BH-7', label: 'BH-7' },
						{ value: 'GH-1', label: 'GH-1' },
						{ value: 'GH-2', label: 'GH-2' },
						{ value: 'GH-3', label: 'GH-3' },
						{ value: 'GH-4', label: 'GH-4' },
						{ value: 'GH-5', label: 'GH-5' },
					]}
					icon={<BuildingIcon />}
				/>
			)}
		</div>
	</GlassCard>
);

const AcademicInfoCard = ({ member, isEditing, register, errors }) => (
	<GlassCard title="Academic Information" icon={<AcademicIcon />}>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<InputField
				label="Program"
				value={member.program}
				isEditing={isEditing}
				register={register}
				name="program"
				icon={<BookIcon />}
				placeholder="e.g., Computer Science Engineering"
			/>

			<SelectField
				label="Academic Year"
				value={member.year}
				isEditing={isEditing}
				register={register}
				name="year"
				options={[
					{ value: 1, label: '1st Year' },
					{ value: 2, label: '2nd Year' },
					{ value: 3, label: '3rd Year' },
					{ value: 4, label: '4th Year' },
				]}
				icon={<CalendarIcon />}
			/>

			<SelectField
				label="Department"
				value={member.department}
				isEditing={isEditing}
				register={register}
				name="department"
				options={[
					{ value: 'Technical', label: 'Technical' },
					{ value: 'Creative', label: 'Creative' },
					{ value: 'Marketing', label: 'Marketing' },
					{ value: 'Management', label: 'Management' },
					{ value: 'Events', label: 'Events' },
				]}
				icon={<BuildingIcon />}
			/>

			<SelectField
				label="Designation"
				value={member.designation}
				isEditing={isEditing}
				register={register}
				name="designation"
				options={[
					{ value: 'Member', label: 'Member' },
					{ value: 'Executive', label: 'Executive' },
					{ value: 'Head', label: 'Head' },
					{ value: 'Co-Head', label: 'Co-Head' },
					{ value: 'President', label: 'President' },
					{ value: 'Vice President', label: 'Vice President' },
				]}
				icon={<UserIcon />}
			/>
		</div>

		{/* Bio Section */}
		<div className="mt-6">
			<label className="block text-white/80 text-sm font-medium mb-3">Bio</label>
			{isEditing ? (
				<textarea
					{...register('bio')}
					defaultValue={member.bio}
					rows={4}
					className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent resize-none backdrop-blur-sm transition-all duration-200"
					placeholder="Tell us about yourself..."
				/>
			) : (
				<p className="text-white/80 bg-white/5 rounded-xl p-4 border border-white/10 min-h-[100px]">
					{member.bio || 'No bio provided'}
				</p>
			)}
		</div>
	</GlassCard>
);

const SocialLinksCard = ({ member, isEditing, register }) => {
	const [socialLinks, setSocialLinks] = useState(member.socialLinks || []);

	const addSocialLink = () => {
		setSocialLinks([...socialLinks, { platform: '', url: '' }]);
	};

	const removeSocialLink = (index) => {
		setSocialLinks(socialLinks.filter((_, i) => i !== index));
	};

	return (
		<GlassCard title="Social Links" icon={<LinkIcon />}>
			<div className="space-y-4">
				{isEditing ? (
					<div className="space-y-4">
						{socialLinks.map((link, index) => (
							<div key={index} className="flex flex-col sm:flex-row gap-3">
								<input
									{...register(`socialLinks[${index}].platform`)}
									defaultValue={link.platform}
									placeholder="Platform (e.g., GitHub)"
									className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
								/>
								<input
									{...register(`socialLinks[${index}].url`)}
									defaultValue={link.url}
									placeholder="URL (https://...)"
									className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-200"
								/>
								<button
									type="button"
									onClick={() => removeSocialLink(index)}
									className="px-3 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-200 flex items-center justify-center"
								>
									<CancelIcon />
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={addSocialLink}
							className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/70 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
						>
							<PlusIcon />
							<span>Add Social Link</span>
						</button>
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{member.socialLinks && member.socialLinks.length > 0 ? (
							member.socialLinks.map((link, index) => (
								<a
									key={index}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-white/20 group"
								>
									<div className="w-8 h-8 mx-auto mb-2 text-white group-hover:text-cyan-400 transition-colors">
										{getSocialIcon(link.platform)}
									</div>
									<div className="text-white/80 text-sm font-medium">{link.platform}</div>
								</a>
							))
						) : (
							<div className="col-span-full text-center text-white/60 py-8">
								No social links added yet
							</div>
						)}
					</div>
				)}
			</div>
		</GlassCard>
	);
};

const AchievementsCard = ({ member }) => (
	<GlassCard title="Achievements" icon={<TrophyIcon />}>
		<div className="space-y-4">
			{member.achievements && member.achievements.length > 0 ? (
				member.achievements.map((achievement, index) => (
					<div
						key={index}
						className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20"
					>
						<div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
							<TrophyIcon />
						</div>
						<div className="flex-1">
							<div className="text-white font-medium">{achievement}</div>
						</div>
					</div>
				))
			) : (
				<div className="text-center text-white/60 py-8">
					No achievements added yet
				</div>
			)}
		</div>
	</GlassCard>
);

const StatusCard = ({ member }) => (
	<GlassCard title="Status" icon={<StatusIcon />}>
		<div className="space-y-6">
			<div
				className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
					member.status === 'active'
						? 'bg-green-500/20 text-green-300 border border-green-400/30'
						: 'bg-red-500/20 text-red-300 border border-red-400/30'
				}`}
			>
				<div
					className={`w-2 h-2 rounded-full mr-2 ${member.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}
				></div>
				{member.status?.toUpperCase() || 'UNKNOWN'}
			</div>

			<div className="space-y-3">
				<div className="flex items-center text-white/80">
					<CalendarIcon />
					<span className="text-sm ml-3">
						Joined{' '}
						{new Date(member.joinedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
						})}
					</span>
				</div>

				{member.restriction?.isRestricted && (
					<div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
						<div className="flex items-center text-red-300 mb-2">
							<AlertIcon />
							<span className="ml-2 font-medium">Account Restricted</span>
						</div>
						<p className="text-red-300/80 text-sm">
							Reason: {member.restriction.reason || 'Not specified'}
						</p>
						{member.restriction.time && (
							<p className="text-red-300/80 text-sm">
								Until: {new Date(member.restriction.time).toLocaleDateString()}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	</GlassCard>
);

const QuickStatsCard = ({ member }) => (
	<GlassCard title="Quick Stats" icon={<ChartIcon />}>
		<div className="space-y-4">
			<StatBar label="Profile Completion" value={85} color="from-cyan-400 to-blue-500" />
			<StatBar label="Activity Score" value={92} color="from-purple-400 to-pink-500" />
			<StatBar label="Engagement" value={78} color="from-green-400 to-emerald-500" />
		</div>
	</GlassCard>
);

const StatBar = ({ label, value, color }) => (
	<div>
		<div className="flex justify-between text-sm text-white/80 mb-2">
			<span>{label}</span>
			<span>{value}%</span>
		</div>
		<div className="w-full bg-white/10 rounded-full h-2">
			<div
				className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
				style={{ width: `${value}%` }}
			></div>
		</div>
	</div>
);

// Main Component
const EnhancedProfile = ({ memberId }) => {
	const [member, setMember] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [activeSection, setActiveSection] = useState('personal');
	const canvasRef = useRef(null);
	const profileRef = useRef(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	useEffect(() => {
		const mockMember = {
			memberID: '123e4567-e89b-12极-a456-426614174000',
			profilePicture: {
				url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
				publicId: 'profile_abc123',
			},
			fullname: 'Alex Johnson',
			LpuId: '12345678',
			email: 'alex.johnson@example.com',
			program: 'Computer Science Engineering',
			year: 3,
			hosteler: true,
			hostel: 'BH-3',
			socialLinks: [
				{ platform: 'GitHub', url: 'https://github.com/alexjohnson' },
				{ platform: 'LinkedIn', url: 'https://linkedin.com/in/alexjohnson' },
				{ platform: 'Twitter', url: 'https://twitter.com/alexjohnson' },
				{ platform: 'Instagram', url: 'https://instagram.com/alexjohnson' },
			],
			department: 'Technical',
			designation: 'Head',
			bio: 'Passionate innovator crafting the future through code. Specializing in AI/ML, full-stack development, and leading high-impact projects that push technological boundaries.',
			joinedAt: '2022-01-15T00:00:00.000Z',
			status: 'active',
			skills: ['React', 'Python', 'Machine Learning', 'Cloud Computing', 'DevOps'],
			achievements: ['Winner - TechFest 2023', 'Best Project Award', "Dean's List"],
			projects: 3,
			contributions: 47,
			restriction: {
				time: null,
				reason: null,
				isRestricted: false,
			},
		};

		setTimeout(() => {
			setMember(mockMember);
			reset(mockMember);
			setIsLoading(false);
		}, 1500);
	}, [memberId, reset]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		let animationFrameId;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();

		const particles = [];
		const particleCount = 80;
		const connectionDistance = 120;

		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.size = Math.random() * 3 + 1;
				this.speedX = (Math.random() - 0.5) * 0.8;
				this.speedY = (Math.random() - 0.5) * 0.8;
				this.hue = Math.random() * 60 + 200; // Blue to purple range
				this.brightness = Math.random() * 0.5 + 0.2;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
				if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

				this.hue += 0.2;
			}

			draw() {
				ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.brightness})`;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		const init = () => {
			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}
		};

		const animate = () => {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < particles.length; i++) {
				particles[i].update();
				particles[i].draw();

				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < connectionDistance) {
						const opacity = (1 - distance / connectionDistance) * 0.3;
						ctx.strokeStyle = `hsla(${particles[i].hue}, 70%, 60%, ${opacity})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}

			animationFrameId = requestAnimationFrame(animate);
		};

		init();
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('resize', resizeCanvas);
		};
	}, []);

	const onSubmit = async (data) => {
		try {
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
			<div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
				<div className="relative">
					<div className="w-32 h-32 border-4 border-transparent border-t-cyan-400 border-r-purple-500 rounded-full animate-spin"></div>
					<div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-b-pink-400 border-l-blue-500 rounded-full animate-spin animation-delay-75"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						<div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
					</div>
				</div>
				<div className="absolute bottom-20 text-white text-xl font-light tracking-wider animate-pulse">
					Loading Experience...
				</div>
			</div>
		);
	}

	if (!member) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<div className="text-white text-xl">Profile not found</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen relative overflow-hidden bg-black">
			{/* Dynamic Background */}
			<canvas
				ref={canvasRef}
				className="fixed top-0 left-0 w-full h-full z-0"
				style={{
					background:
						'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
				}}
			/>

			{/* Main Content */}
			<div ref={profileRef} className="relative z-10">
				{/* Header Section */}
				<div className="relative min-h-screen flex flex-col">
					{/* Floating Navigation */}
					<nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3">
						<div className="flex space-x-6">
							{['personal', 'academic', 'social', 'achievements'].map((section) => (
								<button
									key={section}
									onClick={() => setActiveSection(section)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
										activeSection === section
											? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg'
											: 'text-white/70 hover:text-white hover:bg-white/10'
									}`}
								>
									{section.charAt(0).toUpperCase() + section.slice(1)}
								</button>
							))}
						</div>
					</nav>

					{/* Hero Profile Section */}
					<div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
						<div className="max-w-6xl w-full">
							{/* Profile Card */}
							<div className="relative group">
								{/* Glowing Border Effect */}
								<div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 group-h极:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

								<div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden">
									{/* Profile Header */}
									<div className="relative p-8 sm:p-12">
										<div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
											{/* Avatar Section */}
											<div className="relative group">
												{/* Floating Ring */}
												<div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 animate-spin-slow"></div>
												<div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-500/30 animate-pulse"></div>

												<div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white/20">
													<img
														src={member.profilePicture?.url}
														alt={member.fullname}
														className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
												</div>

												{/* Online Status Indicator */}
												<div className="absolute bottom-4 right-4 w-6 h-6 bg-green-400 rounded-full border-3 border-black animate-pulse"></div>
											</div>

											{/* Profile Info */}
											<div className="flex-1 text-center lg:text-left">
												<div className="mb-4">
													<h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
														{member.fullname}
													</h1>
													<p className="text-xl sm:text-2xl text-white/80 font-light">
														{member.designation} • {member.department}
													</p>
												</div>

												{/* Stats Row */}
												<div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
													<StatCard
														label="Projects"
														value={member.projects}
													/>
													<StatCard
														label="Contributions"
														value={member.contributions}
													/>
													<StatCard
														label="Year"
														value={member.year}
														suffix={member.year === 1 ? 'st' : member.year === 2 ? 'nd' : member.year === 3 ? 'rd' : 'th'}
													/>
												</div>

												{/* Skills Pills */}
												<div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
													{member.skills?.map((skill, index) => (
														<span
															key={index}
															className="px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/10 hover:border-white/30 transition-all duration-300"
															style={{
																animationDelay: `${index * 100}ms`,
															}}
														>
															{skill}
														</span>
													))}
												</div>

												{/* Action Buttons */}
												<div className="flex flex-wrap justify-center lg:justify-start gap-4">
													{!isEditing ? (
														<>
															<button
																onClick={() => setIsEditing(true)}
																className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
															>
																<EditIcon />
																<span>Edit Profile</span>
															</button>
															<button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-semib极 transition-all duration-300 border border-white/20 hover:border-white/40">
																View Resume
															</button>
														</>
													) : (
														<>
															<button
																onClick={handleSubmit(onSubmit)}
																className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
															>
																<SaveIcon />
																<span>Save Changes</span>
															</button>
															<button
																onClick={() => {
																	setIsEditing(false);
																	reset(member);
																}}
																className="px-8 py-4 bg-white/10 hover:bg-red-500/20 backdrop-blur-sm rounded-full text-white font-semibold transition-all duration-300 border border-white/20 hover:border-red-400/40"
															>
																Cancel
															</button>
														</>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Content Sections */}
				<div className="relative py-20 px-4 sm:px-6 lg:px-8">
					<div className="max-w-6xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Main Content */}
							<div className="lg:col-span-2 space-y-8">
								<AnimatedSection show={activeSection === 'personal'}>
									<PersonalInfoCard
										member={member}
										isEditing={isEditing}
										register={register}
										errors={errors}
									/>
								</AnimatedSection>

								<AnimatedSection show={activeSection === 'academic'}>
									<AcademicInfoCard
										member={member}
										isEditing={isEditing}
										register={register}
										errors={errors}
									/>
								</AnimatedSection>

								<AnimatedSection show={activeSection === 'social'}>
									<SocialLinksCard
										member={member}
										isEditing={isEditing}
										register={register}
									/>
								</AnimatedSection>

								<AnimatedSection show={activeSection === 'achievements'}>
									<AchievementsCard member={member} />
								</AnimatedSection>
							</div>

							{/* Sidebar */}
							<div className="space-y-8">
								<StatusCard member={member} />
								<QuickStatsCard member={member} />
							</div>
						</div>
					</div>
				</div>

				{/* Message Toast */}
				{message && (
					<div className="fixed bottom-8 right-8 z-50 animate-slide-up">
						<div
							className={`p-6 rounded-2xl backdrop-blur-xl border flex items-center space-x-3 shadow-2xl ${
								message.includes('success')
									? 'bg-green-500/20 border-green-400/30 text-green-300'
									: 'bg-red-500/20 border-red-400/30 text-red-300'
							}`}
						>
							{message.includes('success') ? <CheckIcon /> : <AlertIcon />}
							<span className="font-medium">{message}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EnhancedProfile;
