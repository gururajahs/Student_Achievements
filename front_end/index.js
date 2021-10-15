const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const add_data = require('../data_collectors/add_data');

const port = 5200;
const app = express();
var auth;
var spreadsheetId;
var userData = {
    usn: null,
    name: null,
    email: null,
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

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, async () => {
    console.log(`this log is working on ${port}`);
    auth = await get_auth();
});