const PostController = require('../src/controllers/postController');
const CommentController = require('../src/controllers/commentController');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const path = require("path");
const dotenv = require("dotenv");
const { query } = require('express');
const envPath = path.resolve(__dirname, "..", "src", "config", ".env.local");
dotenv.config({ path: envPath });

let PostMockId = 0;
let CommentMockId = 0;

describe("CRUD TestCases for Comment Component", () => {

    //We will create a mock post in order to test the comment controller
    test("SHOULD CREATE A POST", async () => {

        req = { 
            body : {
                author_id : 1, 
                title: "Test post for Testing module",
                description : "This post is used to test the Comment Controller", 
                votes: 1, 
                category : "testing" 
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"ok", message:"post created successfully" });
    });

    test("SHOULD GET LAST INSERTED POST's ID", async () => {
        
        req = {};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await PostController.getAll(req, res);

        const posts = res.json.mock.calls[0][0].posts;
        const lastPost = posts[posts.length - 1];
        PostMockId = lastPost.id;

        console.log("The test will perform with the post's id: " + PostMockId);
        
    });

    test("SHOULD CREATE A COMMENT WITH CORECT INPUT", async () => {
    
        //We will create a mock comment in order to test the comment controller
        req = { 
            body : {
                post_id : PostMockId,
                parent_id : -1,
                author_id : 1,
                description : "mock Comment for testing module",
                votes : 1
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"ok", message:"Comment added to db" });
    });

    test("SHOULD GET LAST INSERTED POST COMMENTS's ID", async () => {
        
        req = { query : { post_id : PostMockId }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.getAll(req, res);

        const comments = res.json.mock.calls[0][0].post;
        const lastComment = comments[comments.length - 1];
        CommentMockId = lastComment.detaliiComentariu.id;

        console.log("The test will perform with the comment's id: " + CommentMockId );
    });

    test("SHOULD NOT CREATE A COMMENT WITH UNEXISTING POST ID", async () => {

        req = { 
            body : {
                post_id : 99999,
                parent_id : -1,
                author_id : 1,
                description : "mock Comment for testing module",
                votes : 1
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Inexistent post_id" });
    });

    test("SHOULD NOT CREATE A COMMENT WITH UNEXISTING PARENT ID", async () => {

        req = { 
            body : {
                post_id : PostMockId,
                parent_id : 99999,
                author_id : 1,
                description : "mock Comment for testing module",
                votes : 1
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Inexistent parent_id" });
    });

    test("SHOULD NOT CREATE A COMMENT WITH DESCRIPTION EXCEEDING BOUNDS", async () => {

        req = { 
            body : {
                post_id : PostMockId,
                parent_id : -1,
                author_id : 1,
                description : "",
                votes : 1
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Description entry too long/empty" });
    });

    test("SHOULD NOT CREATE A COMMENT WITH INVALID VOTES", async () => {

        req = { 
            body : {
                post_id : PostMockId,
                parent_id : -1,
                author_id : 1,
                description : "mock Comment for testing module",
                votes : -1
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.post(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Invalid votes" });
    });

    test("SHOULD UPDATE A COMMENT WITH CORRECT DESCRIPTION", async () => {

        req = { 
            body : {
                id : CommentMockId,
                description : "this description will update the old comment's description",
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.put(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"ok", message:"Comment updated in db" });
    });

    test("SHOULD UPDATE A COMMENT WITH CORRECT VOTES", async () => {

        req = { 
            body : {
                id : CommentMockId,
                votes : 100
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.put(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"ok", message:"Comment updated in db" });
    });

    test("SHOULD NOT UPDATE A COMMENT WITH INVALID DESCRIPTION", async () => {

        req = { 
            body : {
                id : CommentMockId,
                description : ""
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.put(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Description entry too long/empty" });
    });

    test("SHOULD NOT UPDATE A COMMENT WITH INVALID VOTES", async () => {

        req = { 
            body : {
                id : CommentMockId,
                votes : 0
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.put(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Invalid votes" });
    });

    test("SHOULD DELETE A COMMENT WITH EXISTING ID", async () => {

        req = { 
            query : {
                id : CommentMockId,
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"ok", message:"Comment deleted successfully" });
    });

    test("SHOULD NOT DELETE A COMMENT WITH UNEXISTING ID", async () => {

        req = { 
            query : {
                id : 99999,
            }};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };

        await CommentController.delete(req, res);
        expect(res.json).toHaveBeenCalledWith({ status :"err", message:"Comment with the given id doesn't exist" });
    });


    test("SHOULD DELETE POST WITH EXISTING ID", async () => {

        req = { query: { id: PostMockId } };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
        };
        await PostController.delete(req, res);

        expect(res.json).toHaveBeenCalledWith({ status : "ok", message :"post deleted successfully" });
    });

});
