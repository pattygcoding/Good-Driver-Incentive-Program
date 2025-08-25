module.exports = function( app, connection ) {


    app.post('/neworganization-attempt', (req, res) => {
        console.log('Recieved organization creation attempt');
        console.log(req.body);
        // get input
        let orgName = req.body.orgName;
        let email = req.body.email;
        let street = req.body.street;
        let city = req.body.city;
        let state = req.body.state;
        let zip = req.body.zip;
        session=req.session;

        //make sure username & password exist
        if( orgName && email && street && city && state && zip ) {      
      
          
          qstr = `INSERT INTO new_schema.SPONSOR_ORG (orgName, email, street, city, state, zip, pointsPerDollar) VALUES ('${orgName}', '${email}', '${street}', '${city}', '${state}', '${zip}', 100)`;
          //poll db
          connection.query(qstr, function(err, result, fields) {
            if(err) console.log(err);
            console.log(result);
          });
         
          //need sponsorID from the new entry to make ACCOUNT_CODE entry
          qstr = `SELECT * FROM new_schema.SPONSOR_ORG WHERE email = '${email}'`;
          connection.query(qstr, function(err, result, fields) {
            if(err) console.log(err);
            console.log(result);
            sID = result[0].sponsorID;
            qstr = `INSERT INTO new_schema.ACCOUNT_CODE (sponsorID) VALUES (${sID})`;
            connection.query(qstr, function(err, result, fields) {
              if(err) console.log(err);
              console.log(result);

              rel_query = `INSERT INTO new_schema.USER_SPONSOR_REL (uID, sponsorID) VALUES (${session.userid}, ${sID})`;
              connection.query(rel_query, function(err, result, fields) {
                if(err) console.log(err);
                console.log(result);
                res.send({success: true, msg: 'Organization created successfully.', redirect: true});
                res.end();
              });


            });

          });

        }else {
          res.send({success: false, msg: "Please fill out all fields."});
          res.end();
        }
      
      });
      
      app.get('/logout', (req, res) => {
        req.session.destroy();
        res.send({success: true});
      });
}