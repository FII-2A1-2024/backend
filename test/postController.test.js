const PostController = require('../src/controllers/postController');
const post = require("../src/models/postModel");
const dbQuery = require("../src/utils/dbQuery");
let MockId = 0;

describe("CRUD TestCases for Post Component", () => {

    test("SHOULD CREATE A POST WITH CORRECT INPUT", async () => {

        //request (this is a mock request to test CRUD on Post table)
        req = { 
            query : {
                author_id : 2, 
                title: "Test post for Testing module",
                description : "This post is used to create a mock post to test the insert operation", 
                votes: 23,  
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
            query : {
                author_id : -2, //invalid author_id
                title: "Test post for Testing module",
                description : "This post is used to create a mock post to test the insert operation", 
                votes: 23,  
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
            query : {
                author_id : 2, 
                //title is beyond limits [0, 50]
                title: "Test title for this post is longer than 50 characters -> this should raise an error",
                description : "This post is used to create a mock post to test the insert operation", 
                votes: 23,  
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
            query : {
                author_id : 2, 
                title: "Test post for Testing module",
                description : "", //invalid description length
                votes: 23,  
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

        const values = [];
        const newId =  await dbQuery(values, "SELECT LAST_INSERT_ID() AS LAST;");
        MockId = newId[0].LAST;
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
            author_id : 2, 
            title: "Test post for Testing module",
            description : "This post is used to create a mock post to test the insert operation", 
            votes: 23, 
            created_at : res.json.mock.calls[0][0].post.created_at
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
            created_at : "not important"
        };   

        expect(res.json).toHaveBeenCalledWith({status : 'err', message : 'No post found with the given id'});
    });

    test("SHOULD UPDATE A POST WITH CORRECT INPUT", async () => {

        req = { 
            query: { 
                id: MockId, 
                author_id : 2, 
                title: "New title",
                description : "New description for a post to simulate an update for the mock post", 
                votes: 100, 
            } 
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.put(req, res);

        expect(res.json).toHaveBeenCalledWith({ status :"ok", message :"post updated successfully" });
    });

    test("SHOULD NOT UPDATE A POST WITH UNEXISTING ID", async () => {

        req = { 
            query: { 
                id: 0, 
                author_id : 2, 
                title: "New title",
                description : "New description for a post to simulate an update for the mock post", 
                votes: 100, 
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
            query: { 
                id: MockId, 
                author_id : 2, 
                title: "This new title is exciding bounds such as this post will not update and will raise an error",
                description : "New description for a post to simulate an update for the mock post", 
                votes: 100, 
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
            query: { 
                id: MockId, 
                author_id : 2, 
                title: "New title",
                description : "", //empty description
                votes: 100, 
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

    test("SHOULD NOT DELETE A POST WITH UNEXISTING ID", async () => {

        req = { query: { id: 1 } };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.delete(req, res);

        expect(res.json).toHaveBeenCalledWith({ status : "err", message : "Post with the given id doesn't exist"});
    });

});
