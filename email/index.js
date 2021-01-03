'use strict';
const email = (function () {
  const {google} = require('googleapis');
  const OAuth2 = google.auth.OAuth2;
  const oAuth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  oAuth2Client.setCredentials({
    refresh_token : process.env.GMAIL_REFRESH_TOKEN // jshint ignore:line
  });
  const accessToken = oAuth2Client.getAccessToken();
  const nodemailer = require('nodemailer'),
    smtpTransport = nodemailer.createTransport({
      service : 'Gmail',
      auth    : {
        type         : 'OAuth2',
        user         : 'flickr.downloadr.webhook@gmail.com',
        pass         : process.env.FD_WEBHOOK_EMAIL_PASSWORD,
        clientId     : process.env.GMAIL_CLIENT_ID,
        clientSecret : process.env.GMAIL_CLIENT_SECRET,
        refreshToken : process.env.GMAIL_REFRESH_TOKEN,
        accessToken  : accessToken
      },
      tls     : {
        rejectUnauthorized : false
      }
    }),
    mailOptions = {
      from : 'Flickr-Downloadr Webhook <flickr.downloadr.webhook@gmail.com>',
      to   : 'imbleedingme@googlemail.com'
    },
    sendMail = function () {
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + response.message);
        }
        smtpTransport.close();
      });
    };
  return {
    sendAlert : function () {
      mailOptions.subject = '[flickr-downloadr] CI Deploy might have failed';
      mailOptions.html = '<h1>Looks like one of the builds has failed to deploy</h1>';
      sendMail();
    },
    sendInfo  : function (branchName) {
      mailOptions.subject = '[flickr-downloadr] CI Deploy succeeded - Get ready to push to the website';
      mailOptions.html = '<h1>Installers from the branch ' + branchName + ' will get merged to `source` branch soon. Please do a grunt deploy soon...</h1>';
      sendMail();
    }
  };
})();

module.exports = email;
