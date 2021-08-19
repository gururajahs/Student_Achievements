const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const get_auth = require('../data_collectors/get_auth');
const get_spreadsheetId = require('../data_collectors/get_spreadsheetId');
const add_sheet1_data = require('../data_collectors/add_sheet1_data');
const add_sheet2_data = require('../data_collectors/add_sheet2_data');
const sort_sheet2 = require('../data_collectors/sort_sheet2');

const port = 5200;
const app = express();
var auth;
var spreadsheetId;
var userData = {
    usn: null,
    name: null,
    email: null,
    year: null,
    nameOfActivity: null,
    detailsOfActivity: null,
    placeHeld: null,
    level: null,
    award: null,
    year1: null,
    year2: null,
    year3: null,
    year4: null
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, async () => {
    console.log(`this log is working on ${port}`);
    auth = await get_auth();
});