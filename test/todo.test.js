require("dotenv").config({path: "./.env.test"});
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../models/User");
const Todo = require("../models/todo");
const userController = require("../controllers/userController");
let expect, user, token, todoID;

chai.use(chaiHttp);
expect = chai.expect;

describe("Integration test for todo management", () => {
    before(async () => {
        User.deleteMany({});
        Todo.deleteMany({});
        user = await User.create([{
            name: "Jill Warrick",
            email: "jill@qarrick.test",
            password: "1q2w3e4r",
        }], {
            new: true,
        });
        token = userController.generateToken(user[0].email);
        await Todo.create([
            {
                user: user[0]._id,
                title: "Test todo 1",
                description: "Test description 1",
            },
            {
                user: user[0]._id,
                title: "Test todo 2",
                description: "Test description 2",
            },
            {
                user: user[0]._id,
                title: "Test todo 3",
                description: "Test description 3",
            },
            {
                user: user[0]._id,
                title: "Test todo 4",
                description: "Test description 4",
            },
            {
                user: user[0]._id,
                title: "Test todo 5",
                description: "Test description 5",
            }
        ]);
    });
    it("Should create a new todo for user", (done) => {
        chai.request(app)
            .post("/todos")
            .set("Authorization", "Bearer " + token)
            .send({
                title: "Test todo",
                description: "Test description",
            })
            .end((error, response) => {
                expect(response).to.have.status(200);
                todoID = response.body.id;
                done();
            });
    });
    it("Should validate required fields when create a new todo for user", (done) => {
        chai.request(app)
            .post("/todos")
            .set("Authorization", "Bearer " + token)
            .send({
                description: "Test description",
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                done();
            });
    });
    it("Should update for an existing todo for user", (done) => {
        chai.request(app)
            .put("/todos/" + todoID)
            .set("Authorization", "Bearer " + token)
            .send({
                title: "Test todo updated",
                description: "Test description updated",
            })
            .end((error, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });
    it("Should validate an update for an existing todo for user", (done) => {
        chai.request(app)
            .put("/todos/" + todoID)
            .set("Authorization", "Bearer " + token)
            .send({
                id: todoID,
                title: "Test todo updated",
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                done();
            });
    });
    it("Should delete for an existing todo for user", (done) => {
        chai.request(app)
            .delete("/todos/" + todoID)
            .set("Authorization", "Bearer " + token)
            .end((error, response) => {
                expect(response).to.have.status(204);
                done();
            });
    });
    it("Should not delete for an unexisting todo for user", (done) => {
        chai.request(app)
            .delete("/todos/" + todoID)
            .set("Authorization", "Bearer " + token)
            .end((error, response) => {
                expect(response).to.have.status(400);
                done();
            });
    });
    it("Should list todos of user", (done) => {
        chai.request(app)
            .get("/todos")
            .set("Authorization", "Bearer " + token)
            .end((error, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });
    it("Should filter todos of user", (done) => {
        chai.request(app)
            .get("/todos?search=test")
            .set("Authorization", "Bearer " + token)
            .end((error, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });
    it("Should paginate todos of user", (done) => {
        chai.request(app)
            .get("/todos?page=2&limit=2")
            .set("Authorization", "Bearer " + token)
            .end((error, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });
    it("Should order todos of user", (done) => {
        chai.request(app)
            .get("/todos?sort=2&order=-1")
            .set("Authorization", "Bearer " + token)
            .end((error, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });
});

