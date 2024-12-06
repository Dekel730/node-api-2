import { errorHandler } from './components.js';

const postPaths = {
	'/api/post': {
		post: {
			summary: 'Create a new post',
			tags: ['Posts'],
			security: [
				{
					jwtAuth: [],
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
									description:
										'The message content of the post',
									example: 'example',
								},
							},
						},
					},
				},
			},
			responses: {
				201: {
					description: 'The created Post.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									post: {
										$ref: '#/components/schemas/Post',
									},
								},
							},
						},
					},
				},
				...errorHandler(400, 'Invalid input', 'Please provide message'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
		get: {
			summary: 'Get posts by user',
			tags: ['Posts'],
			parameters: [
				{
					in: 'query',
					name: 'user',
					schema: {
						type: 'string',
					},
					required: true,
					description: 'The user id',
				},
			],
			responses: {
				200: {
					description: 'The list of the posts',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									posts: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Post',
										},
									},
								},
							},
						},
					},
				},
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
	'/api/post/all': {
		get: {
			summary: 'Get all posts',
			tags: ['Posts'],
			responses: {
				200: {
					description: 'The list of the posts',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									posts: {
										type: 'array',
										items: {
											$ref: '#/components/schemas/Post',
										},
									},
								},
							},
						},
					},
				},
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
	'/api/post/{id}': {
		parameters: [
			{
				in: 'path',
				name: 'id',
				required: true,
				schema: {
					type: 'string',
				},
				description: 'The post ID',
			},
		],
		get: {
			summary: 'Get post by id',
			tags: ['Posts'],
			responses: {
				200: {
					description: 'The post with the provided ID',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									post: {
										$ref: '#/components/schemas/Post',
									},
								},
							},
						},
					},
				},
				...errorHandler(400, 'Invalid input', 'Please provide post id'),
				...errorHandler(404, 'Post not found', 'Post not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
		put: {
			summary: 'Update post by id',
			tags: ['Posts'],
			security: [
				{
					jwtAuth: [],
				},
			],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
									description:
										'The message content of the post',
									example: 'example',
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'The updated Post.',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									post: {
										$ref: '#/components/schemas/Post',
									},
								},
							},
						},
					},
				},
				...errorHandler(400, 'Invalid input', 'Please provide message'),
				...errorHandler(404, 'Post not found', 'Post not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
		delete: {
			summary: 'Delete post by id',
			tags: ['Posts'],
			security: [
				{
					jwtAuth: [],
				},
			],
			responses: {
				200: {
					description: 'The post with the provided ID was deleted',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
								},
							},
						},
					},
				},
				...errorHandler(400, 'Invalid input', 'Please provide post id'),
				...errorHandler(404, 'Post not found', 'Post not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
};

export default postPaths;
