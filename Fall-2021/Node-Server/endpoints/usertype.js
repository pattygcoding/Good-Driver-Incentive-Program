module.exports = function(app, connection){
    app.get('/isAdmin', (req, res) => {
        session=req.session;
        if(session.userid){
            const user_query = `SELECT userType from new_schema.USER where uID = ${session.userid};`;
            connection.query(user_query, function(err, result) {
                if(err) console.log(err);
                console.log(result);
                if (result[0].userType === 2){
                    return res.json({
                        is_admin: true
                    })
                }else{
                    return res.json({
                        is_admin: false
                    })
                }
            })
        }else{
            return res.json({
                is_admin: false
            })
        }
    });
    app.get('/isSponsor', (req, res) => {
        session=req.session;
        if(session.userid){
            const user_query = `SELECT userType from new_schema.USER where uID = ${session.userid};`;
            connection.query(user_query, function(err, result) {
                if(err) console.log(err);
                console.log(result);
                if (result[0].userType === 1){
                    return res.json({
                        is_sponsor: true
                    })
                }else{
                    return res.json({
                        is_sponsor: false
                    })
                }
            })
        }else{
            return res.json({
                is_sponsor: false
            })
        }
    });
    app.get('/isDriver', (req, res) => {
        session=req.session;
        if(session.userid){
            const user_query = `SELECT userType from new_schema.USER where uID = ${session.userid};`;
            connection.query(user_query, function(err, result) {
                if(err) console.log(err);
                console.log(result);
                if (result[0].userType === 0){
                    return res.json({
                        is_driver: true
                    })
                }else{
                    return res.json({
                        is_driver: false
                    })
                }
            })
        }else{
            return res.json({
                is_driver: false
            })
        }
    });
    app.get('/isLoggedIn', (req, res) => {
        session=req.session;
        if(session.userid){
            return res.json({
                is_loggedin: true
            })
        }else{
            return res.json({
                is_loggedin: false
            })
        }
    });

    app.get('/currentUserType', (req, res) => {
        session=req.session;
        if(session.userid){
            const user_query = `SELECT userType from new_schema.USER where uID = ${session.userid};`;
            connection.query(user_query, function(err, result) {
                if(err) console.log(err);
                console.log(result);
                    return res.json({
                        userType: result[0].userType
                    })
            })
        }else{
            return res.json({
                userType: -1
            })
        }
    });
}