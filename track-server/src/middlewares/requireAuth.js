const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Student = mongoose.model('Student');

module.exports = (req,res,next) => {
    const {authorization} = req.headers;
    // authorization === 'Bearer Lajsskakksas'

    if(!authorization) {
        return res.status(401).send({error:'You must be logged in.1'});
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_SECRET_KEY', async (err,payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.2'});
        }
        const { userId } = payload;
        const user = await Student.findById(userId);
        req.user = user;
        console.log("done1");
        next();
    })
};