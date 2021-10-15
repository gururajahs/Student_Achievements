const {google} = require('googleapis');
const get_auth = require('./get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');

function get_sheet1_data(auth, spreadsheetId, usn)
{
    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});

        const range = `Sheet1!A${usn + 1}:G${usn + 1}`;
        sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(result.data.values);
                resolve(result.data.values[0]);
            }
        });
    });
}

function set_sheet1_data(auth, spreadsheetId, userData) {

    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});

        let values = [
            [
                //userData.usn,
                userData.name,
                userData.email,
                userData.year1,
                userData.year2,
                userData.year3,
                userData.year4
            ]
        ];

        var range = `Sheet1!B${userData.usn + 1}:G${userData.usn + 1}`;
        const resource = {
            values,
        };
        var valueInputOption = "RAW";
        
        sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Sheet 1 updated");
                resolve("sheet 1 updated");
            }
        });

    });
}

module.exports = (auth, spreadsheetId, userData) => {
//function add_achievement_count(auth, spreadsheetId, userData) {

    return new Promise(async (resolve, reject) => {

        var oldData = await get_sheet1_data(auth, spreadsheetId, userData.usn);

        if(userData.year < 1 || userData.year > 4)
            reject();

        for(i = 3; i <= 6; ++i)
            if(!oldData[i])
                oldData[i] = 0

        oldData[2 + userData.year] = parseInt(oldData[2 + userData.year])
        oldData[2 + userData.year] += 1

        userData.year1 = parseInt(oldData[3])
        userData.year2 = parseInt(oldData[4])
        userData.year3 = parseInt(oldData[5])
        userData.year4 = parseInt(oldData[6])

        await set_sheet1_data(auth, spreadsheetId, userData);
    
    });

}

// async function main(userData)
// {
//     const auth = await get_auth();
//     const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
//     await add_achievement_count(auth, spreadsheetId, userData);
// }

// var userData = {
//     usn: 48,
//     department_id: "1HkK1ea1gAKUbSs7EexCKHOoBCfLOwKjc",
//     batch: 2018,
//     name: "Deven Prakash Paramaj",
//     year: 2,
//     email: "devenparamaj.is19@bmsce.ac.in"
// };

// main(userData);