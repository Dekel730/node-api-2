import components from './components.js';
import userPaths from './userPaths.js';
import commentPaths from './commentPaths.js';
import postPaths from './postPaths.js';

const options = {
	openapi: '3.1.0',
	info: {
		title: 'Express API with Swagger, Jest and JWT',
		version: '0.1.0',
		description:
			'This is a simple CRUD API application made with Express documented with Swagger, tested with Jest and protected with JWT.',
		license: {
			name: 'MIT',
			url: 'https://spdx.org/licenses/MIT.html',
		},
	},
	servers: [
		{
			url: `http://localhost:3000`,
		},
	],
	paths: { ...userPaths, ...postPaths, ...commentPaths },
	components,
};

export default options;
