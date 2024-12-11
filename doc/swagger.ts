import components from './components';
import userPaths from './userPaths';
import commentPaths from './commentPaths';
import postPaths from './postPaths';

const options = {
	openapi: '3.1.0',
	info: {
		title: 'Express API with Swagger, Jest, TypeScript and JWT',
		version: '0.1.0',
		description:
			'This is a simple CRUD API application made with Express in TypeScript documented with Swagger, tested with Jest and protected with JWT.',
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
