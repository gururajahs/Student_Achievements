const {google} = require('googleapis');
const get_auth = require('./get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');

module.exports = (auth, spreadsheetId, userData) => {
//function append_year_data(auth, spreadsheetId, userData) {

    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});

        let values = [
            [
                userData.usn,
                userData.name,
                userData.email,
                userData.nameOfEvent,
                userData.detailsOfEvent,
                userData.level,//"Level(state/national/international)",
                userData.award//"Award/Price"
            ]
        ];
        var range = `year${userData.year}!A:G`;
        const resource = {
            values,
        };
        var valueInputOption = "RAW";
        
        sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`year${userData.year} sheet updated`);
                resolve(`year${userData.year} sheet updated`);
            }
        });

    });
}


// async function main(userData)
// {
//     const auth = await get_auth();
//     const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
//     await append_year_data(auth, spreadsheetId, userData);
// }

// var userData = {
//     usn: 48,
//     department_id: "1HkK1ea1gAKUbSs7EexCKHOoBCfLOwKjc",
//     batch: 2018,
//     name: "Deven Prakash Paramaj",
//     email: "devenparamaj.is19@bmsce.ac.in",
//     nameOfEvent: "ab",
//     detailsOfEvent: "cd",
//     level: "ef",//"Level(state/national/international)",
//     award: "fgi",
//     year: 2,
// };

// main(userData);