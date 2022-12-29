const nodemailer = require("nodemailer");

module.exports = function( app, connection ) {
    app.post('/resetemail-attempt', (req, res) => {
        console.log("Received email for password reset.");
        console.log(req.body);

        let email = req.body.email;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'madlads4910@gmail.com',
                pass: '4910madlads!'
            }
        })

        if(email){
            qstr = "SELECT COUNT (*) AS count FROM new_schema.USER WHERE email = '"+email+"'";
            connection.query(qstr, function(err, result, fields) {
                if(err) console.log(err);
                console.log(result);



                //generate random 6 digit code to send to user
                code = 123456;
                min = Math.ceil(1000000);
                max = Math.floor(100000);
                code = Math.floor(Math.random() * (max-min) + min);

                //enter password reset code into database
                qstr = "INSERT INTO new_schema.RESET_CODE (code, email) VALUES ('"+code+"', '"+email+"')";
                connection.query(qstr, function(err, result, fields) {
                    if(err) console.log(err);
                    console.log(result);
                });

                //define email
                msgText = "Your reset code is: " + code + ".  This code will expire in 24 hours";
                const mailOptions = {
                    from: 'madlads4910@gmail.com',
                    to: email,
                    subject: 'Reset Password',
                    text: msgText
                }

                //send email
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Email sent: ' + info.response)
                    }
                    
                });



                res.send({success: true, msg: "Email has been sent with reset instructions"});
              });
        }else{
            res.send({success: false, msg: "Please input an email"});
            console.log("empty email");
            res.end()
        }





    });
}