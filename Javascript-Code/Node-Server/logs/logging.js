
// functions to write to log files

//tentative format for logging login attempts:
//LOGIN <date> <username> <login attempt status --> "success"/""fail"><\n>
function recordLogin( username, success, uID, conn ) {
    const fs = require('fs');
    const date = new Date().toLocaleString();
    //const formattedDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

    var res;
    if( success ) {
        res = 1;
    }
    else {
        res = 0;
    }

    var record_query = "INSERT INTO LOGIN_ATTEMPTS( date, username, success, uID ) VALUES (\'" + date + "\', \'" + username + "\'," + res + "," + uID + ");";

    conn.query(record_query, (err) => {
        if (err) {
            console.log(err);
            return err;
        }
    });

    return date;
    
}


module.exports = { recordLogin };