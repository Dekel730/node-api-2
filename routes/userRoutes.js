import express from 'express';
import {
	register,
	updateUser,
	deleteUser,
	login,
	refreshToken,
} from '../controllers/userController.js';
import { authUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/refresh').post(refreshToken);
router.route('/').put(authUser, updateUser);
router.route('/').delete(authUser, deleteUser);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *         - username
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         _id: 60f1e4a1a4c3f40015f6e4b7
 *         name: John Doe
 *         email: johnD@gmail.com
 *         username: johndoe
 *         password: password
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: "johnD@gmail.com"
 *               name:
 *                 type: string
 *                 description: Name of the user
 *                 example: "John Doe"
 *               username:
 *                 type: string
 *                 description: Username of the user
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: "password"
 *     responses:
 *       201:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the user
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     username:
 *                       type: string
 *                       description: Username of the user
 *                   example:
 *                     _id: "60f1e4a1a4c3f40015f6e4b7"
 *                     name: "John Doe"
 *                     email: "johnD@gmail.com"
 *                     username: "johndoe"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please provide name, email, password and username"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: "johnD@gmail.com"
 *               password:
 *                 type: string
 *                 description: Password of the user
 *                 example: "password"
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         headers:
 *           Authorization:
 *             description: token to be used for authenticated requests
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the user
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     username:
 *                       type: string
 *                       description: Username of the user
 *                   example:
 *                     _id: "60f1e4a1a4c3f40015f6e4b7"
 *                     name: "John Doe"
 *                     email: "johnD@gmail.com"
 *                     username: "johndoe"
 *         cookies:
 *           refreshToken:
 *             schema:
 *               type: string
 *               description: Refresh token stored as an HTTP-only cookie
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please provide email and password"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */

/**
 * @swagger
 * /api/user/refresh:
 *   post:
 *     summary: Refresh token
 *     tags: [Users]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *           description: Refresh token stored as an HTTP-only cookie
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: The token was successfully refreshed
 *         headers:
 *           Authorization:
 *             description: JWT token to be used for authenticated requests
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token failed"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - jwtAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: "johnD@gmail.com"
 *               name:
 *                 type: string
 *                 description: Name of the user
 *                 example: "John Doe"
 *               username:
 *                 type: string
 *                 description: Username of the user
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the user
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     username:
 *                       type: string
 *                       description: Username of the user
 *                   example:
 *                     _id: "60f1e4a1a4c3f40015f6e4b7"
 *                     name: "John Doe"
 *                     email: "johnD@gmail.com"
 *                     username: "johndoe"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please provide name, email and username"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to update"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - jwtAuth: []
 *     responses:
 *       200:
 *         description: The user was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to delete"
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */
