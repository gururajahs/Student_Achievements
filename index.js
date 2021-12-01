const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth/get_auth');
const protected_data = require('./auth/protected_Data.json');
const add_achievement = require('./data_collectors/add_achievement');
const get_user_data = require('./data_collectors/get_user_data');
const validate_ph_number = require('./functions/validate_ph_number');
const get_achievements = require('./data_collectors/get_achievements');
const add_user = require('./data_collectors/add_user');
const get_user = require('./data_collectors/get_user');
const get_spreadsheetId = require("./functions/get_spreadsheet_id");
const isBatchPresent = require("./functions/isBatchPresent");
const get_batches = require("./functions/get_batches");
const view_achievements = require('./data_viewers/view_achievements');
const write_to_excel = require('./data_viewers/write_to_excel');
const create_batch = require('./create/create_batch');
const is_lecturer = require('./functions/is_lecturer');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const add_file_to_temp = require('./functions/add_file_to_temp');
const upload_certificate = require('./functions/upload_certificate');


const port = process.env.PORT || 3000;
const app = express();
app.locals.departments = protected_data.all_departments;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

//Static Files
app.use(express.static('public'));
app.use('/style', express.static(__dirname + 'public/style'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/js', express.static(__dirname + 'public/js'));

// should be removed when u want to use localhost
// app.enable('trust proxy');
// app.use((req, res, next) => {
//     //console.log(req.headers.host);
//     req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
// });


app.get("/", (req, res) => {
    res.render("index.ejs", { error: '' });
});

app.post("/student_signup", (req, res) => {
    res.render("auth/student_signup.ejs");
});

app.post("/student_signin", (req, res) => {
    res.render("auth/student_signin.ejs");
});

app.post("/admin_signin", (req, res) => {
    res.render("auth/admin_signin.ejs");
});


class UserDataObject {
    constructor() {

        this.usn = null;
        this.name = null;
        this.image = null;
        this.email = null;
        this.phone = null;
        this.nameOfEvent = null;
        this.detailsOfEvent = null;
        this.level = null;
        this.award = null;
        this.certificate = null;
        this.department = null;
        this.batch = null;
        this.spreadsheetId = null;
        this.presentYear = null;
        this.yearOfAchievement = null;

    }
}


app.post("/getUserDetails", (req, res) => {

    var userData = new UserDataObject();

    userData.name = req.body.name;
    userData.email = req.body.email;
    userData.image = req.body.image;
    res.render("getUserDetails.ejs", { userData: userData });
});


app.post("/register", async (req, res) => {
    try {

        var userData = JSON.parse(req.body.userData);
        userData.usn = req.body.usn;
        userData.phone = req.body.phone_no;

        var data = await get_user_data(req.body.usn);
        userData.department = data.department;
        userData.batch = data.batch;
        userData.presentYear = data.presentYear;

        await validate_ph_number(userData.phone);

        var departments_set = new Set(app.locals.departments)
        if (!departments_set.has(userData.department))
            throw new Error("Invalid department");

        var isPresent = await isBatchPresent(auth, protected_data.index_table_id, userData.batch);
        if (isPresent == false)
            throw new Error("Invalid batch");

        userData.spreadsheetId = await get_spreadsheetId(auth, userData.department, userData.batch);

        var user = await get_user(auth, userData.spreadsheetId, userData.email);
        if (user)
            throw new Error("User Already Registered");

        await add_user(auth, userData);

        res.render("verify.ejs", { is_achievement_updated: null, userData: userData });
    } catch (error) {
        console.log(error);
        res.render("index.ejs", { isValid: false, error: error })
    }
});


app.post("/login", async (req, res) => {
    try {

        var userData = new UserDataObject();

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
        if (!user)
            throw new Error("User Not Registered");

        if (user.usn.localeCompare(userData.usn) != 0)
            throw new Error("Entered Wrong USN");
        userData.phone = user.phone;

        res.render("verify.ejs", { is_achievement_updated: null, userData: userData });
    } catch (error) {
        console.log(error);
        res.render("index.ejs", { isValid: false, error: error })
    }
});


app.post("/addAchievement", async (req, res) => {
    try {

        var userData = JSON.parse(req.body.userData);
        if (!userData.name || !userData.image || !userData.email || !userData.usn ||
            !userData.phone || !userData.department || !userData.batch || !userData.presentYear)
            throw new Error("Login Error");

        var is_achievement_updated = null;
        if (req.body.is_achievement_updated == "true")
            is_achievement_updated = true;
        else if (req.body.is_achievement_updated == "false")
            is_achievement_updated = false;

        res.render("addAchievement.ejs", { is_achievement_updated: is_achievement_updated, userData: userData });
    } catch (error) {
        console.log(error);
        res.render("index.ejs", { isValid: false, error: error });
    }
});


app.use(fileUpload());
app.post("/updating_achievement", async(req, res) => {

    try {

        var userData = JSON.parse(req.body.userData);
        userData.nameOfEvent = req.body.nameOfEvent;
        userData.detailsOfEvent = req.body.detailsOfEvent;
        userData.award = req.body.award;
        userData.level = req.body.level;
        userData.yearOfAchievement = parseInt(req.body.year);

        userData.certificate = "None";
        if(req.files && req.files.certificate) {
            var file = req.files.certificate;
            var filename = `${Date.now()}.pdf`;
            var filepath = await add_file_to_temp(file, filename);
            userData.certificate = await upload_certificate(auth, filepath, userData.email);
            fs.unlink(filepath, (err) => {
                // console.log("file deleted");
            });
        } else {
            // console.log("no certificate");
        }

        for (let field in userData)
            if (field != 'year1' && field != 'year2' && field != 'year3' && field != 'year4' && !userData[field])
                throw new Error("Invalid");

        await add_achievement(auth, userData);
        userData.certificate = "None"; // so that the same certificate doesn't get attached for the next achievement for which they didn't add certificate

        res.render("verify.ejs", { is_achievement_updated: true, userData: userData });
    } catch (error) {
        console.log(error);
        res.render("verify.ejs", { is_achievement_updated: false, userData: userData });
    }
});


app.post("/viewAchievements", async(req, res) => {
    try {
        var userData = JSON.parse(req.body.userData);
        const data = await get_achievements(auth, userData);
        res.render("viewAchievements.ejs", { isValid: true, userData: userData, achievements: data });
    } catch (error) {
        console.log(error);
        res.render("verify.ejs", { is_achievement_updated: null, userData: userData });
    }
});


app.post("/verify_lecturer", async(req, res) => {
    try {

        var userData = {
            name: null,
            image: null,
            email: null
        };

        userData.name = req.body.name;
        userData.email = req.body.email;
        userData.image = req.body.image;
        // is_lecturer(userData.email);
        app.locals.all_batches = await get_batches(auth, protected_data.index_table_id);
        res.render("verify_lecturer.ejs", { userData: userData });

    } catch (error) {
        console.log(error);
        res.render("index.ejs", { isValid: false, error: 'Not a lecturer' });
    }
});


app.post("/studentAchievements", async(req, res) => {
    try {

        var userData = JSON.parse(req.body.userData);
        var selected_departments = req.body.selected_departments;
        if (!Array.isArray(selected_departments))
            selected_departments = [req.body.selected_departments];

        var selected_batches = req.body.selected_batches;
        if (!Array.isArray(selected_batches))
            selected_batches = [req.body.selected_batches];

        var start_academic_year = parseInt(req.body.from_year);
        var end_academic_year = parseInt(req.body.to_year);
        var data = null;
        var download = false;

        if (selected_departments && selected_batches && start_academic_year && end_academic_year) {
            data = await view_achievements(auth, selected_departments, selected_batches, start_academic_year, end_academic_year);
            download = true;
        }

        res.render("studentAchievements.ejs", { userData: userData, all_batches: app.locals.all_batches, departments: app.locals.departments, download: download, data: data });

    } catch (error) {
        console.log(error);
        res.render("studentAchievements.ejs", { userData: userData, all_batches: app.locals.all_batches, departments: app.locals.departments, download: false, data: null });
    }

});


app.post('/download', async(req, res) => {

    var data = JSON.parse(req.body.data);
    var filepath = `./temp/${Date.now()}.xlsx`;

    await write_to_excel(filepath, data);
    res.download(filepath, "student_achievements.xlsx", (err) => {
        if (err)
            console.log("file download error");
        else {
            //console.log("downloaded");
            fs.unlink(filepath, (err) => {
                //console.log("file deleted");
            });
        }
    });

});


app.post('/createBatches', creating_batch, (req, res) => {
    var userData = JSON.parse(req.body.userData);
    res.render('createBatches.ejs', { userData: userData, all_batches: app.locals.all_batches });
})


async function creating_batch(req, res, next) {
    console.log("batch year", req.body.batch_year);
    if (req.body.batch_year && req.body.batch_year.localeCompare("NaN") != 0) {
        try {
            var batch_year = parseInt(req.body.batch_year);
            await create_batch(batch_year);
            app.locals.all_batches = await get_batches(auth, protected_data.index_table_id);
            console.log("createBatches : all batches", app.locals.all_batches);
            next();
        } catch (error) {
            console.log("CONTACT THE DEVELOPER");
        }

    } else {
        next();
    }
}


app.listen(port, () => {
    console.log(`this log is working on ${port}`);
});