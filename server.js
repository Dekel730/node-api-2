import express  from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import colors from 'colors';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

connectDB();


const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

app.use(errorHandler);
