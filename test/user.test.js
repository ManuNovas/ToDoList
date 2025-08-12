require("dotenv").config({path: "./.env.test"});
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require("../models/user");
let expect, token, refreshToken;

chai.use(chaiHttp);
expect = chai.expect;

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
                token = response.body.token;
                refreshToken = response.body.refreshToken;
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
    it("Should refresh token", (done) => {
        chai.request(app)
            .post("/users/refresh-token")
            .set("Authorization", "Bearer " + refreshToken)
            .end((error, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });
    it("Should fail refreshing token", (done) => {
        chai.request(app)
            .post("/users/refresh-token")
            .set("Authorization", "Bearer " + token)
            .end((error, response) => {
                expect(response).to.have.status(400);
                done();
            });
    });
});
