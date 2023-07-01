var express = require('express');
var router = express.Router();
const mailController = require('../controllers/mailController');

router.get('/mails', mailController.getMails)

router.get('/sendMail', mailController.sendMails)

router.post('/sendMail', mailController.postSendMails);


module.exports = router;
