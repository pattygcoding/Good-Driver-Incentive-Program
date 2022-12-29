const crypt = require('../services/encryption.js');
const dbUtils = require('../utils/database-utils.js');

module.exports = function( app, connection ) {
    const nodemailer = require('nodemailer');
    
    app.post('/add-user', (req, res) => {
        let userType = req.body.userType;
        let username = dbUtils.sanitizeInput(req.body.username);
        let firstname = dbUtils.sanitizeInput(req.body.firstname);
        let lastname = dbUtils.sanitizeInput(req.body.lastname);
        let email = req.body.email;
        let phone = req.body.phone;
        
        // Validate inputs
        if (!dbUtils.isValidUsername(username)) {
            return res.send({success: false, msg: "Invalid username format"});
        }
        
        if (!dbUtils.isValidEmail(email)) {
            return res.send({success: false, msg: "Invalid email format"});
        }
        
        if (phone && !dbUtils.isValidPhone(phone)) {
            return res.send({success: false, msg: "Invalid phone number format"});
        }
        
        let password = dbUtils.generateRandomPassword(12);
        console.log('Generated password for new user:', password);

        // Use parameterized query to prevent SQL injection
        const checkQuery = "SELECT COUNT(*) AS count FROM new_schema.USER WHERE username = ? OR email = ?";
        connection.query(checkQuery, [username, email], function(err, result, fields) {
            if(err) {
                console.log(err);
                return res.send({success: false, msg: "Database error"});
            }
            
            const count = result[0].count;
    
            if(count > 0){
                res.send({success: false, msg: "Username or email belongs to another account"});
                console.log('repeat user');
                res.end();
            } else {
                const encryptPass = crypt.getHash(password);
                
                // Use parameterized query for user insertion
                const insertQuery = `INSERT INTO new_schema.USER 
                    (lname, fname, username, password, email, phone, usertype, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, 1)`;
                    
                connection.query(insertQuery, 
                    [lastname, firstname, username, encryptPass, email, phone, userType], 
                    function(err, result, fields) {
                        if(err) {
                            console.log(err);
                            return res.send({success: false, msg: "Failed to create user"});
                        }
                        
                        console.log('User created successfully');
                        
                        // Send email notification
                        const transporter = nodemailer.createTransport({
                            service: process.env.EMAIL_SERVICE || 'gmail',
                            auth: {
                                user: process.env.EMAIL_USER || 'madlads4910@gmail.com',
                                pass: process.env.EMAIL_PASSWORD || '4910madlads!'
                            }
                        });
                        
                        const msgText = `A new account has been created for you with the Driver Rewards App!\n\nUsername: ${username}\nPassword: ${password}\n\nPlease login and change your password.`;
                        const mailOptions = {
                            from: process.env.EMAIL_USER || 'madlads4910@gmail.com',
                            to: email,
                            subject: 'New Account Created',
                            text: msgText
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                console.log('Email error:', error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        
                        // Link to sponsor organization if driver
                        if(req.body.userType === 1 && req.body.org){
                            const relQuery = "INSERT INTO new_schema.USER_SPONSOR_REL (uID, sponsorID) VALUES (?, ?)";
                            connection.query(relQuery, [result.insertId, req.body.org], function(err, relResult, fields) {
                                if(err) {
                                    console.log(err);
                                    return res.send({success: false, msg: "User created but failed to link to organization"});
                                }
                                res.send({success: true, msg: "User created and linked to organization"});
                            });
                        } else {
                            res.send({success: true, msg: "User created successfully"});
                        }
                    });
            }
        });
    });
};