import { errorHandler } from './components.js';

const commentPaths = {
	'/api/comment': {
		post: {
			summary: 'Create a new comment',
			tags: ['Comments'],
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
									description: 'The content of the comment',
								},
								postId: {
									type: 'string',
									description:
										'The ID of the associated post',
								},
							},
						},
					},
				},
			},
			responses: {
				201: {
					description: 'Comment created successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Comment',
							},
						},
					},
				},
				...errorHandler(400, 'Post not found', 'Post not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
		get: {
			summary: 'Get all comments for a post',
			tags: ['Comments'],
			parameters: [
				{
					in: 'query',
					name: 'postId',
					schema: {
						type: 'string',
					},
					required: true,
					description: 'The ID of the post to fetch comments for',
				},
			],
			responses: {
				200: {
					description: 'List of comments',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: {
									$ref: '#/components/schemas/Comment',
								},
							},
						},
					},
				},
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
	'/api/comment/{id}': {
		get: {
			summary: 'Get a single comment by ID',
			tags: ['Comments'],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: {
						type: 'string',
					},
					description: 'The ID of the comment to fetch',
				},
			],
			responses: {
				200: {
					description: 'The requested comment',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Comment',
							},
						},
					},
				},
				...errorHandler(404, 'Post not found', 'Post not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
		put: {
			summary: 'Update a comment by ID',
			tags: ['Comments'],
			security: [
				{
					jwtAuth: [],
				},
			],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: {
						type: 'string',
					},
					description: 'The ID of the comment to update',
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
										'The updated content of the comment',
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'Comment updated successfully',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/Comment',
							},
						},
					},
				},
				...errorHandler(404, 'Post not found', 'Post not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
		delete: {
			summary: 'Delete a comment by ID',
			tags: ['Comments'],
			security: [
				{
					jwtAuth: [],
				},
			],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: {
						type: 'string',
					},
					description: 'The ID of the comment to delete',
				},
			],
			responses: {
				200: {
					description: 'The comment with the provided ID was deleted',
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
				...errorHandler(404, 'Server not found', 'Server not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
};

export default commentPaths;
