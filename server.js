import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import colors from 'colors';
import { errorHandler } from './middleware/errorMiddleware.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

connectDB(() => {
	if (process.env.NODE_ENV !== 'test') {
		app.listen(PORT, () => {
			console.log(`server is running on port ${PORT}`);
			console.log(`http://localhost:${PORT}/api-docs`);
		});
	}
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);
app.use('/api/comment', commentRoutes);

app.use(errorHandler);

export default app;