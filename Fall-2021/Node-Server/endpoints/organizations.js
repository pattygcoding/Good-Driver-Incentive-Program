module.exports = function(app, connection){
    app.post('/update-org', (req, res) => {
      session = req.session;
      const userid = req.body.uID === '-1' ? session.userid : req.body.uID;
          const update_query = `UPDATE new_schema.SPONSOR_ORG o INNER JOIN new_schema.USER_SPONSOR_REL r ON r.uID=${userid} AND o.sponsorID = r.sponsorID SET orgName = '${req.body.name}', pointsPerDollar = '${req.body.ppd}', street = '${req.body.street}', city = '${req.body.city}', zip = '${req.body.zip}', state = '${req.body.state}';`;
          connection.query(update_query, function(err, result) {
              if(err){
                  console.log(err);
              }
              else{
                  res.send({success: true})
              }
          })
  });

  app.post('/add-org', (req, res) => {
    session=req.session;
    const userid = req.body.uID == '-1' ? session.userid : req.body.uID
    const orgs_query = `insert into new_schema.SPONSOR_ORG values (NULL, '${req.body.name}', '${req.body.email}', '${req.body.street}', '${req.body.city}', '${req.body.state}', ${req.body.zip}, ${req.body.ppd});`;
    connection.query(orgs_query, function(err, result) {
      if(err){
        console.log(err);
      }else{
        res.send({success: true})
      }
    })
});

  app.post('/update-sponsororg', (req, res) => {
        const update_query = `UPDATE new_schema.SPONSOR_ORG SET orgName = '${req.body.name}', pointsPerDollar = '${req.body.ppd}', street = '${req.body.street}', city = '${req.body.city}', zip = '${req.body.zip}', state = '${req.body.state}' where sponsorID=${req.body.sponsorID};`;
        connection.query(update_query, function(err, result) {
            if(err){
                console.log(err);
            }
            else{
                res.send({success: true})
            }
        })
});

  app.post('/update-ppd', (req, res) => {
    session = req.session;
    const userid = req.body.uID === '-1' ? session.userid : req.body.uID;
        const update_query = `UPDATE new_schema.SPONSOR_ORG o INNER JOIN new_schema.USER_SPONSOR_REL r ON r.uID=${userid} AND o.sponsorID = r.sponsorID SET pointsPerDollar = '${req.body.ppd}';`;
        connection.query(update_query, function(err, result) {
            if(err){
                console.log(err);
            }
            else{
                res.send({success: true})
            }
        })
  });

    app.get('/getOrganizations', (req, res) => {
      session=req.session;
      const userid = req.query.uID === '-1' ? session.userid : req.query.uID
      const orgs_query = `SELECT o.sponsorID, orgName, o.pointsPerDollar, o.street, o.city, o.state, o.zip, a.code from ((new_schema.SPONSOR_ORG o INNER JOIN new_schema.USER_SPONSOR_REL r ON o.sponsorID = r.sponsorID) INNER JOIN new_schema.ACCOUNT_CODE a ON o.sponsorID = a.sponsorID) where r.uID=${userid};`;
      connection.query(orgs_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          return res.json({
            orgs: result
          })
        }
      })
    });

    app.get('/getSponsorOrganization', (req, res) => {
      const orgs_query = `SELECT sponsorID, orgName, pointsPerDollar, street, city, state, zip from new_schema.SPONSOR_ORG where sponsorID = ${req.query.sponsorID};`;
      connection.query(orgs_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          return res.json({
            orgs: result
          })
        }
      })
    });

    app.get('/getAllOrganizations', (req, res) => {
      const orgs_query = `SELECT sponsorID, orgName, pointsPerDollar from new_schema.SPONSOR_ORG;`;
      connection.query(orgs_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
            //console.log(result)
          return res.json({
            orgs: result
          })
        }
      })
    });

    app.post('/addOrgRelation', (req, res) => {
        session=req.session;
        const userid = req.body.uID == '-1' ? session.userid : req.body.uID
        const orgs_query = `insert into new_schema.USER_SPONSOR_REL values (NULL, ${userid}, ${req.body.sponsorID});`;
        connection.query(orgs_query, function(err, result) {
          if(err){
            console.log(err);
          }else{
            res.send({success: true})
          }
        })
    });

    app.post('/addOrgApplication', (req, res) => {
      session=req.session;
      const userid = session.userid
      const today = new Date();
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const application_query = `insert into new_schema.APPLICATION values (NULL, ${userid}, ${req.body.sponsorID}, 0, '${date}');`;
      connection.query(application_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          res.send({success: true})
        }
      })
    });

    app.get('/getApplications', (req, res) => {
      const apps_query = `SELECT u.fname, u.lname, u.uID, a.applicationsID, a.status, a.date from new_schema.APPLICATION a INNER JOIN new_schema.USER u where a.uID=u.uID AND a.sponsorID = ${req.query.sponsorID};`;
      connection.query(apps_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          return res.json({
            applications: result
          })
        }
      })
    });

    app.get('/getDriverApplications', (req, res) => {
      session = req.session
      const apps_query = `SELECT s.sponsorID, s.orgName, a.applicationsID, a.date from new_schema.APPLICATION a INNER JOIN new_schema.SPONSOR_ORG s where a.sponsorID=s.sponsorID AND a.uID = ${session.userid} AND a.status = 0;`;
      connection.query(apps_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          return res.json({
            applications: result
          })
        }
      })
    });

    app.post('/removeApplication', (req, res) => {
      const delete_query = `DELETE from new_schema.APPLICATION where applicationsID=${req.body.appID};`;
      connection.query(delete_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          res.send({success: true})
        }
      })
    });

    app.post('/updateApplicationStatus', (req, res) => {
          const update_query = `UPDATE new_schema.APPLICATION SET status = ${req.body.status} where applicationsID=${req.body.appID};`;
          connection.query(update_query, function(err, result) {
              if(err){
                  console.log(err);
              }
              else{
                if(req.body.status === 1){
                  const rel_query = `insert into new_schema.USER_SPONSOR_REL values (NULL, ${req.body.uID}, ${req.body.sponsorID});`;
                  connection.query(rel_query, function(err, result) {
                    if(err){
                      console.log(err);
                    }else{
                      res.send({success: true})
                    }
                  })
                }
              }
          })
    });

      app.post('/removeOrgRelation', (req, res) => {
        session=req.session;
        const userid = req.body.uID == '-1' ? session.userid : req.body.uID
        const delete_query = `DELETE from new_schema.USER_SPONSOR_REL where uID = ${userid} AND sponsorID=${req.body.sponsorID};`;
        connection.query(delete_query, function(err, result) {
          if(err){
            console.log(err);
          }else{
            res.send({success: true})
          }
        })
    });
}