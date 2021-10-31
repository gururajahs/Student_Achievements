const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const get_spreadsheetId = require('../functions/get_spreadsheet_id');
const get_sort_sheet_requests = require('./get_sort_sheet_requests');


function get_add_user_data_requests(userData, row_no, sheetId)
{
    return new Promise((resolve, reject) => {

        var data = [
            userData.usn,
            userData.name,
            userData.email,
            userData.phone
        ];
        var values = [];

        for(let ele of data)
        {
            values.push({
                userEnteredValue: {
                    stringValue: ele,
                }
            });
        }

        var requests = [];

        requests.push({
            updateCells : {
                rows : [
                    {
                        values : values //only one row with values = values
                    }
                ],
                fields: "*",
                start : {
                    sheetId: sheetId,
                    rowIndex: row_no - 1,
                    columnIndex: 0
                }
            }
        });

        requests.push({
            createDeveloperMetadata: {
                developerMetadata: {
                    visibility: "PROJECT",
                    metadataKey: userData.email,
                    location: {
                        dimensionRange: {
                            sheetId: sheetId,
                            dimension: "ROWS",
                            startIndex: row_no - 1,
                            endIndex: row_no
                        }
                    }
                }
            }
        });

        resolve(requests);
        
    });
}

//function add_user(userData)
module.exports = (userData) =>
{
    return new Promise(async (resolve, reject) => {

        // const spreadsheetId = await get_spreadsheetId(auth, userData.department, userData.batch);
        const usn_no = userData.usn.match(/\d{3}$/);
        const row_no = 1000 + parseInt(usn_no); // 1000 because before ones shouldn't get disturbed
        const sheetId = 0;

        var requests = [];
        var requests1 = await get_add_user_data_requests(userData, row_no, sheetId);
        var requests2 = await get_sort_sheet_requests(sheetId);
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
                //console.log(result.data.replies[1].createDeveloperMetadata.developerMetadata);
                console.log("added user");
                resolve("added user");
            }
        });
    });
    
}

// var userData = {
//     usn: "1BM19IS120",
//     name: "Preethi V Hiremath",
//     email: "preethiv.is19@bmsce.ac.in",
//     phone: "1234567890",
//     department: "IS",
//     batch: "batch-2019-2023",
// };

// async function main()
// {
//     await add_user(userData);
// }

// main();