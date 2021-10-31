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

var departments = ["IS", "CS", "AM", "AS", "EC"];
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
    res.render("index.ejs");
});

app.post("/verifyUser", async (req, res) => {
    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.image = req.body.image;
    try{
        //get user_data from through get_user_data
        //if user already exists
            //Redirect to addAchievement
        res.render("addAchievement.ejs", {isValid: true,image:userData.image,name:userData.name});
    }catch(error){
        res.render("getUserDetails.ejs", {isValid: false,image:userData.image,name:userData.name,email:userData.image})
    }
});

app.get("/getUserDetails", (req, res) => {
    res.render("getUserDetails.ejs", {isValid: true,image:userData.image,name:userData.name,email:userData.image});
});

app.post("/verifyPhone", function (req,res) {
var phone_no = '+917975610270';
 messagebird.verify.create( phone_no, {
     template:"Your Verification code is %token."
 }, function(err,response){
     if(err){
         console.log(err);
         res.render("verifyPhone.ejs",{
             error:err.errors[0].description,
             isValid: true
         });
     }
     else {
         console.log(response);
         res.render("verifyPhone.ejs", {
             id: response.id
        });
     }
 })
});

app.post("/verifyToken", function (req,res) {
    var id = req.body.id;
    var token = req.body.token;
    messagebird.verify.verify(id,token,function(err,response){
         if(err){
             console.log(err);
             res.render("verifyPhone.ejs",{
                 error:err.errors[0].description,
                 id: id
             });
         }
         else {
             console.log(response);
             //get all the userData
             res.render("addAchievement.ejs",{isValid: true,image:userData.image,name:userData.name});
         }
     })
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