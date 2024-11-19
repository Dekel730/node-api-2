import swaggerJsdoc from 'swagger-jsdoc';

const options = {
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'Express API with Swagger, Jest and JWT',
			version: '0.1.0',
			description:
				'This is a simple CRUD API application made with Express documented with Swagger, tested with Jest and protected with JWT.',
			license: {
				name: 'MIT',
				url: 'https://spdx.org/licenses/MIT.html',
			}
		},
		servers: [
			{
				url: `http://localhost:3000`,
			},
		],
	},
	apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;