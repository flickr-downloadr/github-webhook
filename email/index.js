'use strict';
exports.send = function () {
  var nodemailer = require('nodemailer');
  console.log('Email password is: %s', process.env.FD_WEBHOOK_EMAIL_PASSWORD);
  var smtpTransport = nodemailer.createTransport('SMTP', {
    service : 'Gmail',
    auth    : {
      user : 'flickr.downloadr.webhook@gmail.com',
      pass : process.env.FD_WEBHOOK_EMAIL_PASSWORD
    }
  });

  var mailOptions = {
    from    : 'Flickr-Downloadr Webhook <flickr.downloadr.webhook@gmail.com>',
    to      : 'imbleedingme@googlemail.com',
    subject : '[flickr-downloadr] CI Deploy might have failed',
    html    : '<h1>Looks like one of the builds has failed to deploy</h1>'
  };

  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + response.message);
    }
    smtpTransport.close();
  });

};
