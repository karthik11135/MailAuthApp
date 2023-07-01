const {mailModel, mailSubModel} = require('../models/mails');
const userModel = require('../models/users');

module.exports.getMails = async (req, res, next) => {
    const id = res.locals.user._id;
    const curUser = await mailModel.findById(id);
    let receivedMails;
    if(curUser) {
        receivedMails = curUser.mailsReceived;
        res.render('mails', {mails: receivedMails});
        console.log(curUser);
    }
    else {
        receivedMails = 0;
        res.render('mails', {mails: 0});
    }
}

module.exports.sendMails = (req, res, next) => {
    res.render('sendMail');
}

module.exports.postSendMails = async (req, res, next) => {
    const mailId = req.body.mailId;
    const message = req.body.message;
    const sender = res.locals.user.name;
    const senderColor = res.locals.user.color;
    try{
        const user = await userModel.findOne({email: mailId});
        if(!user) res.status(400).send({user: "user not found"});
        if(user) {
            const subDoc = await mailSubModel.create({name: sender, message, color: senderColor});
            const mailUser = await mailModel.findById(user._id);
            if(!mailUser) {
                const mailUserCreate = await mailModel.create({_id: user._id, mailsReceived: [subDoc]});
                console.log("createdMailuser", mailUserCreate);
            }
            else {
                await mailModel.findOneAndUpdate({ _id: user._id }, { $push : { 'mailsReceived': subDoc } });
            }
        } 
        res.redirect('/');
    } catch(err) {
        next(err);
    }
}