const express = require('express');
const bodyParser = require('body-parser');

// const add_data = require('./data_collectors/add_data');
// const get_user_data = require('./data_collectors/get_user_data');
// const validate_ph_number = require('./data_collectors/validate_ph_number');
// const get_achievements = require('./data_collectors/get_achievements');


const port = 3000;
const app = express();

var departments = ["IS", "CS", "AM", "AS", "EC"];

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

var USN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

//Static Files
app.use(express.static('public'));
app.use('/style',express.static(__dirname +'public/style'));
app.use('/img',express.static(__dirname +'public/img'));
app.use('/js',express.static(__dirname +'public/js'));

app.get("/", (req, res) => {
    res.render("usn.ejs", {isValid: true});
});

app.post("/addAchievement", async (req, res) => {
    try{
        userData.name = req.body.name;
        userData.email = req.body.email;
        userData.image = req.body.image;

        if( !userData.name || !userData.image || !userData.email)
            throw new Error("Invalid Not logged in");
        USN = req.body.usn;
        // data = await get_user_data(req.body.usn);
        // userData.usn = data.usn;
        // userData.department_id = data.department_id;
        // userData.batch = data.batch;
        // console.log(req.body.phone_no);
        // await validate_ph_number(req.body.phone_no);
        userData.phone = req.body.phone_no;
        console.log(userData);
        res.render("addAchievement.ejs", {isValid: null,image:userData.image,name:userData.name});
    }catch(error){
        res.render("usn.ejs", {isValid: false})
    }
});

app.post("/addAchievement_again", async (req, res) => {
    try{
        userData.nameOfEvent = req.body.nameOfEvent;
        userData.detailsOfEvent = req.body.detailsOfEvent;
        userData.award = req.body.award;
        userData.level = req.body.level;
        userData.year = parseInt(req.body.year);
        console.log(userData);
        for(let field in userData)
            if(field != 'year1' && field != 'year2' && field != 'year3' && field != 'year4' && !userData[field])
                throw new Error("Invalid");
        // await add_data(userData);
        console.log(userData);
        res.render("addAchievement.ejs", {isValid: true,image:userData.image,name:userData.name});
    }catch(error){
        res.render("addAchievement.ejs", {isValid: false,image:userData.image,name:userData.name});
    }
});

app.get("/viewAchievements",async (req, res) => {
    // const data = await get_achievements(userData);
    // res.render("viewAchievements.ejs", {isValid: true, userData: userData, usn: USN, achievements: data});
});
app.get("/studentAchievements",async (req, res) => {
    res.render("studentAchievements.ejs", {isValid: true, userData: userData, usn: USN,departments:departments});
});

app.listen(port,() => {
    console.log(`this log is working on ${port}`);
});