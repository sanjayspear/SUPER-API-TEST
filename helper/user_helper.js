import supertest from "supertest";
import dotenv from "dotenv";
import qa from "../config/qa.js";
dotenv.config();

const request = supertest(qa.baseUrl);
const TOKEN = process.env.TOKEN; // Assuming you've set this in your .env file
export const createRandomUser = async () => {
    const userData = {
        "name": "Sanjay Y M",
        "email": `Anvitha.dhruv-${Math.floor(Math.random() * 9999)}@farrell.test`,
        "gender": "male",
        "status": "active"
    };

    const res = await request
        .post('users')
        .set("Authorization", `Bearer ${TOKEN}`)
        .send(userData);

    const userID = res.body.id; // Extract userID from response

    return userID;

};