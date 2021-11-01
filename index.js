const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const auth = require('./auth/get_auth');
const protected_data = require('./auth/protected_Data.json');
const add_achievement = require('./data_collectors/add_achievement');
const get_user_data = require('./data_collectors/get_user_data');
const validate_ph_number = require('./data_collectors/validate_ph_number');
const get_achievements = require('./data_collectors/get_achievements');
const add_user = require('./data_collectors/add_user');
const get_user = require('./data_collectors/get_user');
const get_spreadsheetId = require("./functions/get_spreadsheet_id");
const isBatchPresent = require("./functions/isBatchPresent");
const get_batches = require("./functions/get_batches");
const view_achievements = require('./data_viewers/view_achievements');

const port = 3000;
const app = express();

const departments = protected_data.all_departments;
var all_batches = null;//["batch-2019-2023", "batch-2018-2022", "batch-2017-2021", "batch-2020-2024"];

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
    department: null,
    batch: null,
    spreadsheetId: null,
    presentYear: null,
    yearOfAchievement: null
};


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
    res.render("getUserDetails.ejs", {isValid: true,image:userData.image,name:userData.name,email:userData.email});
});

app.post("/register", async (req, res) => {
    try{

        userData.usn = req.body.usn;
        userData.phone = req.body.phone_no;
        data = await get_user_data(req.body.usn);
        
        userData.department = data.department;
        userData.batch = data.batch;
        userData.presentYear = data.presentYear;

        await validate_ph_number(userData.phone);

        var departments_set = new Set(departments)
        if(!departments_set.has(userData.department))
            throw new Error("Invalid department");

        var isPresent = await isBatchPresent(auth, protected_data.index_table_id, userData.batch);
        if(isPresent == false)
            throw new Error("Invalid batch");

        userData.spreadsheetId = await get_spreadsheetId(auth, userData.department, userData.batch);

        var user = await get_user(auth, userData.spreadsheetId, userData.email);
        if(user)
            throw new Error("User Already Registered");

        await add_user(userData);
        console.log(userData);

        res.render("verify.ejs", {is_achievement_updated: null});
    }catch(error){
        res.render("index.ejs", {isValid: false, error:'Registration Error'})
    }
})

app.post("/login", async (req, res) => {

    try{

        userData.name = req.body.name;
        userData.email = req.body.email;
        userData.image = req.body.image;
        userData.usn = req.body.usn;
        
        var data = await get_user_data(userData.usn);
        
        userData.department = data.department;
        userData.batch = data.batch;
        userData.presentYear = data.presentYear;
        
        userData.spreadsheetId = await get_spreadsheetId(auth, userData.department, userData.batch);

        var user = await get_user(auth, userData.spreadsheetId, userData.email);
        if(!user)
            throw new Error("User Not Registered");
        
        if(user.usn.localeCompare(userData.usn) != 0)
            throw new Error("Entered Wrong USN");
        userData.phone = user.phone;

        console.log(userData);

        res.render("verify.ejs", {is_achievement_updated: null});
    }catch(error){
        console.log(error);
        res.render("index.ejs", {isValid: false, error:'Login Error'})
    }
})

app.post("/addAchievement", async (req, res) => {
    try{

        if(!userData.name || !userData.image || !userData.email || !userData.usn || 
            !userData.phone || !userData.department || !userData.batch || !userData.presentYear)
            throw new Error("Invalid Not logged in");
        
        var is_achievement_updated = req.body.is_achievement_updated;

        res.render("addAchievement.ejs", {isValid: true, is_achievement_updated: is_achievement_updated, image:userData.image,name:userData.name,current_year:userData.presentYear});
    }catch(error){
        console.log(error);
        res.render("index.ejs", {isValid: false, error:'Login Error'})
    }
});

app.post("/updating_achievement", async (req, res) => {
    
    try{

        userData.nameOfEvent = req.body.nameOfEvent;
        userData.detailsOfEvent = req.body.detailsOfEvent;
        userData.award = req.body.award;
        userData.level = req.body.level;
        userData.yearOfAchievement = parseInt(req.body.year);

        for(let field in userData)
            if(field != 'year1' && field != 'year2' && field != 'year3' && field != 'year4' && !userData[field])
                throw new Error("Invalid");
        await add_achievement(userData);
        console.log(userData);

        res.render("verify.ejs", {is_achievement_updated: true});
    }catch(error){
        res.render("verify.ejs", {is_achievement_updated: false});
    }
});

app.get("/viewAchievements",async (req, res) => {
    const data = await get_achievements(userData);
    console.log(data);
    res.render("viewAchievements.ejs", {isValid: true, userData: userData, usn: userData.usn, achievements: data});
});

app.post("/verify_lecturer",async (req, res) => {
    all_batches = await get_batches(auth, protected_data.index_table_id);
    res.render("verify_lecturer.ejs");
});

app.post("/studentAchievements",async (req, res) => {

    var selected_departments = [];
    if(Array.isArray(req.body.selected_departments))
        selected_departments = req.body.selected_departments;
    else
        selected_departments = [req.body.selected_departments];
    
    var selected_batches = req.body.selected_batches;
    if(Array.isArray(req.body.selected_batches))
        selected_batches = req.body.selected_batches;
    else
        selected_batches = [req.body.selected_batches];

    var start_academic_year = parseInt(req.body.from_year);
    var end_academic_year = parseInt(req.body.to_year);
    var data = null;
    //console.log(selected_departments, selected_batches, start_academic_year, end_academic_year);

    if(selected_departments && selected_batches && start_academic_year && end_academic_year)
        data = await view_achievements(selected_departments, selected_batches, start_academic_year, end_academic_year);
    //console.log(data);

    res.render("studentAchievements.ejs", {isValid: true, image: userData.image, userData: userData, batches: all_batches, usn: userData.usn, departments: departments, download: true, data: data});
});

app.listen(port,() => {
    console.log(`this log is working on ${port}`);
});