const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const dotenv = require("dotenv");
const connectDB = require("../config/database");
const User = require("../models/User");
let expect;

dotenv.config({
    path: "./.env.test"
});
chai.use(chaiHttp);
expect = chai.expect;
connectDB();

describe("Integration test for user management", () => {
    before(async () => {
        await User.deleteMany({});
    });
    it("Should register a new user", (done) => {
        chai.request(app)
            .post("/users/register")
            .send({
                name: "Clive Rosfield",
                email: "clive@rosfield.test",
                password: "1q2w3e4r",
            })
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("token");
                done();
            });
    });
    it("Should fail registering an existing user", (done) => {
        chai.request(app)
            .post("/users/register")
            .send({
                name: "Clive Rosfield",
                email: "clive@rosfield.test",
                password: "1q2w3e4r",
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                done();
            });
    });
    it("Should fail registering user without required fields", (done) => {
        chai.request(app)
            .post("/users/register")
            .send({
                name: "Clive Rosfield",
                email: "clive@rosfield.test",
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                done();
            });
    });
    it("Should login a registered user", (done) => {
        chai.request(app)
            .post("/users/login")
            .send({
                email: "clive@rosfield.test",
                password: "1q2w3e4r",
            })
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.have.property("token");
                done();
            });
    });
    it("Should fail login an unregistered user", (done) => {
        chai.request(app)
            .post("/users/login")
            .send({
                email: "joshua@rosfield.test",
                password: "1q2w3e4r",
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                done();
            });
    });
    it("Should fail login with wrong credentials", (done) => {
        chai.request(app)
            .post("/users/login")
            .send({
                email: "clive@rosfield.test",
                password: "1q2w3e4r5t",
            })
            .end((error, response) => {
                expect(response).to.have.status(401);
                done();
            });
    });
});
