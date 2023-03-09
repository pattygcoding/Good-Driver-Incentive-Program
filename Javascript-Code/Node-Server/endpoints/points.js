module.exports = function(app, connection){
    function getSponsorID(req, callback){
        session = req.session;
        const org_query = `SELECT sponsorID from new_schema.USER_SPONSOR_REL where uID = ${uID};`;
        connection.query(org_query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success: false})
            }else{
                callback(result[0].sponsorID);
            }
        })
    }

    function addAdjustment(req, driverID, sponsorID) {
        const driver_point_query = `SELECT DPointID from new_schema.DRIVER_POINTS where uID = ${driverID} AND sponsorID=${sponsorID};`;
        connection.query(driver_point_query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success: false})
            }
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            const value = req.body.add ? req.body.value : req.body.value * -1
            const adjust_query = `insert into new_schema.POINT_ADJUSTMENT values (NULL, "${req.body.comment}", ${value}, "${date}", ${result[0].DPointID}, ${sponsorID});`;
            connection.query(adjust_query, function(err, result) {
                if(err) {
                    console.log(err);
                    res.send({success: false})
                }
            })
        })
    }

    app.post('/point-assignment', (req, res) => {
        console.log('Recieved point assignment');
        console.log(req.body);
        session=req.session;
        const org_query = `SELECT sponsorID from new_schema.USER_SPONSOR_REL where uID = ${session.userid};`;
        connection.query(org_query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success: false})
            }else{
                const sponsorID = req.body.sponsor === -1 ?  result[0].sponsorID : req.body.sponsor;
                const driverID = req.body.driver === -1 ?  session.userid : req.body.driver;
                const exists_query = `SELECT EXISTS (SELECT * from new_schema.DRIVER_POINTS where uID = ${driverID} AND sponsorID=${sponsorID}) as 'is_exist';`;
                connection.query(exists_query, function(err, result) {
                    if(err) {
                        console.log(err);
                        res.send({success: false})
                    }
                    console.log(result[0].is_exist);
        
                    if(result[0].is_exist===0){
                        const value = req.body.add ? req.body.value : req.body.value * -1;
                        const points_query = `insert into new_schema.DRIVER_POINTS values (NULL, ${driverID}, ${value}, ${sponsorID});`;
                        connection.query(points_query, function(err, result) {
                            if(err) {
                                console.log(err);
                                console.log("YO")
                                res.send({success: false})
                            }else{
                                addAdjustment(req, sponsorID)
                            }
                        })
                    }else{
                        const driver_point_query = `SELECT * from new_schema.DRIVER_POINTS where uID = ${driverID} AND sponsorID=${sponsorID};`;
                        connection.query(driver_point_query, function(err, result) {
                            const newPoints = req.body.add ? (parseInt(result[0].totalPoints) + parseInt(req.body.value)) : (parseInt(result[0].totalPoints) - parseInt(req.body.value));
                            const points_query = `update new_schema.DRIVER_POINTS set totalPoints = ${newPoints} where uID = ${driverID} AND sponsorID=${sponsorID};`;
                            connection.query(points_query, function(err, result) {
                                if(err) {
                                    console.log(err);
                                    res.send({success: false})
                                }else{
                                    addAdjustment(req, driverID, sponsorID)
                                }
                            })
                        })
                    }
                })
            }
        })
        res.send({success: true})
    });

    app.get('/get-points', (req, res) => {
        session=req.session;
        const driver = req.query.driver === '-1' ? session.userid : req.query.driver;
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
                    const adjustments_query = `SELECT * from new_schema.POINT_ADJUSTMENT where DPointID = ${r.DPointID};`;
                    connection.query(adjustments_query, function(err, result2) {
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