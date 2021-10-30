const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const get_spreadsheetId = require('./get_spreadsheetId');
const get_sort_sheet_requests = require('./get_sort_sheet_requests');

function get_sheet1_data(auth, spreadsheetId, usn)
{
    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});

        const range = `Sheet1!A${usn + 1}:H${usn + 1}`;
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


        // requests.push({
        //     insertRange: {
        //         range: {
        //             sheetId: sheetId, 
        //             startRowIndex: row_no - 1, 
        //             endRowIndex: row_no, 
        //         },
        //         shiftDimension: "ROWS"
        //     }
        // })


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
                    visibility: "DOCUMENT",
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



function set_sheet1_data(auth, spreadsheetId, userData) {

    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});

        let values = [
            [
                //userData.usn,
                userData.name,
                userData.email,
                userData.phone,
                userData.year1,
                userData.year2,
                userData.year3,
                userData.year4
            ]
        ];

        var range = `Sheet1!B${userData.usn + 1}:H${userData.usn + 1}`;
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

        for(i = 4; i <= 7; ++i)
            if(!oldData[i])
                oldData[i] = 0

        oldData[3 + userData.year] = parseInt(oldData[3 + userData.year])
        oldData[3 + userData.year] += 1

        userData.year1 = parseInt(oldData[4])
        userData.year2 = parseInt(oldData[5])
        userData.year3 = parseInt(oldData[6])
        userData.year4 = parseInt(oldData[7])

        await set_sheet1_data(auth, spreadsheetId, userData);
        resolve("incremented count");
    });

}

// async function main(userData)
// {
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



async function main(userData)
{
    const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
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
        spreadsheetId,
        resource
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result.data.replies[1].createDeveloperMetadata.developerMetadata);
            //resolve("added achievement");
        }
    });
}

var userData = {
    usn: "1BM19IS002",
    name: "Deven Prakash Paramaj",
    email: "devenparamaj2.is19@bmsce.ac.in",
    phone: "1234567890",
    department_id: "1Io4WDim554LnHweEIl8KW9LqaW9W6zJK",
    batch: 2019,
};

main(userData);