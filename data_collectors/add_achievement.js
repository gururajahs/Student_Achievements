const {google} = require('googleapis');
const auth = require('../auth/get_auth');
const get_add_year_data_requests = require('./get_add_year_data_requests');
const get_sort_sheet_requests = require('./get_sort_sheet_requests');

module.exports = (userData) => {
//async function main(userData) {

    return new Promise(async (resolve, reject) => {

        //const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
        var requests = [];
        var requests1 = await get_add_year_data_requests(userData);
        var requests2 = await get_sort_sheet_requests(userData.yearOfAchievement);
        requests.push(...requests1, ...requests2);

        const resource = {requests};

        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.batchUpdate({
            spreadsheetId : userData.spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("added achievement");
                resolve("added achievement");
            }
        });
        
    });
}



// var userData = {
//     usn: "1BM19IS048",
//     name: "Deven Prakash Paramaj",
//     email: "devenparamaj.is19@bmsce.ac.in",
//     phone: "1234567890",
//     nameOfEvent: "ab",
//     detailsOfEvent: "cd",
//     level: "ef",//"Level(state/national/international)",
//     award: "fg",
//     department_id: "15_R_ddCagj-CFmvFuji3HVvE9UivHxy7",
//     batch: 2019,
//     year: 1,
// };

// main(userData);