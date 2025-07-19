import app from './app.js';
import { connectDB } from './config/database.js';

const startServer = async () => {
	try {
		await connectDB();
		app.listen(process.env.PORT, () => {
			console.log(`✅ Server is running on http://localhost:${process.env.PORT}`);
		});
	} catch (error) {
		console.error('❌ Failed to start server:', error);
		process.exit(1);
	}
};

startServer();
