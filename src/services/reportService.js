const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function reportPost(reporter, post_id, reason) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                emailPrimary: reporter.user,
            },
        });
        const id_reporter=user.uid;

        let message = "";
        const post = await prisma.posts.findUnique({
            where: {
                id: post_id
            },
        });
        //console.log('postare '+JSON.stringify(post));
        
        if (!post) {
            message = "post with id ${post_id}doesnt exist";
            return message;
        }

        await prisma.postReports.create({
            data: {
                post_id: post_id,
                reason: reason,
                id_reporter: id_reporter,
                id_post_owner: post.author_id
            }
        });

        message = "Report created successfully";
        
        return message;

    }
    catch (error) {
        console.error("Error at reporting post", error);
        throw error;
    }

}

module.exports = reportPost;