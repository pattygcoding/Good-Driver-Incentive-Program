module.exports = function( app, connection ) {
    app.post('/resetpass-attempt', (req, res) => {

        console.log('Received signup attempt');
        console.log(req.body);
        // get input
        let code = req.body.code;
        let newPass = req.body.newPass;
        let newPassConf = req.body.newPassConf;

        if(code && newPass && newPassConf){
            if(newPass == newPassConf){
                qstr = "SELECT * FROM new_schema.RESET_CODE WHERE code = '"+code+"' AND time >= NOW() - INTERVAL 1 DAY";
                //check that code matches and is in range, then change password
                connection.query(qstr, function(err, result, fields) {
                    if(err) console.log(err);
                    if(result){
                        console.log(result);
                        codeConf = json[0].code;
                        string = JSON.stringify(result);
                        json = JSON.parse(string);
                    }else{
                        console.log('code does not match');
                        codeConf = -1;
                    }
                    if(codeConf != code){
                        res.send({success: false, msg: "Code is either incorrect or expired"});
                        console.log('code invalid');
                        res.end()
                    }else{
                        //update password
                        encryptPass = crypt.getHash(newPass);
                        //console.log('Got sign up information.');
                        console.log('updating user');
                        qstr = "UPDATE new_schema.USER SET password = '"+encryptPass+"' WHERE email = '"+json[0].email+"'";
                        connection.query(qstr, function(err, result, fields) {
                          if(err) console.log(err);
                          console.log(result);
                          //res.redirect('/DriverHome');
                        });

                        //TODO query to get uId from email
                        id = "-1"
                        qstr = "SELECT * FROM new_schema.USER WHERE email = '"+json[0].email+"'";;
                        connection.query(qstr, function(err, result, fields) {
                          if(err) console.log(err);
                          console.log(result);
                          //res.redirect('/DriverHome');
                          //id = result[0].uId;
                          string = JSON.stringify(result);
                          json = JSON.parse(string);
                          id = json[0].uID;

                          
                            console.log('inserting into password_changes');
                            qstr = "INSERT INTO new_schema.PASSWORD_CHANGES (uId, changeType) VALUES ('"+id+"', 'RESET')";
                            connection.query(qstr, function(err, result, fields) {
                                if(err) console.log(err);
                                console.log(result);
                                //res.redirect('/DriverHome');
                                res.send({success: true, msg: "Password Updated"});
                            });
                        });

                        

                    }
                });

            }else{
                res.send({success: false, msg: "Passwords do not match"});
                console.log('passwords do not match');
                res.end()
            }
        }else{
            res.send({success: false, msg: "Please fill out all fields"});
            console.log('no sign up info.');
            res.end()
        }

    });
}