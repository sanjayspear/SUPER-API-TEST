import request from '../../config/common.js'
import { expect } from "chai";
import { createRandomUser } from '../../helper/user_helper.js'
import dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.TOKEN; // Assuming you've set this in your .env file
const INVALID_TOKEN = process.env.INVALID_TOKEN;

let postId, userID;

before(async () => { // Use an async function if you are using await inside
    userID = await createRandomUser();
});

describe('User Posts', () => {

    it('/posts', async () => { // Removed only to allow all tests to run
        const data = {
            user_id: userID, // Ensuring 'user_id' is a number
            title: "my title",
            body: "my blog post",
        };

        const postRes = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data);

        //console.log(postRes.body);
        expect(postRes.body).to.deep.include(data);
        postId = postRes.body.id;
    });

    it('GET /posts/:id', async () => { // Removed only to allow all tests to run
        await request
            .get(`posts/${postId}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .expect(200);
    });
});

describe('Negative Tests', () => {

    it('401 Authentication Failed Test-1 (Using Invalid TOKEN :: Approach 1)', async () => {
        const data = {
            user_id: userID, // Ensuring 'user_id' is a number
            title: "my title",
            body: "my blog post",
        };

        const postRes = await request
            .post('posts')
            .set("Authorization", `Bearer ${INVALID_TOKEN}`)
            .send(data).expect(401);
    });

    it('401 Authentication Failed Test-2 (WIthout using any token :: Approach 2)', async () => {
        const data = {
            user_id: userID, // Ensuring 'user_id' is a number
            title: "my title",
            body: "my blog post",
        };
        const response = await request
            .post('posts')
            .send(data);

        // First, ensure that you've received a response
        expect(response).to.exist;
        // Check the status code if it's 401 Unauthorized
        expect(response.statusCode).to.equal(401);

        // Since the message is in the 'text' field, parse it as JSON
        const responseBody = JSON.parse(response.text);

        // Now, assert that the 'message' field equals "Authentication failed"
        expect(responseBody.message).to.equal("Authentication failed");
    });

    it('Should return 422 Data Validation Failed when user makes post request with invalid data', async () => {
        const data = {
            user_id_00: userID, // Ensuring 'user_id' is a number
            title_00: "my title",
            body_00: "my blog post",
        };
        const response = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data);

        // First, ensure that you've received a response
        expect(response).to.exist;
        // Check the status code if it's 422 Data vlaidation failed
        expect(response.statusCode).to.equal(422);
    });

});
