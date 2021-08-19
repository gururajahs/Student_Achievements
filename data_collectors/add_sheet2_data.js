const {google} = require('googleapis');
const get_auth = require('./get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');

//module.exports = (auth, spreadsheetId, userData) => {
function add_sheet2_data(auth, spreadsheetId, userData) {

    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});

        let values = [
            [
                userData.usn,
                userData.name,
                userData.email,
                userData.year,
                userData.nameOfActivity,
                userData.detailsOfActivity,
                userData.placeHeld,//place where it was held
                userData.level,//"Level(state/national/international)",
                userData.award//"Award/Price"
            ]
        ];
        var range = "Sheet2!A:I";
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


async function main()
{
    const auth = await get_auth();
    const spreadsheetId = await get_spreadsheetId(auth, 2019);
    var userData = {
        usn: 21,
        name: "Deven Prakash Paramaj1",
        email: "devenparamaj@bmsce.ac.in",
        year: "year1",
        nameOfActivity: "ab",
        detailsOfActivity: "cd",
        placeHeld: "de",//place where it was held
        level: "ef",//"Level(state/national/international)",
        award: "fg"

    };

    await add_sheet2_data(auth, spreadsheetId, userData);

}

main();