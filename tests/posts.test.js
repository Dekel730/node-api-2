import request from 'supertest';
import app from '../server.js';

process.env.NODE_ENV = 'test';

describe('Posts API', () => {
	let postId;
	let userId;

	it('should create a new post', async () => {
		const res = await request(app)
			.post('/api/post')
			.set('Authorization', process.env.TEST_AUTH_TOKEN)
			.send({
				message: 'hey test',
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('post');
		expect(res.body.post).toHaveProperty('_id');
		postId = res.body.post._id;
		userId = res.body.post.user;
	});

	it('should fetch posts by user', async () => {
		const res = await request(app).get(`/api/post?user=${userId}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.posts).toBeInstanceOf(Array);
	});

	it('should fetch a post by id', async () => {
		const res = await request(app).get(`/api/post/${postId}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.post).toHaveProperty('_id', postId);
	});

	it('should fetch all posts', async () => {
		const res = await request(app).get(`/api/post/all`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.posts).toBeInstanceOf(Array);
	});

	it('should update a post', async () => {
		const res = await request(app)
			.put(`/api/post/${postId}`)
			.set('Authorization', process.env.TEST_AUTH_TOKEN)
			.send({
				message: 'hey test updated',
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body.post).toHaveProperty('message', 'hey test updated');
	});

	it('should delete a post', async () => {
		const res = await request(app)
			.delete(`/api/post/${postId}`)
			.set('Authorization', process.env.TEST_AUTH_TOKEN);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
	});
});
