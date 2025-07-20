import dotenv from 'dotenv';
import connectDB from './database/index.js';
import app from './app.js';

dotenv.config({ path: './.env' });

const requiredEnvVars = ['PORT', 'MONGODB_URI', 'NODE_ENV', 'JWT_SECRET'];
for (const key of requiredEnvVars) {
	if (!process.env[key]) {
		console.error(`❌ Missing required env: ${key}`);
		process.exit(1);
	}
}

const PORT = process.env.PORT || 8000;
let server;

const gracefulShutdown = () => {
	console.log('🔄 Gracefully shutting down...');
	server?.close(() => {
		console.log('💤 Server closed');
		process.exit(1);
	});
	setTimeout(() => {
		console.error('⚠️ Forced shutdown');
		process.exit(1);
	}, 10000);
};

const startServer = async () => {
	try {
		await connectDB();
		console.log('📦 DB connected');

		server = app.listen(PORT, () => {
			console.log(`🚀 Server running at http://localhost:${PORT} (${process.env.NODE_ENV})`);
		});

		process.on('SIGTERM', gracefulShutdown);
		process.on('unhandledRejection', err => {
			console.error('❌ Unhandled Rejection:', err);
			gracefulShutdown();
		});
		process.on('uncaughtException', err => {
			console.error('❌ Uncaught Exception:', err);
			process.exit(1);
		});
	} catch (err) {
		console.error('❌ Startup failed:', err.message);
		process.exit(1);
	}
};

startServer();
