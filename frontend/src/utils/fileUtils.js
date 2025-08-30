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

// File validation utilities
export const validateFile = (file, type) => {
    const errors = [];
    
    if (!file) {
        errors.push('No file selected');
        return { isValid: false, errors };
    }

    if (type === 'image') {
        // Image validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            errors.push('Please select a valid image file (JPEG, PNG, or WebP)');
        }

        if (file.size > maxSize) {
            errors.push('Image size must be less than 5MB');
        }
    } else if (type === 'document') {
        // Document validation
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            errors.push('Please select a valid document (PDF, DOC, or DOCX)');
        }

        if (file.size > maxSize) {
            errors.push('Document size must be less than 10MB');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Simulate upload progress for better UX
export const simulateProgress = (onProgress) => {
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 95) {
            progress = 95;
            clearInterval(interval);
        }
        onProgress(Math.min(progress, 95));
    }, 200);

    return interval;
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create thumbnail from file
export const createThumbnail = (file) => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set thumbnail size
                const maxSize = 200;
                const ratio = Math.min(maxSize / img.width, maxSize / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                // Draw thumbnail
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(resolve, 'image/jpeg', 0.7);
            };
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
