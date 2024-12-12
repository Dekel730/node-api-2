import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import colors from 'colors';
import { errorHandler } from './middleware/errorMiddleware';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import commentRoutes from './routes/commentRoutes';
import swaggerUi from 'swagger-ui-express';
import specs from './doc/swagger';
import cookieParser from 'cookie-parser';
import './types/types';

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
