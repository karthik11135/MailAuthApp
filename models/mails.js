const mongoose = require("mongoose");
const { Schema } = mongoose;

const mailSubSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    message: {
        type: String,
        required : true,
    },
    color: {
        type: String,
    },
})

const mailSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    mailsReceived: {
        type : [mailSubSchema],
        required: true,
    }
})

const mailModel = mongoose.model('mails', mailSchema);
const mailSubModel = mongoose.model('mailsSub', mailSubSchema);


module.exports = {mailModel, mailSubModel}