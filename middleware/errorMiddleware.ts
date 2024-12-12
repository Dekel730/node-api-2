import { Request, Response, NextFunction } from 'express';

const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode =
		res.statusCode && res.statusCode !== 200 && res.statusCode !== 201
			? res.statusCode
			: 500;

	res.status(statusCode).json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '(:' : err.stack,
	});
};

export { errorHandler };
