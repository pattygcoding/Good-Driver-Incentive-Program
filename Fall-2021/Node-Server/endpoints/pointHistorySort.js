module.exports = function(app, connection){

    app.get('/get-points-sorts', (req, res) => {
        session=req.session;
        const driver =  session.userid;
        console.log("DRIVERQ: " + req.query.driver)
        console.log("DRIVER: " + driver)
        const total_query = `SELECT DPointID, totalPoints, sponsorID from new_schema.DRIVER_POINTS where uID = ${driver};`;
        connection.query(total_query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success: false})
            }else{
                var ret = result;
                result.map((r,i) => {
                    let showPoints = `SELECT * from new_schema.POINT_ADJUSTMENT where DPointID = ${r.DPointID};`;
                    if (req.query.userChoice === 'today') {
                        showPoints = `SELECT * from new_schema.POINT_ADJUSTMENT where DPointID = ${r.DPointID} AND  date >= now() -interval 1 day;`;
                    }
                    else if (req.query.userChoice === 'sevenDays') {
                         showPoints = `SELECT * from new_schema.POINT_ADJUSTMENT where DPointID = ${r.DPointID} AND date >= now() -interval 7 day;`;
                    }
                    else if (req.query.userChoice === 'thirtyDays') {
                         showPoints =  `SELECT * from new_schema.POINT_ADJUSTMENT where DPointID = ${r.DPointID} AND date >= now() -interval 30 day;`;
                    }
                    else {
                         showPoints = `SELECT * from new_schema.POINT_ADJUSTMENT where DPointID = ${r.DPointID};`;
                    }
                    console.log(showPoints)
                    connection.query(showPoints, function(err, result2) {
                        if(err) {
                            console.log(err);
                            res.send({success: false})
                        }else{
                            ret[i].adjustments = result2
                            console.log(ret)
                            if(i===ret.length-1){
                                return res.json({
                                    Points: ret
                                })
                            }
                        }
                    })
                })
            }
        })
    });
}