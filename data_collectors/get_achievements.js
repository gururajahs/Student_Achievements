const {google} = require('googleapis');
const auth = require('../auth/get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');

function add_sheet_to_get_achievements(sheets, spreadsheetId, userData)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            addSheet: { 
                properties:{
                    sheetId: userData.usn+userData.batch,
                    title: userData.email
                }
            },
        });

        const batchUpdateRequest = {requests};

        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: batchUpdateRequest,
        }, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                console.log("sheet added");
                resolve("added Sheet to_get_achievements");
            }
        });
    });
}

function delete_sheet_of_achievemets(sheets, spreadsheetId, userData)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            deleteSheet: {
                sheetId: userData.usn+userData.batch
            },
        })

        const batchUpdateRequest = {requests};

        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: batchUpdateRequest,
        }, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                console.log("deleted sheet");
                resolve("delete sheet of achievements");
            }
        });
    });
}


function get_achievement_of_year_by_filter(sheets, spreadsheetId, userData) {

    return new Promise((resolve, reject) => {

        let values = [
            [
                `=FILTER(year1!A:G, year1!A:A=${userData.usn})`, null, null, null, null, null, null,
                `=FILTER(year2!A:G, year2!A:A=${userData.usn})`, null, null, null, null, null, null,
                `=FILTER(year3!A:G, year3!A:A=${userData.usn})`, null, null, null, null, null, null,
                `=FILTER(year4!A:G, year4!A:A=${userData.usn})`
            ]
        ];

        var range = `${userData.email}!A:G`;
        const resource = {
            values,
        };
        var valueInputOption = "USER_ENTERED";
        
        sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("year filter added");
                resolve("year filter added");
            }
        });

    });
}

function get_achievements(sheets, spreadsheetId, userData)
{
    return new Promise((resolve, reject) => {
        var ranges = [`${userData.email}!A:G`,`${userData.email}!H:N`,`${userData.email}!O:U`,`${userData.email}!V:AB`];
        sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("got all achievements");
                data = {};
                for(let i = 0; i < 4; ++i)
                    data[`year${i+1}`] = result.data.valueRanges[i].values;
                resolve(data);
            }
        });
    });
}

// var userData = {
//     usn: 48,
//     name: "Deven Prakash Paramaj",
//     email: "devenparamaj.is19@bmsce.ac.in",
//     phone: "1234567890",
//     nameOfEvent: "ab",
//     detailsOfEvent: "cd",
//     level: "ef",//"Level(state/national/international)",
//     award: "fg",
//     department_id: "1s0xIu0UaUhwwRVsOybSz4CyM514u9sA0",
//     batch: 2018,
//     year: 1,
// };





module.exports = (userData) => {
//async function main() {
    
    return new Promise(async (resolve, reject) => {

        const sheets = google.sheets({version: 'v4', auth});
        const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
        await add_sheet_to_get_achievements(sheets, spreadsheetId, userData);
        await get_achievement_of_year_by_filter(sheets, spreadsheetId, userData);
        const data = await get_achievements(sheets, spreadsheetId, userData);
        await delete_sheet_of_achievemets(sheets, spreadsheetId, userData);
        //console.log(data, "final data");
        resolve(data);
        
    });

}

//main()