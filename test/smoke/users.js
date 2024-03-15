
import request from "../../config/common.js"
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

//const TOKEN = 'e69d4652e40a1143dec6af71b044b7250f6fc12251b936b114b40b2baf6141f9';
const TOKEN = process.env.TOKEN; // Assuming you've set this in your .env file

describe('User API Tests', () => {
    let users;
    let userID;

    before(async () => {
        // Fetching users before running tests
        const response = await request.get(`users?access-token=${TOKEN}`);
        users = response.body;
    });

    //CRUD Operations

    //Group by POST method call (Create)

    describe('POST', () => {
        it('POST /users/:id :: To create a new user', () => {
            const data = {
                "name": "Sanjay Y M",
                "email": `Anvitha.dhruv-${Math.floor(Math.random() * 9999)}@farrell.test`,
                "gender": "male",
                "status": "active"
            };
            return request
                .post('users')
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
                .then((res) => {
                    userID = res.body.id;
                    console.log(`Newly created user id is: ${userID}`);
                    console.log(res.body);
                    //data.email = 'test@mail.ca';
                    //Assertion comparision: Approach 1 ==> Lengthy
                    /*expect(res.body.email).to.eq(data.email);
                    expect(res.body.status).to.eq(data.status);
                    expect(res.body.gender).to.eq(data.gender);
                    expect(res.body.name).to.eq(data.name);*/

                    //Assertion comparision: Approach 2 ==> Short (Single Line)

                    expect(res.body).to.deep.include(data);
                });
        });
    });

    //Group by GET method call (Retrieve)
    describe('GET', () => {
        it('GET /users', (done) => {
            request.get(`users?access-token=${TOKEN}`).end((err, res) => {
                expect(res.body).to.not.be.empty;
                done(err);
            });
        });

        it('GET /users/:id', (done) => {
            request.get(`users/${userID}?access-token=${TOKEN}`).end((err, res) => {
                if (err) done(err);
                expect(res.body.id).to.equal(userID);
                done();
            });
        });

        it('GET /users/:name', (done) => {
            request.get(`users/${userID}?access-token=${TOKEN}`).end((err, res) => {
                if (err) done(err);
                expect(res.body.name).to.equal("Sanjay Y M");
                done();
            });
        });

        it('GET users with query param', (done) => {
            const url = `users?access-token=${TOKEN}&gender=male&status=active`;
            request.get(url).end((err, res) => {
                if (err) done(err);
                // Assuming the API returns an array of users matching the criteria
                // You might want to check if any of the returned users match your criteria
                // For demonstration, let's simply check if the array is not empty
                expect(res.body).to.be.an('array').that.is.not.empty;
                res.body.forEach(element => {
                    expect(element.gender).to.eq('male');
                    expect(element.status).to.eq('active');
                });
                // If you were looking for a specific user, you'd need to filter `res.body` and find that user, then do your assertion
                done();
            });
        });

    });

    //Group by PUT method call (Update)
    describe('UPDATE', () => {
        it('PUT /users/:id :: To update existing user', () => {
            const data = {
                "name": "Anvitha Ram Kumar Verma",
                "email": `anvitha.ram.kumar.verma-${Math.floor(Math.random() * 9999)}@farrell.test`,
                "gender": "female",
                "status": "inactive"
            };
            return request
                .put(`users/${userID}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
                .then((res) => {
                    //console.log(res.body);
                    expect(res.body).to.deep.include(data);
                });
        });
    });

    //Group by DELETE method call (Delete)
    describe('DELETE', () => {
        it('DELETE /users/:id :: Delete existing user', () => {
            return request
                .delete(`users/${userID}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .then((res) => {
                    console.log(res.body);
                    expect(res.body).to.be.empty;
                })
        });
    });


    //Group by functionality
    describe('User API Functionality Test', () => {

        it('should fetch all users', async () => {
            expect(users).to.be.an('array');
            expect(users.length).to.be.greaterThan(0);
        });

        it('should have users with necessary properties', () => {
            users.forEach(user => {
                expect(user).to.include.keys('id', 'name', 'email', 'gender', 'status');
            });
        });

        it('should filter users by gender - female', () => {
            const females = users.filter(user => user.gender === 'female');
            expect(females.length).to.be.greaterThan(0);
            females.forEach(female => {
                expect(female.gender).to.equal('female');
            });
        });

        it('should filter users by status - inactive', () => {
            const inactiveUsers = users.filter(user => user.status === 'inactive');
            expect(inactiveUsers.length).to.be.greaterThan(0);
            inactiveUsers.forEach(user => {
                expect(user.status).to.equal('inactive');
            });
        });

    });


});
