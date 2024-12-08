import request from "supertest";
import app from "../server.js";

process.env.NODE_ENV = "test";

var accessToken2;

beforeAll(async () => {
    const res2 = await request(app).post("/api/user/login").send({
        email: process.env.TEST_USER_2,
        password: process.env.TEST_USER_2_PASSWORD,
    });
    accessToken2 = res2.headers.authorization;
});

describe("user API", () => {
    var userId;
    var accessToken;

    it("should register a new user", async () => {
        const res = await request(app).post("/api/user/register").send({
            name: "Test User",
            email: "testuser@example.com",
            password: "password123",
            username: "testuser",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body.user).toHaveProperty("_id");
        expect(res.body.user).toHaveProperty("name", "Test User");
        expect(res.body.user).toHaveProperty("email", "testuser@example.com");
        expect(res.body.user).toHaveProperty("username", "testuser");
        userId = res.body.user._id;
    });

    it("should login a user", async () => {
        const res = await request(app).post("/api/user/login").send({
            email: "testuser@example.com",
            password: "password123",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body.user).toHaveProperty("_id");
        expect(res.body.user).toHaveProperty("name", "Test User");
        expect(res.body.user).toHaveProperty("email", "testuser@example.com");
        expect(res.body.user).toHaveProperty("username", "testuser");
        accessToken = res.headers.authorization;
    });

    it("should delete a user", async () => {
        const res = await request(app)
            .delete(`/api/user/`)
            .set("authorization", accessToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success", true);
    });
});
