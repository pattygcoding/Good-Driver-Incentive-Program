
/* Functions to query the database for reporting */

// Looking into using a reporting table component: from
// https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--page



//general requirements:

/* SPONSOR REPORTS */

// Driver Poit tracking reports
    /* display driver name, total points, point changes, date of point change,
        name of sponsor making the point change, reason for change  */

    // select by all drivers or individual driver

    // select by date range

// Audit Log Report (restricted to sponsor's drivers only)
    /* display all audit log info (listed in project pdf) */

    //select by date range

    //select by audit log category (login, app, password change, points change)

/* ADMIN REPORTS */

// Sales by Sponsor
    /* list all sales info for each sponsor -- need to consider how we r storing this */

    //select by date
    
    //detailed or summary views

//Sales by driver
    //same as sponsor but for drivers
    
    //select by all sponsors or individual sponsor

        //for an individual sponsor, select by all driers or individual driver

    //select by date range

    //detaield or summary views

//Invoice
    //one per sponsor, total fees charged & purchases over date

    //select by all sponsors or individual

    //select by date range

//Audit Log Reports
    //select by date range, sponsor (all or individual), or audit log category

// function to query for audit logs
/* params:
    dates --> list containing start & end date for log. Empty if no date range.
    sponsor --> name of sponsor, query all sponsors if empty string
    category --> list of categories (app, point, password, login). Query all if empty
   return queried data formatted for reports api
*/
function admin_auditlog( dates, sponsor, category ) {

    //check for dates

    //check for sponsor

    //check for category

    // test = Date.parse("2000-10-01");
    // test2 = new Date();

    // test2.setTime(test);
    // console.log(test2.toLocaleString());

}

//must be downloadable as CSV


admin_auditlog([], "", []);