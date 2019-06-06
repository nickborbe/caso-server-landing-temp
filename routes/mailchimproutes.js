const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const creds = require('../config/config');

let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: creds.USER,
        pass: creds.PASS
    }
});


transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
    }
  });


router.get('/test/', (req, res, next) => {

    // make api call to mailchimp
    //use node-mailchimp-v3 npm package

    res.status(200).json({ message: 'This exists' });
});


router.post('/contact-us', (req, res, next) => {

    let name = req.body.name
    let email = req.body.email
    let contactWhoEmail = req.body.contactWhoEmail
    let message = req.body.message
    let subject = ""


    let RECIPIENT;
    if (contactWhoEmail === "fanMail") {
        RECIPIENT = 'whateverEmailIs@gmail.com'
        subject = `Contact Us Message From - ${email} - FanMail`
    }
    if (contactWhoEmail === "questionAnswer") {
        RECIPIENT = 'whateverEmailIs@gmail.com'
        subject = `Contact Us Message From - ${email} - Question/Answer`
    }
    if (contactWhoEmail === "contest") {
        RECIPIENT = 'whateverEmailIs@gmail.com'
        subject = `Contact Us Message From - ${email} - Contest`
    }

    let mail = {
        from: name,
        to: RECIPIENT,  
        subject: subject,
        text: message
      }

      transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({
            msg: 'fail'
          })
        } else {
          res.json({
            msg: 'success'
          })
        }
      })


});



module.exports = router;


