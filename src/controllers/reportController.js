const reportPost = require("../services/reportService");

async function report(req, res) {
    try{
	if (!req.body.post_id||!req.body.reason) {
        return res.status(400).send("post_id or reason is missing");
    } 
    
    const message = await reportPost(req.user,req.body.post_id,req.body.reason);
    res.status(200).json(message);
   
}
catch(error){
res.status(500).send("Error at reporting post "+ error);
}
}

module.exports = report;
