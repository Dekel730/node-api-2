import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../server';
import { beforeAll, describe, expect, it } from '@jest/globals';

process.env.NODE_ENV = 'test';

var userId: string;
var accessToken: string;
var refreshToken: string, invalidUserToken: string;

beforeAll(async () => {
	const randomMongoId = '60b0e6f4c9f8c72b1c1b3e7b';
	invalidUserToken = jwt.sign(
		{ id: randomMongoId },
		process.env.JWT_SECRET_REFRESH!
	);
});

describe('user API', () => {
	it('should register a new user', async () => {
		const res = await request(app).post('/api/user/register').send({
			name: 'Test User',
			email: 'testuser@example.com',
			password: 'password123',
			username: 'testuser',
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body.user).toHaveProperty('_id');
		expect(res.body.user).toHaveProperty('name', 'Test User');
		expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
		expect(res.body.user).toHaveProperty('username', 'testuser');
		userId = res.body.user._id;
	});

	it('should throw error if invalid input in creating user ', async () => {
		const res = await request(app).post('/api/user/register').send({
			name: 'Test User',
			email: 'testuser@example.com',
			password: 'password123',
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe(
			'Please provide name, email, password and username'
		);
	});

	it('should throw error if user already exists', async () => {
		const res = await request(app).post('/api/user/register').send({
			name: 'Test User',
			email: 'testuser@example.com',
			password: 'password123',
			username: 'testuser',
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe('User already exists');
	});

	it('should login a user', async () => {
		const res = await request(app).post('/api/user/login').send({
			email: 'testuser@example.com',
			password: 'password123',
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body.user).toHaveProperty('_id');
		expect(res.body.user).toHaveProperty('name', 'Test User');
		expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
		expect(res.body.user).toHaveProperty('username', 'testuser');
		accessToken = res.body.accessToken;
		refreshToken = res.body.refreshToken;
	});

	it('should return 400 if any required field is missing', async () => {
		const res = await request(app)
			.put('/api/user/')
			.set('authorization', `Bearer ${accessToken}`)
			.send({
				name: 'Test User',
				password: 'password123',
				username: 'testuser',
			});

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe(
			'Please provide name, email and username'
		);
	});

	it('should return 400 if email is already in use', async () => {
		const res = await request(app)
			.put('/api/user/')
			.set('authorization', `Bearer ${accessToken}`)
			.send({
				name: 'Test User',
				email: 'omerg863@gmail.com',
				username: 'testuser',
			});

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe('User already exists');
	});

	it('should return 400 if email is already in use', async () => {
		const res = await request(app)
			.put('/api/user/')
			.set('authorization', `Bearer ${accessToken}`)
			.send({
				name: 'Test User',
				email: 'testuser@example.com',
				username: 'omer',
			});

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe('Username already exists');
	});

	it('should update the user', async () => {
		const res = await request(app)
			.put('/api/user/')
			.set('authorization', `Bearer ${accessToken}`)
			.send({
				name: 'Test User updated',
				username: 'testuser',
				email: 'testuser@example.com',
			});

		expect(res.statusCode).toEqual(200);
		expect(res.body.user.name).toBe('Test User updated');
	});

	it('should return 400 if any required field is missing', async () => {
		const res = await request(app).post('/api/user/login/').send({
			email: 'testuser@example.com',
		});

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe('Please provide email and password');
	});

	it('should return 404 user not found when login', async () => {
		const res = await request(app).post('/api/user/login/').send({
			email: 'testuser22222@example.com',
			password: 'password123',
		});

		expect(res.statusCode).toEqual(404);
		expect(res.body.message).toBe('User not found');
	});

	it('should return 401 if Invalid credentials', async () => {
		const res = await request(app).post('/api/user/login/').send({
			name: 'Test User',
			email: 'testuser@example.com',
			password: 'password12345',
			username: 'testuser',
		});

		expect(res.statusCode).toEqual(401);
		expect(res.body.message).toBe('Invalid credentials');
	});

	it('should return 400 if no refresh token is provided', async () => {
		const res = await request(app).post('/api/user/refresh').send();

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe('No refresh token provided.');
	});

	it('should return 400 if the refresh token is invalid', async () => {
		const invalidRefreshToken = 'invalidtoken123';

		const res = await request(app)
			.post('/api/user/refresh')
			.set('Authorization', `Bearer ${invalidRefreshToken}`)
			.expect(400);

		expect(res.body.message).toBe('Token failed');
	});

	it('should return 404 if user not found', async () => {
		const res = await request(app)
			.post('/api/user/refresh')
			.set('Authorization', `Bearer ${invalidUserToken}`);

		expect(res.statusCode).toEqual(404);
	});

	it('should return access token if valid refresh token is provided', async () => {
		const res = await request(app)
			.post('/api/user/refresh')
			.set('Authorization', `Bearer ${refreshToken}`)
			.send({});

		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toBe(true);
		expect(res.body).toHaveProperty('accessToken');
		expect(res.body).toHaveProperty('refreshToken');
	});

	it('should return 401 if refresh token expired', async () => {
		const res = await request(app)
			.post('/api/user/refresh')
			.set('Authorization', `Bearer ${refreshToken}`)
			.send({});

		expect(res.statusCode).toEqual(401);
	});

	it('should delete a user', async () => {
		const res = await request(app)
			.delete(`/api/user/`)
			.set('authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
	});
});
