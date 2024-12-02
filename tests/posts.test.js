import request from "supertest";
import app from "../server.js";

process.env.NODE_ENV = "test";

var accessToken, accessToken2;

beforeAll(async () => {
    const res = await request(app).post("/api/user/login").send({
        email: process.env.TEST_USER_1,
        password: process.env.TEST_USER_1_PASSWORD,
    });
    accessToken = res.headers.authorization;
    const res2 = await request(app).post("/api/user/login").send({
        email: process.env.TEST_USER_2,
        password: process.env.TEST_USER_2_PASSWORD,
    });
    accessToken2 = res2.headers.authorization;
});

describe("Posts API", () => {
    let postId;
    let userId;

    it("should create a new post", async () => {
        const res = await request(app)
            .post("/api/post")
            .set("Authorization", accessToken)
            .send({
                message: "hey test",
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("post");
        expect(res.body.post).toHaveProperty("_id");
        postId = res.body.post._id;
        userId = res.body.post.user;
    });

    it("should throw error creating post", async () => {
        const res = await request(app)
            .post("/api/post")
            .set("Authorization", accessToken)
            .send({});
        expect(res.statusCode).toEqual(400);
    });

    it("should fetch posts by user", async () => {
        const res = await request(app).get(`/api/post?user=${userId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.posts).toBeInstanceOf(Array);
    });

    it("should fetch a post by id", async () => {
        const res = await request(app).get(`/api/post/${postId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.post).toHaveProperty("_id", postId);
    });

    it("should not found a post", async () => {
        const res = await request(app).get(
            `/api/post/674456083c66f60e49855757`
        );
        expect(res.statusCode).toEqual(404);
    });

    it("should fetch all posts", async () => {
        const res = await request(app).get(`/api/post/all`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.posts).toBeInstanceOf(Array);
    });

    it("should update a post", async () => {
        const res = await request(app)
            .put(`/api/post/${postId}`)
            .set("Authorization", accessToken)
            .send({
                message: "hey test updated",
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.post).toHaveProperty("message", "hey test updated");
    });

    it("should error updating - post not found", async () => {
        const res = await request(app)
            .put(`/api/post/674456083c66f60e49855757`)
            .set("Authorization", accessToken)
            .send({
                message: "hey test updated",
            });
        expect(res.statusCode).toEqual(404);
    });

    it("should error updating - message is required", async () => {
        const res = await request(app)
            .put(`/api/post/${postId}`)
            .set("Authorization", accessToken)
            .send({});
        expect(res.statusCode).toEqual(400);
    });

    it("should error updating - Unauthorized", async () => {
        const res = await request(app)
            .put(`/api/post/${postId}`)
            .set("Authorization", accessToken2)
            .send({
                message: "hey test updated",
            });
        expect(res.statusCode).toEqual(401);
    });

    it("should error deleting a post - post not found", async () => {
        const res = await request(app)
            .delete(`/api/post/674456083c66f60e49855757`)
            .set("Authorization", accessToken);
        expect(res.statusCode).toEqual(404);
    });

    it("should error deleting a post - Unauthorized", async () => {
        const res = await request(app)
            .delete(`/api/post/${postId}`)
            .set("Authorization", accessToken2);
        expect(res.statusCode).toEqual(401);
    });

    it("should delete a post", async () => {
        const res = await request(app)
            .delete(`/api/post/${postId}`)
            .set("Authorization", accessToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success", true);
    });
});
