module.exports = function(app, connection){
    app.post('/toggle-active', (req, res) => {
      const active_query = `UPDATE new_schema.USER SET status = ${req.body.active} WHERE uID = ${req.body.uID};`;
      connection.query(active_query, function(err, result) {
        if(err){
            console.log(err);
        }
        else{
            res.send({success: true})
        }
      })
    });

    app.get('/get-acc-info', (req, res) => {
        session = req.session;
        console.log(session.userid)
        userid = req.query.uID === '-1' ? session.userid : req.query.uID;
        const user_query = `SELECT fname, lname, username, email, phone from new_schema.USER where uID = ${userid};`;
        connection.query(user_query, function(err, result) {
            if(err) console.log(err);
            return res.json({
              user: result[0]
            })
        })
      });

    app.post('/update-account', (req, res) => {
        session = req.session;
        userid = req.body.uID === '-1' ? session.userid : req.body.uID;
        if(req.body.newPass === ''){
            const update_query = `UPDATE new_schema.USER SET fname = '${req.body.fname}', lname = '${req.body.lname}', username = '${req.body.username}', email = '${req.body.email}', phone = '${req.body.phone}' WHERE uID = ${userid}`;
            connection.query(update_query, function(err, result) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({success: true, msg: "Information Updated"})
                }
            })
        }else{                

            encryptNewPass = crypt.getHash(req.body.newPass);
            const update_query = `UPDATE new_schema.USER SET password = '${encryptNewPass}', fname = '${req.body.fname}', lname = '${req.body.lname}', username = '${req.body.username}', email = '${req.body.email}', phone = '${req.body.phone}' WHERE uID = ${userid};`;
            connection.query(update_query, function(err, result) {
            if(err){
                console.log(err);
            }else{
                qstr = `INSERT INTO new_schema.PASSWORD_CHANGES (uId, changeType) VALUES ('${userid}', 'UPDATE')`;
                connection.query(qstr, function(err, result, fields) {
                if(err) console.log(err);
                console.log(result);
                //res.redirect('/DriverHome');
                res.send({success: true, msg: "Information Updated"});
             });
        }
    })


        }    

        /*
        const update_query = `UPDATE new_schema.USER SET fname = '${req.body.fname}', lname = '${req.body.lname}', username = '${req.body.username}', email = '${req.body.email}', phone = '${req.body.phone}' WHERE uID = ${userid};`;
        connection.query(update_query, function(err, result) {
            if(err){
                console.log(err);
            }
            else{
                res.send({success: true})
            }
        })
        */
    });
}