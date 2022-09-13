class Chat {
    handle (req, res){
        console.log('Create Game Controller');
        res.json({msg: "Create Game"});
    }
}

module.exports = Chat;