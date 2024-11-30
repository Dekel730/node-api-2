import request from 'supertest';
import app from '../server.js';

process.env.NODE_ENV = 'test';

describe('Middleware auth Test', () => {
	it('should return 401 if no token provided', async () => {
		const res = await request(app).post('/api/post').send({
			message: 'hey test',
		});
		expect(res.statusCode).toEqual(401);
	});

	it('should return 401 if access token expired or invalid and no refresh token', async () => {
		const res = await request(app)
			.post('/api/post')
			.set('Authorization', '32801hrf0231nif09231fhji2n3f0in2')
			.send({
				message: 'hey test',
			});
		expect(res.statusCode).toEqual(401);
	});

	it('should return 401 if access token expired or invalid and refresh token expired or invalid', async () => {
		const cookie =
			'refreshToken=32801hrf0231nif09231fhji2n3f0in2; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
		const res = await request(app)
			.post('/api/post')
			.set('Authorization', '32801hrf0231nif09231fhji2n3f0in2')
			.set('Cookie', cookie)
			.send({
				message: 'hey test',
			});
		expect(res.statusCode).toEqual(401);
	});

	it('should return 200 if access token expired or invalid and refresh token is valid -  sent new refresh token', async () => {
		const res = await request(app)
			.post('/api/post')
			.set('Authorization', '32801hrf0231nif09231fhji2n3f0in2')
			.set('Cookie', process.env.TEST_REFRESH_TOKEN)
			.send({
				message: 'test middleware',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.headers.authorization).toBeDefined();
		expect(res.body.token).toEqual(true);
	});
});
