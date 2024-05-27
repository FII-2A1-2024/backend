const reportPost = require("../services/reportService");

async function report(req, res) {
    try{
	if (!req.body.post_id||!req.body.reason) {
        
    const message = "post_id or reason is missing";
        return res.status(400).json(message);
    } 
    
    const message = await reportPost(req.user,req.body.post_id,req.body.reason);
    res.status(200).json(message);
   
}
catch(error){
res.status(500).send("Error at reporting post "+ error);
}
}

module.exports = report;
