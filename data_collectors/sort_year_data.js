const {google} = require('googleapis');
const get_auth = require('./get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');

module.exports = (auth, spreadsheetId, sheet_id) => {
//function sort(auth, spreadsheetId, sheet_id) {

    return new Promise((resolve, reject) => {

        const sheets = google.sheets({version: 'v4', auth});
        let requests = [];

        requests.push({
            sortRange: {
                range: {
                    sheetId: sheet_id, // added sheetId as properties in create format
                    startRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 10
                },
                sortSpecs: [
                    {
                        dimensionIndex: 0, // sort with respect to usn
                        sortOrder: "ASCENDING",
                    }
                ]
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
                console.log("sorted");
                resolve("sorted");
            }
        });

    });
}

// async function main()
// {
//     const auth = await get_auth();
//     const spreadsheetId = await get_spreadsheetId(auth, "1HkK1ea1gAKUbSs7EexCKHOoBCfLOwKjc", 2018);
//     await sort(auth, spreadsheetId, 1);
// }

// main();