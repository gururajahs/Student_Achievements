const express = require('express');
const bodyParser = require('body-parser');

const add_data = require('./data_collectors/add_data');
const get_user_data = require('./data_collectors/get_user_data');
const validate_ph_number = require('./data_collectors/validate_ph_number');


const port = 3000;
const app = express();

var userData = {
    usn: null,
    name: null,
    image: null,
    email: null,
    phone: null,
    nameOfEvent: null,
    detailsOfEvent: null,
    level: null,
    award: null,
    department_id: null,
    batch: null,
    year: null
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//     res.render("index.ejs");
// });

app.get("/", (req, res) => {
    res.render("usn.ejs", {isValid: true});
});

app.post("/feed", async (req, res) => {
    try{
        //validate email also
        userData.name = req.body.name;
        userData.email = req.body.email;
        userData.image = req.body.image;
        console.log(userData);
        data = await get_user_data(req.body.usn);
        userData.usn = data.usn;
        userData.department_id = data.department_id;
        userData.batch = data.batch;
        await validate_ph_number(req.body.phone_no);
        userData.phone = req.body.phone_no;
        console.log(userData);
        res.render("feed.ejs", {isValid: null});
    }catch(error){
        res.render("usn.ejs", {isValid: false})
    }
});

app.post("/feed_again", async (req, res) => {
    try{
        userData.nameOfEvent = req.body.nameOfEvent;
        userData.detailsOfEvent = req.body.detailsOfEvent;
        userData.award = req.body.award;
        userData.level = req.body.level;
        userData.year = parseInt(req.body.year);
        for(let field in userData)
            if(!userData[field])
                throw new Error("Invalid");
        //await add_data(userData);
        console.log(userData);
        res.render("feed.ejs", {isValid: true});
    }catch(error){
        res.render("feed.ejs", {isValid: false});
    }
});

app.listen(port,() => {
    console.log(`this log is working on ${port}`);
});