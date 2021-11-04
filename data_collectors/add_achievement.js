const {google} = require('googleapis');
const get_add_year_data_requests = require('./get_add_year_data_requests');
const get_sort_sheet_requests = require('./get_sort_sheet_requests');

function add_achievement(auth, userData) {

    return new Promise(async (resolve, reject) => {

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
                //console.log("added achievement");
                resolve("added achievement");
            }
        });
        
    });
}

module.exports = add_achievement;

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

// add_achievment(userData);