import {
	Users,
	Settings,
	Award,
	Home,
	FileText,
	Calendar,
	Camera,
	Edit3,
	User,
	Mail
} from 'react-feather';

export const getDesignationColor = (designation) => {
	const colors = {
		CEO: 'bg-gradient-to-r from-purple-500 to-pink-500',
		CTO: 'bg-gradient-to-r from-blue-500 to-cyan-500',
		CFO: 'bg-gradient-to-r from-green-500 to-emerald-500',
		CMO: 'bg-gradient-to-r from-orange-500 to-red-500',
		COO: 'bg-gradient-to-r from-indigo-500 to-purple-500',
		Head: 'bg-gradient-to-r from-yellow-500 to-orange-500',
		member: 'bg-gradient-to-r from-gray-500 to-slate-500',
	};
	return colors[designation] || colors['member'];
};

export const getDepartmentIcon = (department) => {
	const icons = {
		HR: Users,
		Technical: Settings,
		Marketing: Award,
		Management: Home,
		'Content Writing': FileText,
		'Event Management': Calendar,
		Media: Camera,
		Design: Edit3,
		Coordinator: User,
		PR: Mail,
	};
	return icons[department] || User;
};

export const getStatusColor = (status) => {
	const colors = {
		active: 'text-green-600 bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30',
		banned: 'text-red-600 bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30',
		removed:
			'text-gray-600 bg-gray-100 dark:bg-gray-500/20 border border-gray-200 dark:border-gray-500/30',
	};
	return colors[status] || colors['active'];
};

export const validateFile = (file, type) => {
	const errors = [];

	if (type === 'image') {
		if (!file.type.startsWith('image/')) {
			errors.push('Please select a valid image file');
			return errors;
		}

		if (file.size > 5 * 1024 * 1024) {
			errors.push('Image size must be less than 5MB');
			return errors;
		}

		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				if (img.width < 100 || img.height < 100) {
					errors.push('Image must be at least 100x100 pixels');
				}
				resolve(errors);
			};
			img.src = URL.createObjectURL(file);
		});
	} else if (type === 'document') {
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];

		if (!allowedTypes.includes(file.type)) {
			errors.push('Please select a valid document file (PDF, DOC, DOCX)');
			return errors;
		}

		if (file.size > 10 * 1024 * 1024) {
			errors.push('File size must be less than 10MB');
			return errors;
		}
	}

	return errors;
};

export const simulateProgress = (onProgress) => {
	let progress = 0;
	const interval = setInterval(() => {
		progress += Math.random() * 15;
		if (progress >= 100) {
			progress = 100;
			clearInterval(interval);
		}
		onProgress(progress);
	}, 200);
	return interval;
};
