export const errorHandler = (
	statusCode: number,
	description: string,
	errorMessage: string
): Object => {
	const error = {
		[statusCode]: {
			description: description,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: false,
							},
							message: {
								type: 'string',
								example: errorMessage,
							},
						},
					},
				},
			},
		},
	};
	return error;
};

const components = {
	securitySchemes: {
		jwtAuth: {
			type: 'apiKey',
			in: 'header',
			name: 'Authorization',
			description:
				'Enter your JWT token directly in the `Authorization` header (with a `Bearer` prefix).',
		},
	},
	schemas: {
		User: {
			type: 'object',
			required: ['email', 'name', 'password', 'username'],
			properties: {
				_id: {
					type: 'string',
					description: 'The auto-generated id of the user',
				},
				name: {
					type: 'string',
					description: 'The name of the user',
				},
				email: {
					type: 'string',
					format: 'email',
					description: 'The email of the user',
				},
				username: {
					type: 'string',
					description: 'The username of the user',
				},
				password: {
					type: 'string',
					format: 'password',
					description: 'The password of the user',
				},
			},
			example: {
				_id: '60f1e4a1a4c3f40015f6e4b7',
				name: 'John Doe',
				email: 'johnD@gmail.com',
				username: 'johndoe',
				password: 'password',
			},
		},
		Comment: {
			type: 'object',
			required: ['message', 'user', 'postId'],
			properties: {
				_id: {
					type: 'string',
					description: 'The auto-generated id of the comment',
				},
				message: {
					type: 'string',
					description: 'The content of the comment',
				},
				user: {
					type: 'string',
					description: 'The user who created the comment',
				},
				postId: {
					type: 'string',
					description:
						'The ID of the post associated with the comment',
				},
				createdAt: {
					type: 'string',
					format: 'date',
					description: 'The date the comment was created',
				},
				updatedAt: {
					type: 'string',
					format: 'date',
					description: 'The date the comment was updated',
				},
			},
			example: {
				_id: '5e8e3b6f0f6fc758c1d4e6f8',
				message: 'This is a comment',
				user: '5e8e3b6f0f6fc758c1d4e6f8',
				postId: '5e8e3b6f0f6fc758c1d4e6f9',
				createdAt: '2020-03-10T04:05:06.157Z',
				updatedAt: '2020-03-10T04:05:06.157Z',
			},
		},
		Post: {
			type: 'object',
			required: ['message', 'user'],
			properties: {
				_id: {
					type: 'string',
					description: 'The auto-generated id of the post',
				},
				message: {
					type: 'string',
					description: 'The content of the post',
				},
				user: {
					type: 'string',
					description: 'The user who created the post',
				},
				createdAt: {
					type: 'string',
					format: 'date',
					description: 'The date the post was added',
				},
				updatedAt: {
					type: 'string',
					format: 'date',
					description: 'The date the post was updated',
				},
			},
			example: {
				_id: '5e8e3b6f0f6fc758c1d4e6f8',
				message: 'This is a post message',
				user: '5e8e3b6f0f6fc758c1d4e6f8',
				createdAt: '2020-03-10T04:05:06.157Z',
				updatedAt: '2020-03-10T04:05:06.157Z',
			},
		},
	},
};

export default components;
