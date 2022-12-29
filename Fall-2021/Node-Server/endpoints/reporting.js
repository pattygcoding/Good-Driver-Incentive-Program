module.exports = function(app, connection){
    
    // ADMIN REPORTS

    // AUDIT LOG REPORTS --------------------------------------------

    app.post('/getLoginAttempts', (req, res) => {

        console.log('Recieved Request for Audit Log Report')
        console.log(req.body)

        //Get login attempts info
        var query = "select la.date, la.username, la.success from LOGIN_ATTEMPTS as la"
        if( req.body.startDate != '' & req.body.orgName === '') {
            query = `select log.date, log.username, log.success from (
                select la.date, la.username, la.success, la.uID, u2s.sponsorID, sp.orgName
                    from LOGIN_ATTEMPTS as la, USER_SPONSOR_REL as u2s, SPONSOR_ORG as sp
                    where la.uID = u2s.uID and u2s.sponsorID = sp.sponsorID
                ) as log
                    where log.date between '`+ req.body.startDate +`' and '`+ req.body.endDate +`';`
        }
        else if( req.body.startDate === '' & req.body.orgName != '' ) {
            query = `select log.date, log.username, log.success from (
                select la.date, la.username, la.success, la.uID, u2s.sponsorID, sp.orgName
                    from LOGIN_ATTEMPTS as la, USER_SPONSOR_REL as u2s, SPONSOR_ORG as sp
                    where la.uID = u2s.uID and u2s.sponsorID = sp.sponsorID
                ) as log
                    where log.orgName = '`+ req.body.orgName +`';`
        }
        else if(req.body.startDate != '' & req.body.orgName != '') {
            query = `select log.date, log.username, log.success from (
                select la.date, la.username, la.success, la.uID, u2s.sponsorID, sp.orgName
                    from LOGIN_ATTEMPTS as la, USER_SPONSOR_REL as u2s, SPONSOR_ORG as sp
                    where la.uID = u2s.uID and u2s.sponsorID = sp.sponsorID
                ) as log
                    where log.date between '`+ req.body.startDate +`' and '`+ req.body.endDate +`' and log.orgName = '`+ req.body.orgName +`';`
        }
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {

                res.send(result);

            }
        });

    });


    app.post('/getPasswordChanges', (req, res) => {

        console.log('Recieved Request for Audit Log Report')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        //Get password change info
        query = "select pw.date, usr.username, pw.changeType from PASSWORD_CHANGES as pw, USER as usr where pw.uID = usr.uID;"
        if( req.body.startDate != '' & req.body.orgName === '') {
            query = `select pwl.date, pwl.username, pwl.changeType from (
                select pw.date, usr.username, pw.changeType, sp.orgName
                    from PASSWORD_CHANGES as pw, USER as usr, USER_SPONSOR_REL as u2s, SPONSOR_ORG as sp
                    where pw.uID = usr.uID and u2s.uID = usr.uID and u2s.sponsorID = sp.sponsorID
            ) as pwl
                where pwl.date between '`+formattedStartDate+`' and '`+formattedEndDate+`';`;
        }
        else if( req.body.startDate === '' & req.body.orgName != '' ) {
            query = `select pwl.date, pwl.username, pwl.changeType from (
                select pw.date, usr.username, pw.changeType, sp.orgName
                    from PASSWORD_CHANGES as pw, USER as usr, USER_SPONSOR_REL as u2s, SPONSOR_ORG as sp
                    where pw.uID = usr.uID and u2s.uID = usr.uID and u2s.sponsorID = sp.sponsorID
            ) as pwl
                where pwl.orgName = '`+req.body.orgName+`';`;
        }
        else if(req.body.startDate != '' & req.body.orgName != '') {
            query =  `select pwl.date, pwl.username, pwl.changeType from (
                select pw.date, usr.username, pw.changeType, sp.orgName
                    from PASSWORD_CHANGES as pw, USER as usr, USER_SPONSOR_REL as u2s, SPONSOR_ORG as sp
                    where pw.uID = usr.uID and u2s.uID = usr.uID and u2s.sponsorID = sp.sponsorID
            ) as pwl
                where pwl.date between '`+formattedStartDate+`' and '`+formattedEndDate+`' and pwl.orgName = '`+req.body.orgName+`';`;
        }
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {

                res.send(result);

            }
        });

    });

    app.post('/getPointAdjustments', (req, res) => {

        console.log('Recieved Request for Audit Log Report')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        //get point adjustment info
        query = "select pnt.date, sp.orgName, dr.lname, dr.fname, pnt.pointValue, pnt.pointReason from POINT_ADJUSTMENT as pnt, SPONSOR_ORG as sp, DRIVER_POINTS as dp, USER as dr where pnt.sponsorID = sp.sponsorID and pnt.DPointID = dp.DPointID and dp.uID = dr.uID;"
        if( req.body.startDate != '' & req.body.orgName === '') {
            query = `select * from (
                select pnt.date, sp.orgName, dr.lname, dr.fname, pnt.pointValue, pnt.pointReason
                    from POINT_ADJUSTMENT as pnt, SPONSOR_ORG as sp, DRIVER_POINTS as dp, USER as dr where pnt.sponsorID = sp.sponsorID and pnt.DPointID = dp.DPointID and dp.uID = dr.uID
                    ) as log 
                        where DATE(log.date) between '`+ formattedStartDate +`' and '`+ formattedEndDate +`';`;
        }
        else if( req.body.startDate === '' & req.body.orgName != '' ) {
            query = `select * from (
                select pnt.date, sp.orgName, dr.lname, dr.fname, pnt.pointValue, pnt.pointReason
                    from POINT_ADJUSTMENT as pnt, SPONSOR_ORG as sp, DRIVER_POINTS as dp, USER as dr where pnt.sponsorID = sp.sponsorID and pnt.DPointID = dp.DPointID and dp.uID = dr.uID
                    ) as log 
                        where log.orgName = '`+ req.body.orgName +`';`;
        }
        else if(req.body.startDate != '' & req.body.orgName != '') {
            query =  `select * from (
                select pnt.date, sp.orgName, dr.lname, dr.fname, pnt.pointValue, pnt.pointReason
                    from POINT_ADJUSTMENT as pnt, SPONSOR_ORG as sp, DRIVER_POINTS as dp, USER as dr where pnt.sponsorID = sp.sponsorID and pnt.DPointID = dp.DPointID and dp.uID = dr.uID
                    ) as log 
                        where DATE(log.date) between '`+ formattedStartDate +`' and '`+ formattedEndDate +`' and log.orgName = '`+ req.body.orgName +`';`;
        }

        console.log("QUERY: " + query);
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {
                console.log(result)
                res.send(result)

            }
        });

    });

    app.post('/getApplications', (req, res) => {

        console.log('Recieved Request for Audit Log Report')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        //get application info
        query = `select app.date, sp.orgName, usr.lname, usr.fname, app.status 
        from APPLICATION as app, SPONSOR_ORG as sp, USER as usr
        where app.uID = usr.uID and app.sponsorID = sp.sponsorID;`;

        if( req.body.startDate != '' & req.body.orgName === '') {
            query = `select log.date, log.orgName, log.lname, log.fname, log.status from (
                select app.date, sp.orgName, usr.lname, usr.fname, app.status 
                    from APPLICATION as app, SPONSOR_ORG as sp, USER as usr
                    where app.uID = usr.uID and app.sponsorID = sp.sponsorID
            ) as log
                where log.date between '${formattedStartDate}' and '${formattedEndDate}';`;
        }
        else if( req.body.startDate === '' & req.body.orgName != '' ) {
            query = `select log.date, log.orgName, log.lname, log.fname, log.status from (
                select app.date, sp.orgName, usr.lname, usr.fname, app.status 
                    from APPLICATION as app, SPONSOR_ORG as sp, USER as usr
                    where app.uID = usr.uID and app.sponsorID = sp.sponsorID
            ) as log
                where log.orgName = '${req.body.orgName}';`;
        }
        else if(req.body.startDate != '' & req.body.orgName != '') {
            query = `select log.date, log.orgName, log.lname, log.fname, log.status from (
                select app.date, sp.orgName, usr.lname, usr.fname, app.status 
                    from APPLICATION as app, SPONSOR_ORG as sp, USER as usr
                    where app.uID = usr.uID and app.sponsorID = sp.sponsorID
            ) as log
                where log.orgName = '${req.body.orgName}' and log.date between '${formattedStartDate}' and '${formattedEndDate}';`;
        }
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {

                res.send(result)

            }
        });

    });

    app.get('/getSponsors', (req, res) => {

        console.log('Recieved Request for Sponsor List')

        let query = 'select sp.orgName from SPONSOR_ORG as sp'

        connection.query(query, function(err, result) {
            if( err ) {
                console.log(err)
                res.send({success:false})
            }
            else {
                res.send(result)
            }
        });

    });


    // END OF AUDIT LOG REPORTS

    // SALES REPORTS -------------------------------------------

    app.post('/getDriversFromOrg', (req, res) => {

        console.log('Recieved Request for Sponsor List')

        const orgID = req.body.orgID;
        let query = `select usr.uID, usr.fname, usr.lname
                        from USER as usr, USER_SPONSOR_REL as u2s
                        where u2s.sponsorID = ${orgID} and u2s.uID = usr.uID`
        
        connection.query(query, function(err, result) {
            if( err ) {
                console.log(err)
                res.send({success:false})
            }
            else {
                res.send(result)
            }
        });

    });

    app.post('/getSalesByDriver', (req, res) => {

        console.log('Recieved Request for Sales By Driver')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        query = `select usr.fname, usr.lname, SUM(ord.total) as total, usr.uID
                    from new_schema.ORDER as ord, USER as usr
                        where usr.uID = ord.uID
                            group by ord.uID;`;

        if( req.body.startDate != '' & req.body.orgName != '' & req.body.uID != '' ) {
            query = `select rep.fname, rep.lname, rep.total, rep.sponsorID, rep.uID
            from (
                select usr.fname, usr.lname, SUM(ord.total) as total, ord.sponsorID, ord.date, sp.orgName, ord.uID
                    from new_schema.ORDER as ord, USER as usr, SPONSOR_ORG as sp
                    where usr.uID = ord.uID and ord.sponsorID = sp.sponsorID
                    group by ord.uID
            ) as rep
            where rep.uID = ${req.body.uID} and rep.orgName = '${req.body.orgName}' and rep.date between '${formattedStartDate}' and '${formattedEndDate}';`;
        }
        else if( req.body.startDate != '' & req.body.orgName != '' & req.body.uID === '' ) {
            query = `select rep.fname, rep.lname, rep.total, rep.sponsorID, rep.uID
            from (
                select usr.fname, usr.lname, SUM(ord.total) as total, ord.sponsorID, ord.date, sp.orgName, ord.uID
                    from new_schema.ORDER as ord, USER as usr, SPONSOR_ORG as sp
                    where usr.uID = ord.uID and ord.sponsorID = sp.sponsorID
                    group by ord.uID
            ) as rep
            where rep.orgName = '${req.body.orgName}' and rep.date between '${formattedStartDate}' and '${formattedEndDate}';`;
        }
        else if( req.body.startDate != '' & req.body.orgName === '' & req.body.uID === '' ) {
            query = `select rep.fname, rep.lname, rep.total, rep.uID
            from (
                select usr.fname, usr.lname, SUM(ord.total) as total, ord.sponsorID, ord.date, sp.orgName, ord.uID
                    from new_schema.ORDER as ord, USER as usr, SPONSOR_ORG as sp
                    where usr.uID = ord.uID and ord.sponsorID = sp.sponsorID
                    group by ord.uID
            ) as rep
            where rep.date between '${formattedStartDate}' and '${formattedEndDate}';`;
        }
        else if( req.body.startDate === '' & req.body.orgName != '' & req.body.uID != '' ) {
            query = `select rep.fname, rep.lname, rep.total, rep.sponsorID, rep.uID
            from (
                select usr.fname, usr.lname, SUM(ord.total) as total, ord.sponsorID, ord.date, sp.orgName, ord.uID
                    from new_schema.ORDER as ord, USER as usr, SPONSOR_ORG as sp
                    where usr.uID = ord.uID and ord.sponsorID = sp.sponsorID
                    group by ord.uID
            ) as rep
            where rep.uID = ${req.body.uID} and rep.orgName = '${req.body.orgName}';`;
        }
        else if( req.body.startDate === '' & req.body.orgName === '' & req.body.uID != '' ) {
            query = `select rep.fname, rep.lname, rep.total, rep.uID
            from (
                select usr.fname, usr.lname, SUM(ord.total) as total, ord.sponsorID, ord.date, sp.orgName, ord.uID
                    from new_schema.ORDER as ord, USER as usr, SPONSOR_ORG as sp
                    where usr.uID = ord.uID and ord.sponsorID = sp.sponsorID
                    group by ord.uID
            ) as rep
            where rep.uID = ${req.body.uID};`;
        }
        else if( req.body.startDate === '' & req.body.orgName != '' & req.body.uID === '' ) {
            query = `select rep.fname, rep.lname, rep.total, rep.sponsorID, rep.uID
            from (
                select usr.fname, usr.lname, SUM(ord.total) as total, ord.sponsorID, ord.date, sp.orgName, ord.uID
                    from new_schema.ORDER as ord, USER as usr, SPONSOR_ORG as sp
                    where usr.uID = ord.uID and ord.sponsorID = sp.sponsorID
                    group by ord.uID
            ) as rep
            where rep.orgName = '${req.body.orgName}';`;
        }
        else if( req.body.startDate != '' & req.body.orgName === '' & req.body.uID != '' ) {
            query = `select rep.fname, rep.lname, rep.total, rep.uID
            from (
                select usr.fname, usr.lname, SUM(ord.total) as total, ord.sponsorID, ord.date, sp.orgName, ord.uID
                    from new_schema.ORDER as ord, USER as usr, SPONSOR_ORG as sp
                    where usr.uID = ord.uID and ord.sponsorID = sp.sponsorID
                    group by ord.uID
            ) as rep
            where rep.uID = ${req.body.uID} and rep.date between '${formattedStartDate}' and '${formattedEndDate}';`;
        }
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {

                res.send(result)

            }
        });

    });

    app.post('/getDetailedDriverInfo', (req, res) => {

        console.log('Recieved Request for detailed driver purchase info')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        query = `select itm.itemID, itm.name, itm.price, itm.quantity
                    from new_schema.ORDER_ITEMS as itm, new_schema.ORDER as ord
                        where itm.orderID = ord.orderID and ord.uID = ${req.body.data.uID};`;

        if( req.body.startDate != '' ) {
            query = `select rep.itemID, rep.name, rep.price, rep.quantity, rep.date
            from (
                select itm.itemID, itm.name, itm.price, itm.quantity, ord.date
                    from new_schema.ORDER_ITEMS as itm, new_schema.ORDER as ord
                        where itm.orderID = ord.orderID and ord.uID = ${req.body.data.uID}
            ) as rep
            where rep.date between '${formattedStartDate}' and '${formattedEndDate}';`;
        }
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {
                console.log(result)
                res.send(result)

            }
        });

    });

    app.post('/getSalesBySponsor', (req, res) => {

        console.log('Recieved Request for Sales By Sponsor')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        query = `select sp.orgName, SUM(ord.total) as total
                        from SPONSOR_ORG as sp, new_schema.ORDER as ord
                        where sp.sponsorID = ord.sponsorID
                        group by ord.sponsorID;`;

        if( req.body.startDate != '' & req.body.orgName != '' ) {
            query = `select sp.orgName, SUM(rep.total) as total
            from (
                select * from new_schema.ORDER as ord
                    where ord.date between '${formattedStartDate}' and '${formattedEndDate}'
            ) as rep, SPONSOR_ORG as sp
            where sp.sponsorID = rep.sponsorID and sp.orgName = '${req.body.orgName}'
            group by rep.sponsorID;`;
        }
        else if( req.body.startDate === '' & req.body.orgName != '' ) {
            query = `select sp.orgName, SUM(rep.total) as total
            from (
                select * from new_schema.ORDER as ord
            ) as rep, SPONSOR_ORG as sp
            where sp.sponsorID = rep.sponsorID and sp.orgName = '${req.body.orgName}'
            group by rep.sponsorID;`;
        }
        else if( req.body.startDate != '' & req.body.orgName === '' ) {
            query = `select sp.orgName, SUM(rep.total) as total
            from (
                select * from new_schema.ORDER as ord
                    where ord.date between '${formattedStartDate}' and '${formattedEndDate}'
            ) as rep, SPONSOR_ORG as sp
            where sp.sponsorID = rep.sponsorID
            group by rep.sponsorID;`;
        }
        
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {

                res.send(result)

            }
        });

    });

    app.post('/getDetailedSponsorInfo', (req, res) => {

        console.log('Recieved Request for detailed sponsor purchase info')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        query = `select rep.itemID, rep.name, rep.price, rep.quantity, rep.date
        from (
            select itm.itemID, itm.name, itm.price, itm.quantity, ord.date, sp.orgName
                from new_schema.ORDER_ITEMS as itm, new_schema.ORDER as ord, new_schema.SPONSOR_ORG as sp
                    where itm.orderID = ord.orderID and sp.sponsorID = ord.sponsorID
        ) as rep
        where rep.orgName = '${req.body.data.orgName}';`;

        if( req.body.startDate != '' ) {
            query = `select rep.itemID, rep.name, rep.price, rep.quantity, rep.date
            from (
                select itm.itemID, itm.name, itm.price, itm.quantity, ord.date, sp.orgName
                    from new_schema.ORDER_ITEMS as itm, new_schema.ORDER as ord, new_schema.SPONSOR_ORG as sp
                        where itm.orderID = ord.orderID and sp.sponsorID = ord.sponsorID
            ) as rep
            where rep.date between '${formattedStartDate}' and '${formattedEndDate}' and rep.orgName = '${req.body.data.orgName}';`;
        }

        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {
                console.log(result)
                res.send(result)

            }
        });

    });

    // End of Sales Reports

    // INVOICE REPORTS ----------------------------------------

    app.post('/getInvoiceReport', (req, res) => {

        console.log('Recieved Request for Invoice Report')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        //get invoice info
        query = `select sp.orgName, dr.uID, dr.fname, dr.lname, round((ord.total / sp.pointsPerDollar), 2) as total, round(((ord.total / sp.pointsPerDollar) * 0.01), 2) as Fee
        from USER as dr, new_schema.ORDER as ord, SPONSOR_ORG as sp
            where dr.uID = ord.uID and sp.sponsorID = ord.sponsorID
            group by ord.uID;`;

        if( req.body.startDate != '' & req.body.orgName === '') {
            query = `select sp.orgName, dr.uID, dr.fname, dr.lname, round((ord.total / sp.pointsPerDollar), 2) as total, round(((ord.total / sp.pointsPerDollar) * 0.01), 2) as Fee
            from USER as dr, new_schema.ORDER as ord, SPONSOR_ORG as sp
                where dr.uID = ord.uID and sp.sponsorID = ord.sponsorID
                    and ord.date between '${formattedStartDate}' and '${formattedEndDate}'
                group by ord.uID;`;
        }
        else if( req.body.startDate === '' & req.body.orgName != '' ) {
            query = `select sp.orgName, dr.uID, dr.fname, dr.lname, round((ord.total / sp.pointsPerDollar), 2) as total, round(((ord.total / sp.pointsPerDollar) * 0.01), 2) as Fee
            from USER as dr, new_schema.ORDER as ord, SPONSOR_ORG as sp
                where dr.uID = ord.uID and sp.sponsorID = ord.sponsorID and sp.orgName = '${req.body.orgName}'
                group by ord.uID;`;
        }
        else if(req.body.startDate != '' & req.body.orgName != '') {
            query = `select sp.orgName, dr.uID, dr.fname, dr.lname, round((ord.total / sp.pointsPerDollar), 2) as total, round(((ord.total / sp.pointsPerDollar) * 0.01), 2) as Fee
                        from USER as dr, new_schema.ORDER as ord, SPONSOR_ORG as sp
                            where dr.uID = ord.uID and sp.sponsorID = ord.sponsorID and sp.orgName = '${req.body.orgName}'
                                and ord.date between '${formattedStartDate}' and '${formattedEndDate}'
                            group by ord.uID;`;
        }
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {

                res.send(result)

            }
        });

    });

    // SPONSOR REPORTS

    // POINT REPORTS -----------------------------------------------------------

    app.post('/getSponsorPointReport', (req, res) => {

        console.log('Recieved Request for Sponsor Point by driver')
        console.log(req.body)

        const sdate = new Date(req.body.startDate);
        const formattedStartDate = sdate.getFullYear()+'-'+(sdate.getMonth()+1)+'-'+sdate.getDate();
        const edate = new Date(req.body.endDate);
        const formattedEndDate = edate.getFullYear()+'-'+(edate.getMonth()+1)+'-'+edate.getDate();

        query = `select * from (
            select dr.fname, dr.lname, dp.totalPoints, pa.pointValue, pa.pointReason, pa.date, sp.orgName
                from USER as dr, DRIVER_POINTS as dp, POINT_ADJUSTMENT as pa, SPONSOR_ORG as sp
                where dr.uID = dp.uID and dp.DPointID = pa.DPointID and sp.sponsorID = dp.sponsorID and sp.sponsorID = '${req.body.orgID}'
                ) as rep;`;

                if( req.body.startDate != '' & req.body.uID === '') {
                    query = `select * from (
                        select dr.fname, dr.lname, dp.totalPoints, pa.pointValue, pa.pointReason, pa.date, sp.orgName
                            from USER as dr, DRIVER_POINTS as dp, POINT_ADJUSTMENT as pa, SPONSOR_ORG as sp
                            where dr.uID = dp.uID and dp.DPointID = pa.DPointID and sp.sponsorID = dp.sponsorID and sp.sponsorID = '${req.body.orgID}'
                            ) as rep
                            where rep.date between '${formattedStartDate}' and '${formattedEndDate}';`;
                }
                else if( req.body.startDate === '' & req.body.uID != '' ) {
                    query = `select * from (
                        select dr.fname, dr.lname, dp.totalPoints, pa.pointValue, pa.pointReason, pa.date, sp.orgName
                            from USER as dr, DRIVER_POINTS as dp, POINT_ADJUSTMENT as pa, SPONSOR_ORG as sp
                            where dr.uID = dp.uID and dr.uID = ${req.body.uID} and dp.DPointID = pa.DPointID and sp.sponsorID = dp.sponsorID and sp.sponsorID = '${req.body.orgID}'
                            ) as rep;`;
                }
                else if(req.body.startDate != '' & req.body.uID != '') {
                    query = `select * from (
                        select dr.fname, dr.lname, dp.totalPoints, pa.pointValue, pa.pointReason, pa.date, sp.orgName
                            from USER as dr, DRIVER_POINTS as dp, POINT_ADJUSTMENT as pa, SPONSOR_ORG as sp
                            where dr.uID = dp.uID and dr.uID = ${req.body.uID} and dp.DPointID = pa.DPointID and sp.sponsorID = dp.sponsorID and sp.sponsorID = '${req.body.orgID}'
                            ) as rep
                            where rep.date between '${formattedStartDate}' and '${formattedEndDate}';`;
                }
        connection.query(query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success:false})
            }
            else {

                res.send(result)

            }
        });

    });

}