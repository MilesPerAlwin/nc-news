const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("CORE: GET /api/topics test suite", () => {
    test("returns a 200 GET request with an array of of topic objects, each with a slug and description properties", () => {
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
// test ideas for GET /api/topics:

// TEST FOR POSSIBLE ERRORS FOR THIS ONE

// get all topics
// responds with array of topic objects, each of which have slug and description properties