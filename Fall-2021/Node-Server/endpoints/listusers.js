module.exports = function(app, connection){
    function getDrivers(sponsorID, res) {
      // const driver_query = `SELECT uID, fname, lname from new_schema.USER where userType = 0 AND sponsorID=${sponsorID};`;
      // connection.query(driver_query, function(err, result) {
      //   if(err) console.log(err);
      //   return res.json({
      //     drivers: result
      //   })
      // })

      // const user_query = `SELECT uID from new_schema.USER_SPONSOR_REL where sponsorID=${sponsorID};`;
      // connection.query(user_query, function(err, result) {
      //   if(err){
      //     console.log(err);
      //   }else{
      //     console.log(result)
      //     result.map(user => {
      //       const driver_query = `SELECT fname, lname from new_schema.USER where userType = 0 AND uID=${user.uID};`;
      //       connection.query(driver_query, function(err, result) {
      //         if(err) console.log(err);
      //         return res.json({
      //           drivers: result
      //         })
      //       })
      //     });
      //   }
      //   return res.json({
      //     drivers: result
      //   })
      // })

      const driver_query = `SELECT u.uID, fname, lname, status from new_schema.USER u INNER JOIN new_schema.USER_SPONSOR_REL r ON u.uID = r.uID where u.userType = 0 AND r.sponsorID=${sponsorID};`;
      connection.query(driver_query, function(err, result) {
        if(err) console.log(err);
        return res.json({
          drivers: result
        })
      })
    }
    app.get('/getAllDrivers', (req, res) => {
      const driver_query = "SELECT uID, fname, lname, status from new_schema.USER where userType = 0;";
      connection.query(driver_query, function(err, result) {
        if(err) console.log(err);
        return res.json({
          drivers: result
        })
      })
    });

    app.get('/getAllSponsors', (req, res) => {
      const sponsor_query = "SELECT u.uID, fname, lname, status, orgName from new_schema.USER u INNER JOIN new_schema.USER_SPONSOR_REL r INNER JOIN new_schema.SPONSOR_ORG o where userType = 1 AND r.uID=u.UID AND o.sponsorID = r.sponsorID;";
      connection.query(sponsor_query, function(err, result) {
        if(err) console.log(err);
        return res.json({
          sponsors: result
        })
      })
    });

    app.get('/getAllAdmin', (req, res) => {
      const admin_query = "SELECT uID, fname, lname, status from new_schema.USER where userType = 2;";
      connection.query(admin_query, function(err, result) {
        if(err) console.log(err);
        return res.json({
          admin: result
        })
      })
    });

    app.get('/getSponsorDrivers', (req, res) => {
      session=req.session;
      const org_query = `SELECT sponsorID from new_schema.USER_SPONSOR_REL where uID=${session.userid};`;
      connection.query(org_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          return getDrivers(result[0].sponsorID, res)
        }
      })
    });

    app.get('/getOrgSponsors', (req, res) => {
      const sponsor_query = `SELECT u.uID, fname, lname, status from new_schema.USER u INNER JOIN new_schema.USER_SPONSOR_REL r where userType = 1 AND r.uID=u.UID AND r.sponsorID=${req.query.org};`;
      connection.query(sponsor_query, function(err, result) {
        if(err){
          console.log(err);
        }else{
          return res.json({
            sponsors: result
          })
        }
      })
    });
}