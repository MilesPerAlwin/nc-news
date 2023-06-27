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