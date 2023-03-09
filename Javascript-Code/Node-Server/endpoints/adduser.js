module.exports = function( app, connection ) {
    const nodemailer = require('nodemailer')
    app.post('/add-user', (req, res) => {
        let userType = req.body.userType;
        let username = req.body.username;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let phone = req.body.phone;
        let password = randomPassword()
        console.log(password)

        //check to make sure that username and email are not repeats of other accounts
        qstr = "SELECT COUNT (*) AS count FROM new_schema.USER WHERE username = '"+username+"' OR email = '"+email+"'";
        connection.query(qstr, function(err, result, fields) {
            if(err) console.log(err);
            console.log(result);
            
            string = JSON.stringify(result);
            json = JSON.parse(string);
            count = json[0].count;
    
            if(count > 0){
                res.send({success: false, msg: "Username or email belongs to another account"});
                console.log('repeat user');
                res.end()
            }else{
    
            encryptPass = crypt.getHash(password);
            //console.log('Got sign up information.');
            qstr = "INSERT INTO new_schema.USER (lname, fname, username, password, email, phone, usertype, status) VALUES ('"+lastname+"', '"+firstname+"', '"+username+"', '"+encryptPass+"', '"+email+"', '"+phone+"', '"+userType+"', 1)";
            connection.query(qstr, function(err, result, fields) {
                if(err) console.log(err);
                console.log(result);
                //res.redirect('/DriverHome');
                if(req.body.userType !== 1){
                    res.send({success: true, msg: "Creating Account..."});
                }
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'madlads4910@gmail.com',
                        pass: '4910madlads!'
                    }
                })
                msgText = `A new account has been created for you with team 4 driver rewards app!\nVisit the Website: http://100.25.86.97/login \nUsername: ${username} \nPassword: ${password}`;
                const mailOptions = {
                    from: 'madlads4910@gmail.com',
                    to: email,
                    subject: 'New Account Created',
                    text: msgText
                }

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Email sent: ' + info.response)
                    }
                    
                });
                if(req.body.userType === 1){
                    qstr = "INSERT INTO new_schema.USER_SPONSOR_REL (uID, sponsorID) VALUES ('"+result.insertId+"', '"+req.body.org+"')";
                    connection.query(qstr, function(err, result, fields) {
                        if(err) console.log(err);
                        res.send({success: true, msg: "Creating Account..."});
                    });
                }
            });
            }
        });
      });

    function randomPassword(){
        var pass = ""
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
        for(i=0; i<=10; i++){
            pass += chars.charAt(Math.floor(Math.random()*chars.length))
        }
        return pass;
    }
}