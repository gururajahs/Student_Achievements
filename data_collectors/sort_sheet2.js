const {google} = require('googleapis');
const get_auth = require('./get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');

//module.exports = (auth, spreadsheetId) => {
function sort(auth, spreadsheetId) {

    return new Promise((resolve, reject) => {

        const sheets = google.sheets({version: 'v4', auth});
    
        let requests = [];
        // Change the spreadsheet's title.
        requests.push({
            sortRange: {
                range: {
                    sheetId: 1,//sheet2 (added sheetId as properties in create format)
                    startRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 10
                },
                sortSpecs: [
                    {
                        dimensionIndex: 0,//sort with respect to usn
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
                    // Handle error
                    console.log(err);
                } else {
                    console.log("sorted");
                    resolve("sorted");
                }
        });
    });
}

async function main()
{
    const auth = await get_auth();
    const spreadsheetId = await get_spreadsheetId(auth, 2019);
    await sort(auth, spreadsheetId);
}

main();