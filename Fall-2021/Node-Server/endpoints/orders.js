const nodemailer = require("nodemailer");

module.exports = function(app, connection){
    app.post('/create-order', (req, res) => {
        session = req.session
        const userid = req.body.driver === '-1' ? session.userid : req.body.driver
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const order_query = `INSERT INTO new_schema.ORDER (uID, status, total, date, sponsorID) VALUES (${userid}, 1, ${req.body.total}, "${date}", ${req.body.sponsor})`;
        connection.query(order_query, function(err, result, fields) {
            if(err) console.log(err);
            let orderId = result.insertId;
            req.body.cart.map((item, i) => {
                if(req.body.quantity[i]>0){
                    const item_query = `INSERT INTO new_schema.ORDER_ITEMS (listingId, orderID, name, price, quantity) VALUES (${item.listingId}, ${orderId}, "${item.name}", ${item.price}, ${req.body.quantity[i]})`;
                    connection.query(item_query, function(err, result, fields) {
                        if(err) console.log(err);
                    });
                }
            })
            const email_query = `SELECT email from new_schema.USER where uid=${userid};`;
            connection.query(email_query, function(err, result) {
                if(err) console.log(err);
                const email=result[0].email;
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'madlads4910@gmail.com',
                        pass: '4910madlads!'
                    }
                })
                msgText = `An order has been placed by your account.\n\nDetails:\n-Sponsor: ${req.body.sponsorName}\n-Date: ${date}\n-Price: ${req.body.total}\n-Balance: ${req.body.points-req.body.total}`;
                const mailOptions = {
                    from: 'madlads4910@gmail.com',
                    to: email,
                    subject: 'Order Confirmation',
                    text: msgText
                }
    
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Email sent: ' + info.response)
                    }
                    
                });
            })

        });
        res.send({success: true})
    });

    app.post('/cancel-order', (req, res) => {
        session = req.session
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const order_query = `UPDATE new_schema.ORDER SET status=0 where orderID=${req.body.orderID}`;
        connection.query(order_query, function(err, result, fields) {
            if(err) console.log(err);
            const email_query = `SELECT email from new_schema.USER where uid=${session.userid};`;
            connection.query(email_query, function(err, result) {
                if(err) console.log(err);
                const email=result[0].email;
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'madlads4910@gmail.com',
                        pass: '4910madlads!'
                    }
                })
                msgText = `Order had been successfully canceled.\n\nDetails:\n-Sponsor: ${req.body.sponsorName}\n-Date: ${date}\n-Refund Amount: ${req.body.points}\n`;
                const mailOptions = {
                    from: 'madlads4910@gmail.com',
                    to: email,
                    subject: 'Order Canceled',
                    text: msgText
                }
    
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Email sent: ' + info.response)
                    }
                    
                });
            })
        });
        res.send({success: true})
    });

    app.get('/get-orders', (req, res) => {
        session=req.session;
        const userid = req.query.driver === '-1' ? session.userid : req.query.driver;
        const orders_query = `SELECT * from new_schema.ORDER where uID = ${userid};`;
        connection.query(orders_query, function(err, result) {
            if(err) {
                console.log(err);
                res.send({success: false})
            }else{
                var ret = result;
                result.map((r,i) => {
                    const items_query = `SELECT * from new_schema.ORDER_ITEMS where orderID = ${r.orderID};`;
                    connection.query(items_query, function(err, result2) {
                        if(err) {
                            console.log(err);
                            res.send({success: false})
                        }else{
                            ret[i].items = result2
                            if(i===ret.length-1){
                                return res.json({
                                    Orders: ret
                                })
                            }
                        }
                    })
                })
            }
        })
    });
}