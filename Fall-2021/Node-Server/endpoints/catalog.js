const { finished } = require('nodemailer/lib/xoauth2');

module.exports = function(app, connection){
    const axios = require('axios');

    app.post('/remove-item', (req, res) => {
        const delete_query = `DELETE from new_schema.SPONSOR_CATALOG where sponsorID=${req.body.sponsorID} and listingId=${req.body.listingId}`;
        connection.query(delete_query, function(err, result, fields) {
            if(err) console.log(err);
            res.send({success: true});
        });
    });

    app.post('/add-item', (req, res) => {
        const items_query = `SELECT listingId from new_schema.SPONSOR_CATALOG where sponsorID=${req.body.sponsorID};`;
        connection.query(items_query, function(err, result) {
            if(err) console.log(err);
            if(result.length >= 10){
                res.send({success: false, msg: "Item Limit Reached"});
            }else if(result.find(item => item.listingId === req.body.listingId)){
                res.send({success: false, msg: "Item Already In Catalog"});
            }else{
            const insert_query = `INSERT INTO new_schema.SPONSOR_CATALOG (listingId, sponsorID) VALUES (${req.body.listingId}, ${req.body.sponsorID});`;
                connection.query(insert_query, function(err, result, fields) {
                    if(err) console.log(err);
                    axios.get(`https://openapi.etsy.com/v3/application/listings/${req.body.listingId}/images`, {headers: {'x-api-key': 'h7ctibmsc63qthr5ozej14i4'}})
                    .then(function (response) {
                        response.data.results.map((image) =>{
                            qstr = `INSERT INTO new_schema.CATALOG_IMAGES (link, listingId) VALUES ('${image.url_fullxfull}', ${req.body.listingId});`;
                            connection.query(qstr, function(err, result, fields) {
                                if(err){
                                    console.log(err);
                                }
                            });
                        })
                        res.send({success: true});
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                });
            }
        });
    });

    app.get('/getListing', (req, res) => {
        axios.get(`https://openapi.etsy.com/v3/application/listings/${req.query.listingId}`, {headers: {'x-api-key': 'h7ctibmsc63qthr5ozej14i4'}})
        .then(function (response) {
            let price = getUSD(response.data.price.amount,response.data.price.divisor,response.data.price.currency_code);
            const name = response.data.title
            const description = response.data.description
            const quantity = response.data.quantity
            const url = response.data.url
            setTimeout(() => {
                return res.json({
                    name: name,
                    description: description,
                    quantity: quantity,
                    url: url,
                    price: price
                })
            }, 1000);
        })
        .catch(function (error) {
            console.log(error);
        })
    });

    app.get('/getListingImages', (req, res) => {
        const image_query = `SELECT link from new_schema.CATALOG_IMAGES where listingID=${req.query.listingId};`;
        connection.query(image_query, function(err, result) {
            if(err){
                console.log(err);
            }else{
                if(result.length===0){
                    axios.get(`https://openapi.etsy.com/v3/application/listings/${req.query.listingId}/images`, {headers: {'x-api-key': 'h7ctibmsc63qthr5ozej14i4'}})
                    .then(function (response) {
                        let ret = [];
                        response.data.results.map((image) =>{
                            ret.push(image.url_fullxfull);
                            // qstr = `INSERT INTO new_schema.CATALOG_IMAGES (link, listingId) VALUES ('${image.url_fullxfull}', ${req.query.listingId});`;
                            // connection.query(qstr, function(err, result, fields) {
                            //     if(err){
                            //         console.log(err);
                            //     }
                            // });
                        })
                        return res.json({
                            images: ret,
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }else{
                    let ret = [];
                    result.map((image) =>{
                        ret.push(image.link);
                    })
                    return res.json({
                        images: ret,
                    })
                }
            }
      })
    });

    app.get('/getSponsorItems', (req, res) => {
        session = req.session;
        sponsorID = req.query.sponsorID === '-1' ? session.userid : req.query.sponsorID;
        const items_query = `SELECT listingId from new_schema.SPONSOR_CATALOG where sponsorID=${sponsorID};`;
        connection.query(items_query, function(err, result) {
        if(err) console.log(err);
            let ids = [];
            result.map( (listing) => {
                ids.push(listing.listingId)
            })
            axios.get(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${ids.toString()}`, {headers: {'x-api-key': 'h7ctibmsc63qthr5ozej14i4'}})
            .then(function (response) {
                let ret = [];
                response.data.results.map((item) => {
                    let price = getUSD(item.price.amount,item.price.divisor,item.price.currency_code);
                    const name = item.title
                    const description = item.description
                    const quantity = item.quantity
                    const url = item.url
                    const listingId = item.listing_id
                    ret.push({
                        name: name,
                        description: description,
                        quantity: quantity,
                        url: url,
                        price: price,
                        listingId: listingId
                    })
                })
                return res.json({
                    items: ret
                })
            })
            .catch(function (error) {
                console.log(error);
            })
        })
    });

    app.get('/searchItems', (req, res) => {
        const limit = 6;
        axios.get(`https://openapi.etsy.com/v3/application/listings/active?keywords="${req.query.keywords}"&limit=${limit}`, {headers: {'x-api-key': 'h7ctibmsc63qthr5ozej14i4'}})
        .then(function (response) {
            let ret = [];
            response.data.results.map((item) => {
                let price = getUSD(item.price.amount,item.price.divisor,item.price.currency_code);
                const name = item.title
                const description = item.description
                const quantity = item.quantity
                const url = item.url
                const listingId = item.listing_id
                ret.push({
                    name: name,
                    description: description,
                    quantity: quantity,
                    url: url,
                    price: price,
                    listingId: listingId
                })
            })
            return res.json({
                items: ret
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    });

    function getUSD(amount, divisor, currency_code){
        let price = amount / divisor
        switch(currency_code){
            case 'AUD':
                price *= 0.75;
                break;
            case 'GBP':
                price *= 1.31;
                break;
            case 'CAD':
                price *= 0.8;
                break;
            case 'DKK':
                price *= 0.15;
                break;
            case 'EUR':
                price *= 1.11;
                break;
            case 'HKD':
                price *= 0.13;
                break;
            case 'IDR':
                price *= 0.75;
                break;
            case 'ILS':
                price *= 0.31;
                break;
            case 'MYR':
                price *= 0.24;
                break;
            case 'MXN':
                price *= 0.05;
                break;
            case 'MAD':
                price *= 0.10;
                break;
            case 'NZD':
                price *= 0.69;
                break;
            case 'NOK':
                price *= 0.12;
                break;
            case 'PHP':
                price *= 0.019;
                break;
            case 'SGD':
                price *= 0.74;
                break;
            case 'ZAR':
                price *= 0.069;
                break;
            case 'SEK':
                price *= 0.11;
                break;
            case 'CHF':
                price *= 1.07;
                break;
            case 'TRY':
                price *= 0.069;
                break;
            case 'VND':
                price *= 0.000044;
                break;
        }
        return price;
    }
}