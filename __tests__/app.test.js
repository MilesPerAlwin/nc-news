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
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: 11
                }
            );
        })
    });
    test("returns a 200 GET request with an article object with comment_count as 0 for a given article with no comments", () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toEqual(
                {
                    article_id: 2,
                    title: "Sony Vaio; or, The Laptop",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    created_at: "2020-10-16T05:03:00.000Z",
                    votes: 0,
                    article_img_url:
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: 0
                }
            )
        })
    })
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
describe("CORE: GET /api/articles functionality test suite", () => {
    test("returns a 200 GET request with an article array of article objects without a body property in date descending order", () => {   
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {    
            expect(body.articles).toHaveLength(13);
            const isSorted = body.articles.every((val, i, arr) => !i || arr[i-1].created_at >= val.created_at);
            expect(isSorted).toBe(true);

            const commentCounts = {
                1: 11,
                2: 0,
                3: 2,
                4: 0,
                5: 2,
                6: 1,
                7: 0,
                8: 0,
                9: 2,
                10: 0,
                11: 0,
                12: 0,
                13: 0
            };
            
            body.articles.forEach((article) => {
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("article_img_url");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("comment_count");
                expect(article).not.toHaveProperty("body");
                expect(article.comment_count).toBe(commentCounts[article.article_id])
            })
        });
    })
    test("returns a 200 GET request with an article array of article objects filtered by the given topic", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(12)
            body.articles.forEach((article) => {
                expect(article.topic).toBe("mitch");
            })
        });
    });
    test("returns a 200 GET request with an article array of no article objects for a given topic does not exist", () => {
        return request(app)
        .get("/api/articles?topic=banana")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(0)
        })
    });
    test("returns a 200 GET request with an article array of articles sorted by the given column name in ascending order", () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy('author', { descending: true });
        })
    });
    test("returns a 200 GET request with an article array of articles sorted by date even when specified (not only as default value)", () => {
        return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy('created_at', { descending: true });
        })
    });
    test("returns a 200 GET request with an article array of articles sorted by the given column and ordered by ascending order when specified", () => {
        return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy('author', { ascending: true });
        })
    });
    test("returns a 200 GET request with an article array of articles sorted by the given column and ordered by descending order when specified", () => {
        return request(app)
        .get("/api/articles?sort_by=author&order=desc")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy('author', { descending: true });
        })
    });
});
describe("CORE: GET /api/articles error test suite", () => {
    test("returns a 404 with an error message when passed an invalid endpoint", () => {
        return request(app)
        .get("/api/arrticles")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Path not found.");
        })
    });
    test("returns a 400 with an error message when passed an invalid column name to sort", () => {
        return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Column does not exist.");
        })
    });
    test("returns a 400 with an error message when passed an invalid order value", () => {
        return request(app)
        .get("/api/articles?sort_by=author&order=banana")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request.");
        })
    });
});
describe("CORE: GET /api/articles/:article_id/comments functionality test suite", () => {
    test("returns a 200 GET request with an array of comments for the given article_id sorted by most recent comments first", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(11);
            expect(body.comments).toBeSortedBy('created_at', { descending: true });
            body.comments.forEach((comment) => {
                expect(comment).toHaveProperty("comment_id", expect.any(Number));
                expect(comment).toHaveProperty("votes", expect.any(Number));
                expect(comment).toHaveProperty("created_at", expect.any(String));
                expect(comment).toHaveProperty("author", expect.any(String));
                expect(comment).toHaveProperty("body", expect.any(String));
                expect(comment).toHaveProperty("article_id", expect.any(Number));
            })
        })
    });
    test("returns a 200 GET request with an empty array for the given valid article_id that has no comments", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(0);
        })
    });
});
describe("CORE: GET /api/articles/:article_id/comments error test suite", () => {
    test("returns a 400 with an error message when passed an invalid article id", () => {
        return request(app)
        .get("/api/articles/2w/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request.");
        })
    })
    test("returns a 404 with an error message when passed a valid id that does not exist", () => {
        return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found.");
        })
    })
})
describe("CORE: POST /api/articles/:article_id/comments functionality test suite", () => {
    test("returns a 201 POST with a comment object of the posted comment to the given article", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({ "username": "lurker", "body": "BANANA!" })
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toHaveProperty("author");
            expect(body.comment).toHaveProperty("body");
            expect(body.comment).toHaveProperty("article_id");
            expect(body.comment).toHaveProperty("comment_id");
            expect(body.comment).toHaveProperty("created_at");
            expect(body.comment).toHaveProperty("votes");
        })
    })
    test("returns a 201 POST and ignores unnecessary properties on the sent comment", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({ "username": "lurker", "body": "BANANA!", "age": 10 })
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toHaveProperty("author");
            expect(body.comment).toHaveProperty("body");
            expect(body.comment).toHaveProperty("article_id");
            expect(body.comment).toHaveProperty("comment_id");
            expect(body.comment).toHaveProperty("created_at");
            expect(body.comment).toHaveProperty("votes");
            expect(body.comment).not.toHaveProperty("age");
        })
    })
});
describe("CORE: POST /api/articles/:article_id/comments error test suite", () => {
    test("returns a 404 with an error message when passed a valid article id but user does not exist", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({ "username": "lurker55555", "body": "BANANA!" })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found.");
        })
    })
    test("returns a 404 with an error message when passed a valid article id that does not exist", () => {
        return request(app)
        .post("/api/articles/9999/comments")
        .send({ "username": "lurker", "body": "BANANA!" })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found.");
        })
    })
    test("returns a 400 when passed an invalid article id", () => {
        return request(app)
        .post("/api/articles/banana/comments")
        .send({ "username": "lurker", "body": "BANANA!" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request.");
        })
    })
    test("returns a 400 when passed a json request with no comment", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({ "username": "lurker" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid body passed.");
        })
    })
    test("returns a 400 when passed an empty json request", () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send()
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid body passed.");
        })
    })
});
describe("CORE: PATCH /api/articles/:article_id functionality test suite", () => {
    test("returns a 200 PATCH with an article object with the votes increased for the given updated article", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toHaveProperty("title");
            expect(body.article).toHaveProperty("topic");
            expect(body.article).toHaveProperty("author");
            expect(body.article).toHaveProperty("created_at");
            expect(body.article).toHaveProperty("article_img_url");
            expect(body.article).toHaveProperty("article_id");
            expect(body.article).toHaveProperty("votes");
            expect(body.article).toHaveProperty("body");
            expect(body.article.votes).toBe(101);
        })
    })
    test("returns a 200 PATCH with the votes decreased for the given article to update", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body }) => {
            expect(body.article.votes).toBe(99);
        })
    })
    test("returns a 200 PATCH with the votes value unchanged for the given article to update when sent a request of zero votes", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 0 })
        .expect(200)
        .then(({ body }) => {
            expect(body.article.votes).toBe(100);
        })
    })
    test("returns a 200 PATCH and ignores unnecessary properties on the sent votes request", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1, banana: "I'm a banana" })
        .expect(200)
        .then(({ body }) => {
            expect(body.article).not.toHaveProperty("banana");
            expect(body.article.votes).toBe(101);
        })
    })
    test("returns a 200 PATCH with votes at zero when given a request to decrease votes for the given article that is greater than the current number of votes", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -101 })
        .expect(200)
        .then(({ body }) => {
            expect(body.article.votes).toBe(0);
        })
    })
});
describe("CORE: PATCH /api/articles/:article_id error test suite", () => {
    test("return a 400 when passed an empty json request", () => {
        return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid body passed.")
        })
    })
    test("return a 400 when passed an invalid value on the inc_votes property", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "banana" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request.")
        })
    })
    test("return a 404 when passed a valid article id that does not exist", () => {
        return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found.");
        })
    })
})
describe("CORE: DELETE /api/comments/:comment_id functionality test suite", () => {
    test("returns a 204 response upon successful deletion", () => {
        return request(app)
        .delete("/api/comments/2")
        .expect(204)
    })
});
describe("CORE: DELETE /api/comments/:comment_id error test suite", () => {
    test("returns a 404 when passed a valid comment id that does not exist", () => {
        return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found.");
        })
    })
    test("returns a 400 when passed an invalid comment id", () => {
        return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request.");
        })
    })
});
describe("CORE: GET /api/users functionality test suite", () => {
    test("returns a 200 GET request with an array of user objects, each with relevant properties", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            expect(body.users).toHaveLength(4);
            body.users.forEach((user) => {
                expect(user).toHaveProperty("username");
                expect(user).toHaveProperty("name");
                expect(user).toHaveProperty("avatar_url");
            })
        })
    })
})
describe("CORE: GET /api/users error test suite", () => {
    test("returns a 404 with an error message when passed an invalid endpoint", () => {
        return request(app)
        .get("/api/usersss")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Path not found.");
        })
    })
})