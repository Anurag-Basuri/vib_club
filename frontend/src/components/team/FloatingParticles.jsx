import React, { useEffect, useRef } from 'react';

const FloatingParticles = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Adjust particle count based on screen size for better performance
		const isMobile = window.innerWidth < 768;
		const particleCount = isMobile
			? Math.min(window.innerWidth / 20, 40)
			: Math.min(window.innerWidth / 10, 100);

		const particles = [];

		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * (isMobile ? 2 : 3) + 1,
				color: i % 3 === 0 ? '#3a56c9' : i % 3 === 1 ? '#5d7df5' : '#0ea5e9',
				speedX: Math.random() * 0.4 - 0.2,
				speedY: Math.random() * 0.4 - 0.2,
				opacity: Math.random() * 0.4 + 0.1,
			});
		}

		// More efficient connection function - only connect nearby particles
		const connectParticles = () => {
			const connectionDistance = isMobile ? 80 : 120;
			for (let i = 0; i < particles.length; i++) {
				for (let j = i; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < connectionDistance) {
						ctx.beginPath();
						ctx.strokeStyle = `rgba(93, 125, 245, ${0.1 * (1 - distance / connectionDistance)})`;
						ctx.lineWidth = 0.5;
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}
		};

		// Use requestAnimationFrame for smoother animations
		let animationId;
		const animate = () => {
			animationId = requestAnimationFrame(animate);
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach((p) => {
				p.x += p.speedX;
				p.y += p.speedY;

				if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
				if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba');
				ctx.fill();
			});

			connectParticles();
		};

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener('resize', handleResize);
		animate();

		// Clean up function
		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 z-0 pointer-events-none"
			style={{ background: 'transparent' }}
		/>
	);
};

export default FloatingParticles;
