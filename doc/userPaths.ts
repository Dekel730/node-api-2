import { errorHandler } from './components';

const userPaths = {
	'/api/user': {
		put: {
			summary: 'Update user',
			tags: ['Users'],
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
								email: {
									type: 'string',
									description: 'Email of the user',
									example: 'johnD@gmail.com',
								},
								name: {
									type: 'string',
									description: 'Name of the user',
									example: 'John Doe',
								},
								username: {
									type: 'string',
									description: 'Username of the user',
									example: 'johndoe',
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'The user was updated',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									user: {
										type: 'object',
										properties: {
											_id: {
												type: 'string',
												description:
													'The unique ID of the user',
											},
											name: {
												type: 'string',
												description: 'Name of the user',
											},
											email: {
												type: 'string',
												description:
													'Email of the user',
											},
											username: {
												type: 'string',
												description:
													'Username of the user',
											},
										},
										example: {
											_id: '60f1e4a1a4c3f40015f6e4b7',
											name: 'John Doe',
											email: 'johnD@gmail.com',
											username: 'johndoe',
										},
									},
								},
							},
						},
					},
				},
				...errorHandler(
					400,
					'Invalid input',
					'Please provide name, email and username'
				),
				...errorHandler(
					401,
					'Unauthorized access',
					'You are not authorized to update'
				),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
		delete: {
			summary: 'Delete user',
			tags: ['Users'],
			security: [
				{
					jwtAuth: [],
				},
			],
			responses: {
				200: {
					description: 'The user was deleted',
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
				...errorHandler(
					401,
					'Unauthorized access',
					'You are not authorized to delete'
				),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
	'/api/user/register': {
		post: {
			summary: 'Register a new user',
			tags: ['Users'],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								email: {
									type: 'string',
									description: 'Email of the user',
									example: 'johnD@gmail.com',
								},
								name: {
									type: 'string',
									description: 'Name of the user',
									example: 'John Doe',
								},
								username: {
									type: 'string',
									description: 'Username of the user',
									example: 'johndoe',
								},
								password: {
									type: 'string',
									description: 'Password of the user',
									example: 'password',
								},
							},
						},
					},
				},
			},
			responses: {
				201: {
					description: 'The user was successfully registered',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: { type: 'boolean', example: true },
									user: {
										type: 'object',
										properties: {
											_id: {
												type: 'string',
												description:
													'The unique ID of the user',
											},
											name: {
												type: 'string',
												description: 'Name of the user',
											},
											email: {
												type: 'string',
												description:
													'Email of the user',
											},
											username: {
												type: 'string',
												description:
													'Username of the user',
											},
										},
										example: {
											_id: '60f1e4a1a4c3f40015f6e4b7',
											name: 'John Doe',
											email: 'johnD@gmail.com',
											username: 'johndoe',
										},
									},
								},
							},
						},
					},
				},
				...errorHandler(
					400,
					'Invalid input',
					'Please provide name, email, password and username'
				),
				...errorHandler(500, 'Some server Error', 'Server Error'),
			},
		},
	},
	'/api/user/login': {
		post: {
			summary: 'Login user',
			tags: ['Users'],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								email: {
									type: 'string',
									description: 'Email of the user',
									example: 'johnD@gmail.com',
								},
								password: {
									type: 'string',
									description: 'Password of the user',
									example: 'password',
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: 'User successfully logged in',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									user: {
										type: 'object',
										properties: {
											_id: {
												type: 'string',
												description:
													'The unique ID of the user',
											},
											name: {
												type: 'string',
												description: 'Name of the user',
											},
											email: {
												type: 'string',
												description:
													'Email of the user',
											},
											username: {
												type: 'string',
												description:
													'Username of the user',
											},
										},
										example: {
											_id: '60f1e4a1a4c3f40015f6e4b7',
											name: 'John Doe',
											email: 'johnD@gmail.com',
											username: 'johndoe',
										},
									},
									accessToken: {
										type: 'string',
										description:
											'Access token for authenticating',
									},
									refreshToken: {
										type: 'string',
										description:
											'Refresh token for getting new access token',
									},
								},
							},
						},
					},
				},
				...errorHandler(
					400,
					'Invalid input',
					'Please provide email and password'
				),
				...errorHandler(
					401,
					'Unauthorized access',
					'Invalid credentials'
				),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
	'/api/user/logout': {
		post: {
			summary: 'Logout user',
			tags: ['Users'],
			security: [
				{
					jwtAuth: [],
				},
			],
			responses: {
				200: {
					description: 'User successfully logged out',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									message: {
										type: 'string',
										example: 'Logged out successfully',
									},
								},
							},
						},
					},
				},
				...errorHandler(
					400,
					'Invalid input',
					'Please provide email and password'
				),
				...errorHandler(
					401,
					'Unauthorized access',
					'Invalid credentials'
				),
				...errorHandler(404, 'Not Found', 'User not found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
	'/api/user/refresh': {
		post: {
			summary: 'Refresh token',
			tags: ['Users'],
			security: [
				{
					jwtAuth: [],
				},
			],
			responses: {
				200: {
					description: 'The token was successfully refreshed',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									success: {
										type: 'boolean',
										example: true,
									},
									accessToken: {
										type: 'string',
										description:
											'Access token for authenticating',
									},
									refreshToken: {
										type: 'string',
										description:
											'Refresh token for getting new access token',
									},
								},
							},
						},
					},
				},
				...errorHandler(401, 'Invalid token', 'Token failed'),
				...errorHandler(404, 'Not Found', 'User Not Found'),
				...errorHandler(500, 'Some server error', 'Server Error'),
			},
		},
	},
};

export default userPaths;
