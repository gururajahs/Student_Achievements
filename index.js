const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const messagebird = require('messagebird')('UVU6dkpSdJc93KGMrjGjE2gVp');

// const add_data = require('./data_collectors/add_data');
// const get_user_data = require('./data_collectors/get_user_data');
// const validate_ph_number = require('./data_collectors/validate_ph_number');
// const get_achievements = require('./data_collectors/get_achievements');

const port = 3000;
const app = express();

var departments = ["CE", "ME", "EE", "EC", "IM", "CS", "TE", "IS", "EI", "ML", "BT", "CH", "AS", "AM"];
var batch = ["batch-2012-2016", "batch-2013-2017", "batch-2014-2018", "batch-2015-2019", "batch-2016-2020"];

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
    res.render("index.ejs",{error:''});
});

app.post("/student_signup", (req, res) => {
    res.render("student_signup.ejs");
});

app.post("/student_signin", (req, res) => {
    res.render("student_signin.ejs");
});

app.post("/teacher_signin", (req, res) => {
    res.render("teacher_signin.ejs");
});

app.post("/getUserDetails", (req, res) => {
    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.image = req.body.image;
    res.render("getUserDetails.ejs", {isValid: true,image:userData.image,name:userData.name,email:userData.image});
});

app.post("/addAchievement", async (req, res) => {
    try{
        userData.name = req.body.name;
        userData.email = req.body.email;
        userData.image = req.body.image;

        if( !userData.name || !userData.image || !userData.email)
            throw new Error("Invalid Not logged in");
        // USN = req.body.usn;
        // data = await get_user_data(req.body.usn);
        // userData.usn = data.usn;
        // userData.department_id = data.department_id;
        // userData.batch = data.batch;
        // console.log(req.body.phone_no);
        // await validate_ph_number(req.body.phone_no);
        // userData.phone = req.body.phone_no;
        // console.log(userData);
        res.render("addAchievement.ejs", {isValid: true,image:userData.image,name:userData.name});
    }catch(error){
        res.render("index.ejs", {isValid: false, error:'Login Error'})
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
        await add_data(userData);
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
    res.render("studentAchievements.ejs", {isValid: true, userData: userData, batch : batch,usn: USN,departments:departments,download:false});
});

app.post("/studentAchievements",async (req, res) => {
    res.render("studentAchievements.ejs", {isValid: true, userData: userData,batch : batch, usn: USN,departments:departments,download:true});
});

app.listen(port,() => {
    console.log(`this log is working on ${port}`);
});