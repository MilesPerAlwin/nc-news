const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("CORE: GET /api/topics functionality test suite", () => {
    test("returns a 200 GET request with an array of topic objects, each with a slug and description properties", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug");
                expect(topic).toHaveProperty("description");
            })
        });
    });
});
describe("CORE: GET /api/topics error test suite", () => {
    test("returns a 404 with an error message when passed an invalid endpoint", () => {
        return request(app)
        .get("/api/toppics")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Path not found.");
        })
    });    
});
describe("CORE: GET /api functionality test suite", () => {
    test("returns a 200 GET request with a JSON object from endpoints.json describing all the available endpoints on the API", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints);
        })
    });
});
describe("CORE: GET /api/articles/:article_id functionality test suite", () => {
    test("returns a 200 GET request with an article object corresponding to the given article id", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveProperty("article");
            expect(body.article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                }
            );
        })
    });
});
describe("CORE: GET /api/articles/:article_id error test suite", () => {
    test("returns a 400 with an error message when passed an invalid article id", () => {
        return request(app)
        .get("/api/articles/1q")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request.");
        })
    })
    test("returns a 404 with an error message when passed a valid id that does not exist", () => {
        return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found.");
        })
    })
});