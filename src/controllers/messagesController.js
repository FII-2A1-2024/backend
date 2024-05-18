const messagesServices = require("./../services/messagesServices");

class messagesController {
    static async post(req, res) {
        const { sender_id, receiver_id, content } = req.body;

        try {
            let  message = await messagesServices.post(sender_id, receiver_id, content);
            res.status(200).json({ "status": "ok", message });
        } catch (error) {
            res.status(500).json({ "status": "err", "message": error.message });
        }
    }
}

module.exports = messagesController;
