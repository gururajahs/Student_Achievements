const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const protected_data = require("../auth/protected_Data.json");
const fs = require('fs');

function create_query_spreadsheet(drive, folderId, email)
{
    return new Promise((resolve, reject) => {

        var fileMetadata = {
            name: email,
            mimeType: 'application/vnd.google-apps.spreadsheet',
            parents: [folderId]
        };

        drive.files.create({
            resource: fileMetadata,
            fields: "id"
        }, function (err, file) {
            if (err) {
                console.error(err);
            } else {
                console.log('File(Folder) Id: ', file.data.id);
                resolve(file.data.id);
            }
        });
    });
}


function get_add_sheets_requests(data)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        var i = 1;
        for(let batch in data)
        {
            requests.push({
                addSheet: { 
                    properties:{
                        sheetId: i,
                        title: batch
                    }
                },
            });
            ++i;
        }

        resolve(requests);
    });
}


function add_data_to_sheet_requests(sheetId, batch_data)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        var rows = [];

        var headers = [
            "USN",
            "Name",
            "Bmsce Mail",
            "Name of Event",
            "Details or Location of Event",
            "Level",
            "Award",
            "Department",
            "Batch",
            "Year Of Achievement"
        ];
        var values = [];

        for(let header of headers)
        {
            values.push({
                userEnteredValue: {
                    stringValue: header,
                }
            });
        }

        rows.push({
            values: values
        });

        for(let achievement of batch_data)
        {
            values = [];
            for(let ele of achievement)
            {
                values.push({
                    userEnteredValue: {
                        stringValue: ele,
                    }
                });
            }
            
            rows.push({
                values: values
            });
        }

        requests.push({
            appendCells : {
                sheetId: sheetId,
                rows : rows,
                fields: "*"
            }
        })

        resolve(requests);

    });
}


function add_all_data_to_spreadsheet_requests(data)
{
    return new Promise(async (resolve, reject) => {

        let i = 1;
        var promises = [];
        for(let batch in data)
        {
            var promise = add_data_to_sheet_requests(i++, data[batch]);
            promises.push(promise);
        }
        var batch_requests = await Promise.all(promises);
        var requests = [];
        for(let request of batch_requests)
            requests.push(...request);

        resolve(requests);

    });
}

function add_data_to_spreadsheet(auth, spreadsheetId, data)
{
    return new Promise(async (resolve, reject) => {
        
        var requests = [];
        var requests1 = await get_add_sheets_requests(data);
        var requests2 = await add_all_data_to_spreadsheet_requests(data);
        requests.push(...requests1, requests2);

        const resource = {requests};
        
        const sheets = google.sheets({version: 'v4', auth});

        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("added data successfully");
                resolve("added data successfully");
            }
        });
    });
}


function delete_query_spreadsheet(drive, spreadsheetId)
{
    return new Promise((resolve, reject) => {

        drive.files.delete({
            fileId : spreadsheetId
        }, function (err, file) {
            if (err) {
                console.error(err);
            } else {
                console.log("spreadsheet deleted");
                resolve("spreadsheet deleted");
            }
        });

    });
}

function download_file(drive, spreadsheetId)
{
    return new Promise((resolve, reject) => {

        var dest = fs.createWriteStream('query.xlsx');
        drive.files.export({
            fileId: spreadsheetId,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }, {responseType: 'stream'}, (error, res) => {
            
            if(error)
            {
                console.log(error);
                reject(error);
            }

            res.data
            .on('error', function (err) {
                console.log('Error during download', err);
                reject("failed to download");
            })
            .on('end', function () {
                console.log('Done');
                resolve("done");
            })
            .pipe(dest)
                
        });

    });
}

function download_achievements(email, data)
{
    return new Promise(async (resolve, reject) => {

        const drive = google.drive({version: 'v3', auth});
        const spreadsheetId = await create_query_spreadsheet(drive, protected_data.student_achievements_folder_id, email);
        //const spreadsheetId = "1YNAEsKxze41xaQjooq-tbDshLTz55vg4aS1itE1ASi8";
        await add_data_to_spreadsheet(auth, spreadsheetId, data);
        await download_file(drive, spreadsheetId);
        await delete_query_spreadsheet(drive, spreadsheetId);
        resolve("query completed");

    });
}

module.exports = download_achievements;

// async function download_achievement(email, data)
// {
//     await process_query(email, data);
// }

var data = {
    '2018-2019': [],
    '2019-2020': [
      [
        '1BM19IS048',
        'Deven Prakash Paramaj',
        'devenparamaj.is19@bmsce.ac.in',   
        'IEEE Event',
        '24 hr hackathon, BSN Hall, Bmsce',
        'international',
        'no',
        'IS',
        'batch-2019-2023',
        '1'
      ],
      [
        '1BM19IS120',
        'Preethi V Hiremath',
        'preethiv.is19@bmsce.ac.in',
        'HackerRank Challenges/Competition',
        'Bleh',
        'international',
        'yes',
        'IS',
        'batch-2019-2023',
        '1'
      ]
    ],
    '2020-2021': [
      [
        '1BM19IS048',
        'Deven Prakash Paramaj',
        'devenparamaj.is19@bmsce.ac.in',
        'IEEE Event',
        'ADFAS',
        'international',
        'no',
        'IS',
        'batch-2019-2023',
        '2'
      ],
      [
        '1BM19IS120',
        'Preethi V Hiremath',
        'preethiv.is19@bmsce.ac.in',
        'Quiz Competition',
        'Awesome Quiz',
        'college',
        'no',
        'IS',
        'batch-2019-2023',
        '2'
      ]
    ],
    '2021-2022': [
      [
        '1BM19IS120',
        'Preethi V Hiremath',
        'preethiv.is19@bmsce.ac.in',
        'Other',
        'PhaseShift - logomania coordinator',
        'college',
        'no',
        'IS',
        'batch-2019-2023',
        '3'
      ]
    ]
};

//download_achievement("devenparamaj.is19@bmsce.ac.in", data);