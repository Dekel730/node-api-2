import request from 'supertest';
import app from '../server';
import { beforeAll, describe, expect, it } from '@jest/globals';

process.env.NODE_ENV = 'test';

var accessToken: string, accessToken2: string;

beforeAll(async () => {
	const res = await request(app).post('/api/user/login').send({
		email: process.env.TEST_USER_1,
		password: process.env.TEST_USER_1_PASSWORD,
	});
	accessToken = res.body.accessToken;
	const res2 = await request(app).post('/api/user/login').send({
		email: process.env.TEST_USER_2,
		password: process.env.TEST_USER_2_PASSWORD,
	});
	accessToken2 = res2.body.accessToken;
});

describe('Comment API', () => {
	let commentId: string;
	let userId: string;

	it('should create a new comment', async () => {
		const res = await request(app)
			.post('/api/comment')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				post: '674482870854e55b4f5d2ce2',
				message: 'hey test',
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('comment');
		commentId = res.body.comment._id;
		userId = res.body.comment.user;
	});

	it('should throw error creating comment', async () => {
		const res = await request(app)
			.post('/api/comment')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({});
		expect(res.statusCode).toEqual(400);
	});

	it('should not found a comment', async () => {
		const res = await request(app).get(
			`/api/comment/674456083c66f60e49855757`
		);
		expect(res.statusCode).toEqual(404);
	});

	it('should error creating comment - post ID does not exist', async () => {
		const res = await request(app)
			.post('/api/comment')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				post: '674456083c66f60e49855757',
				message: 'This is a comment for a non-existing post',
			});
		expect(res.statusCode).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Post not found');
	});

	it('should get a comment by ID', async () => {
		const res = await request(app)
			.get(`/api/comment/${commentId}`)
			.set('Authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body.comment).toHaveProperty('_id', commentId);
	});

	it('should throw error for a non-existing comment ID', async () => {
		const res = await request(app)
			.get('/api/comment/1234567890abcdef12345678')
			.set('Authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Comment not found');
	});

	it('should get comments by post ID', async () => {
		const res = await request(app)
			.get('/api/comment?post=674482870854e55b4f5d2ce2')
			.set('Authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body.comments).toBeInstanceOf(Array);
	});

	it('should update a comment', async () => {
		const res = await request(app)
			.put(`/api/comment/${commentId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				message: 'Updated comment message',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body.comment).toHaveProperty(
			'message',
			'Updated comment message'
		);
	});

	it('should error updating - comment not found', async () => {
		const res = await request(app)
			.put(`/api/comment/674456083c66f60e49855757`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				message: 'Comment not found',
			});
		expect(res.statusCode).toEqual(404);
		expect(res.body).toHaveProperty('message', 'Comment not found');
	});

	it('should error updating - message is required', async () => {
		const res = await request(app)
			.put(`/api/comment/${commentId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({});
		expect(res.statusCode).toEqual(400);
		expect(res.body).toHaveProperty('message', 'Please provide message');
	});

	it('should error updating - Unauthorized', async () => {
		const res = await request(app)
			.put(`/api/comment/${commentId}`)
			.set('Authorization', `Bearer ${accessToken2}`)
			.send({
				message: 'hey update',
			});
		expect(res.statusCode).toEqual(401);
		expect(res.body).toHaveProperty(
			'message',
			'You are not authorized to update this comment'
		);
	});

	it('should error deleting a comment - comment not found', async () => {
		const res = await request(app)
			.delete(`/api/comment/674456083c66f60e49855757`)
			.set('Authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(404);
	});

	it('should error deleting a comment - Unauthorized', async () => {
		const res = await request(app)
			.delete(`/api/comment/${commentId}`)
			.set('Authorization', `Bearer ${accessToken2}`);
		expect(res.statusCode).toEqual(401);
	});

	it('should delete a comment', async () => {
		const res = await request(app)
			.delete(`/api/comment/${commentId}`)
			.set('Authorization', `Bearer ${accessToken}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
	});
});
