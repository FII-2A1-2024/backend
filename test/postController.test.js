const PostController = require('../src/controllers/postController');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const path = require("path");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "..", "src", "config", ".env.local");
dotenv.config({ path: envPath });

let MockId = 0;

describe("CRUD TestCases for Post Component", () => {

    test("SHOULD CREATE A POST WITH CORRECT INPUT", async () => {

        //request (this is a mock request to test CRUD on Post table)
        req = { 
            body : {
                author_id : 2, 
                title: "Test post for Testing module",
                description : "This post is used to create a mock post to test the insert operation", 
                votes: 23, 
                category : "testing" 
            }};
        //response after CRUD Test starts
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"ok", message:"post created successfully" });
    });

    test("SHOULD NOT CREATE A POST WITH INVALID AUTHOR_ID", async () => {

        req = { 
            body : {
                author_id : -2, //invalid author_id
                title: "Test post for Testing module",
                description : "This post is used to create a mock post to test the insert operation", 
                votes: 23,  
                category : "testing" 
            }};

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Invalid author_id" });
    });

    test("SHOULD NOT CREATE A POST WITH TITLE EXCEEDING LIMITS", async () => {

        req = { 
            body : {
                author_id : 2, 
                //title is beyond limits [0, 50]
                title: "Test title for this post is longer than 50 characters -> this should raise an error",
                description : "This post is used to create a mock post to test the insert operation", 
                votes: 23,  
                category : "testing" 
            }};
            
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Title entry too long/empty" });
    });

    test("SHOULD NOT CREATE A POST WITH DESCRIPTION EXCEEDING LOWER BOUNDS", async () => {

        //request (this is a mock request to test CRUD on Post table)
        req = { 
            body : {
                author_id : 2, 
                title: "Test post for Testing module",
                description : "", //invalid description length
                votes: 23,  
                category : "testing" 
            }};
        //response after CRUD Test starts
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Description entry too long/empty" });
    });

    test("GET AUTOINCREMENT ID VALUE", async () => {
        
        req = {};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.getAll(req, res);

        const posts = res.json.mock.calls[0][0].posts;
        const lastPost = posts[posts.length - 1];
        MockId = lastPost.id;

        console.log("The test will perform with the id: " + MockId);
        
    });

    test("SHOULD READ A POST BY EXISTING ID", async () => {

        req = { query: { id: MockId } };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.get(req, res);

        //mock post inserted earlier -> this should be returned by get 
        const mockPost = {
            id : res.json.mock.calls[0][0].post.id,
            author_id : 2, 
            title: "Test post for Testing module",
            description : "This post is used to create a mock post to test the insert operation", 
            votes: 23, 
            created_at : res.json.mock.calls[0][0].post.created_at,
            category : "testing",
        };   

        expect(res.json).toHaveBeenCalledWith({status : 'ok', post: mockPost });
    });

    test("SHOULD NOT READ A POST BY UNEXISTING ID", async () => {

        req = { query: { id: -1 } };    //unexisting ID in table Posts
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.get(req, res);

        //mock post inserted earlier -> this should be returned by get 
        const mockPost = {
            author_id : 2, 
            title: "Test post for Testing module",
            description : "This post is used to create a mock post to test the insert operation", 
            votes: 23, 
            created_at : "not important",
            category : "testing"
        };   

        expect(res.json).toHaveBeenCalledWith({status : 'err', message : 'No post found with the given id'});
    });

    test("SHOULD UPDATE A POST WITH CORRECT INPUT", async () => {

        req = { 
            body: { 
                id: MockId, 
                author_id : 2, 
                title: "New title",
                description : "New description for a post to simulate an update for the mock post", 
                votes: 100, 
                category : "testing"
            } 
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.put(req, res);

        expect(res.json).toHaveBeenCalledWith({ status :"ok", message :"post updated successfully" });
    });

    test("SHOULD NOT UPDATE A POST's TITLE WITH UNEXISTING ID", async () => {

        req = { 
            body: { 
                id: 0, 
                // author_id : 2, 
                title: "New title",
                // description : "New description for a post to simulate an update for the mock post", 
                // votes: 100, 
                // category : "testing"
            } 
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.put(req, res);

        expect(res.json).toHaveBeenCalledWith({ status :"err", message :"Post with the given id doesn't exist" });
    });

    test("SHOULD NOT UPDATE A POST's DESCRIPTION WITH UNEXISTING ID", async () => {

        req = { 
            body: { 
                id: 0, 
                // author_id : 2, 
                // title: "New title",
                description : "New description for a post to simulate an update for the mock post", 
                // votes: 100, 
                // category : "testing"
            } 
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.put(req, res);

        expect(res.json).toHaveBeenCalledWith({ status :"err", message :"Post with the given id doesn't exist" });
    });

    test("SHOULD NOT UPDATE A POST's VOTES WITH UNEXISTING ID", async () => {

        req = { 
            body: { 
                id: 0, 
                // author_id : 2, 
                // title: "New title",
                // description : "New description for a post to simulate an update for the mock post", 
                votes: 100, 
                // category : "testing"
            } 
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.put(req, res);

        expect(res.json).toHaveBeenCalledWith({ status :"err", message :"Post with the given id doesn't exist" });
    });

    test("SHOULD NOT UPDATE A POST WITH TITLE EXCEEDING LIMITS", async () => {

        req = { 
            body: { 
                id: MockId, 
                // author_id : 2, 
                title: "This new title is exciding bounds such as this post will not update and will raise an error",
                // description : "New description for a post to simulate an update for the mock post", 
                // votes: 100, 
                // category : "testing"
            } 
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.put(req, res);

        expect(res.json).toHaveBeenCalledWith({ status :"err", message :"Title entry too long/empty" });
    });

    test("SHOULD NOT UPDATE A POST WITH DESCRIPTION EXCEEDING LOWER BOUNDS", async () => {

        req = { 
            body: { 
                id: MockId, 
                // author_id : 2, 
                // title: "New title",
                description : "", //empty description
                // votes: 100, 
                // category : "testing"
            } 
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.put(req, res);

        expect(res.json).toHaveBeenCalledWith({ status :"err", message :"Description entry too long/empty" });
    });

    test("SHOULD DELETE A POST WITH EXISTING ID", async () => {

        req = { query: { id: MockId } };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.delete(req, res);

        expect(res.json).toHaveBeenCalledWith({ status : "ok", message :"post deleted successfully" });
    });

});
