module.exports = function( app, connection ) {
      app.get('/driverview', (req, res) => {
        session = req.session
        const userid = session.userid
        session.userid = req.query.userid
        session.driverview = userid
        res.send({success: true});
      });

      app.get('/sponsorview', (req, res) => {
        session = req.session
        const userid = session.userid
        session.userid = req.query.userid
        session.sponsorview = userid
        res.send({success: true});
      });

      app.get('/leavedriverview', (req, res) => {
        session = req.session
        const userid = session.driverview
        session.userid = userid
        session.driverview = undefined
        res.send({success: true});
      });

      app.get('/leavesponsorview', (req, res) => {
        session = req.session
        const userid = session.sponsorview
        session.userid = userid
        session.sponsorview = undefined
        res.send({success: true});
      });

      app.get('/isdriverview', (req, res) => {
        session = req.session
        if(session.driverview){
            return res.json({
                is_driverview: true
            })
        }else{
            return res.json({
                is_driverview: false
            })
        }
      });

      app.get('/issponsorview', (req, res) => {
        session = req.session
        if(session.sponsorview){
            return res.json({
                is_sponsorview: true
            })
        }else{
            return res.json({
                is_sponsorview: false
            })
        }
      });

      app.get('/driverviewuser', (req, res) => {
        session = req.session
        const user_query = `SELECT userType from new_schema.USER where uID = ${session.driverview};`;
            connection.query(user_query, function(err, result) {
                if(err) console.log(err);
                    return res.json({
                        userType: result[0].userType
                    })
            })
      });

      app.get('/sponsorviewuser', (req, res) => {
        session = req.session
        const user_query = `SELECT userType from new_schema.USER where uID = ${session.sponsorview};`;
            connection.query(user_query, function(err, result) {
                if(err) console.log(err);
                    return res.json({
                        userType: result[0].userType
                    })
            })
      });
}