var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'divyang.soni@sjsu.edu',
        pass: 'Sjsu@1992'
    }
});

var mailOptions = {
    from: 'divyang.soni@sjsu.edu',
    to: 'divyang8842@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});