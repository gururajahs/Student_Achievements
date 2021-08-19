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
                // Handle error
                console.log(err);
            } else {
                //const numRows = result.values ? result.values.length : 0;
                //console.log(`${numRows} rows retrieved.`);
                console.log(result.data.values);
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
        
        sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        }, (err, result) => {
            if (err) {
              // Handle error.
                console.log(err);
            } else {
                //console.log(`${result.updates.updatedCells} cells appended.`);
                resolve("sheet 2 updated");
            }
        });

    });
}

//module.exports = (auth, spreadsheetId, userData) => {
function set_sheet1_data(auth, spreadsheetId, userData) {

    return new Promise(async (resolve, reject) => {

        var oldData = await get_sheet1_data(auth, spreadsheetId, userData.usn);

        if(userData.year1 && (userData.year1 == 'yes' || oldData[3] == 'yes'))
            userData.year1 = "yes";
        if(userData.year2 && (userData.year2 == 'yes' || oldData[4] == 'yes'))
            userData.year2 = "yes";
        if(userData.year3 && (userData.year3 == 'yes' || oldData[5] == 'yes'))
            userData.year3 = "yes";
        if(userData.year4 && (userData.year4 == 'yes' || oldData[6] == 'yes'))
            userData.year4 = "yes";

        await set_sheet1_data(auth, spreadsheetId, userData);
    
    });

}

async function main()
{
    const auth = await get_auth();
    const spreadsheetId = await get_spreadsheetId(auth, 2019);
    var userData = {
        usn: 21,
        name: "Deven Prakash Paramaj1",
        email: "devenparamaj@bmsce.ac.in",
        year1: "yes",
        year2: "no",
        year3: null,
        year4: "no",

    };

    var oldData = await get_sheet1_data(auth, spreadsheetId, userData.usn);

    if(userData.year1 && (userData.year1 == 'yes' || oldData[3] == 'yes'))
        userData.year1 = "yes";
    if(userData.year2 && (userData.year2 == 'yes' || oldData[4] == 'yes'))
        userData.year2 = "yes";
    if(userData.year3 && (userData.year3 == 'yes' || oldData[5] == 'yes'))
        userData.year3 = "yes";
    if(userData.year4 && (userData.year4 == 'yes' || oldData[6] == 'yes'))
        userData.year4 = "yes";

    await set_sheet1_data(auth, spreadsheetId, userData);
    

}

main();