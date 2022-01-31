const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');
const handlebars = require('handlebars');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth:{
        user: emailConfig.user,
        pass: emailConfig.pass
    }
})

// use handlebars templates
transport.use(
  'compile',
  hbs({
    viewEngine: {
      extName: 'handlebars',
      partialsDir: __dirname + '/../views/emails',
      layoutsDir: __dirname + '/../views/emails',
      defaultLayout: 'reset.handlebars'
    },
    viewPath: __dirname + '/../views/emails',
    extName: '.handlebars'
  })
);

exports.send = async(options)=>{
    const optionsEmail = {
        from :'devJobs <noreply@devjobs.com',
        to: options.user.email,
        subject: options.subject,
        template: options.file,
        context: {
            resetUrl: options.resetUrl
        }
    }

    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, optionsEmail)
}