import qa from '../config/qa.js';
import supertest from "supertest";
const request = supertest(qa.baseUrl);

export default request;