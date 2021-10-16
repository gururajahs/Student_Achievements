const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const {student_achievements_folder_id, all_departments} = require('../auth/protected_data');

function create_spread_sheet(drive, folderId, year)
{
    return new Promise((resolve, reject) => {

        var fileMetadata = {
            'name': `batch-${year}-${year+4}`,
            'mimeType': 'application/vnd.google-apps.spreadsheet',
            parents: [folderId]
        };

        drive.files.create({
            resource: fileMetadata,
            fields: "id"
        }, function (err, file) {
            if (err) {
                console.error(err);
            } else {
                console.log('File Id: ', file.data.id);
                resolve(file.data.id);
            }
        });
    });
}

function make_sheet1_general_format(sheets, spreadsheetId)
{
    return new Promise((resolve, reject) => {

        let values = [
            [
                "USN",
                "Name",
                "Bmsce Mail Id",
                "Phone No.",
                "year1",
                "year2",
                "year3",
                "year4"
            ],
            ["=SEQUENCE(999)"]
        ];
        var range = "Sheet1!A1:H2";
        const resource = {
            values,
        };
        var valueInputOption = "USER_ENTERED";
        sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                resolve("sheet 1 updated");
            }
        });

    });
}

function addSheets(sheets, spreadsheetId)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        for(i = 1; i <=4; ++i)
        {
            requests.push({
                addSheet: { 
                    properties:{
                        sheetId: i,
                        title: `year${i}`
                    }
                },
            });
        }

        const batchUpdateRequest = {requests};

        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: batchUpdateRequest,
        }, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                resolve("year sheets added");
            }
        });
    });
}

function make_year_sheets_general_format(sheets, spreadsheetId)
{
    return new Promise((resolve, reject) => {
        
        let values = [
            [
                "USN",
                "Name",
                "Bmsce Mail Id",
                "Name of Event",
                "Details/Place of Event",
                "Level", //(college/state/national/international)
                "Award/Prize"
            ]
        ];

        for(i = 1; i <= 4; ++i)
        {
            var range = `year${i}!A1:G1`;
            const resource = {
                values,
            };
            var valueInputOption = "USER_ENTERED";
            sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption,
                resource,
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(`year${i} sheet added`);
                }
            });
        }

    });
}


async function isBatchPresent(drive, folderId, year) {

    return new Promise((resolve, reject) =>{

        var batch = `batch-${year}-${year+4}`;
        var pageToken = null;

        do{
            drive.files.list({
                q: `'${folderId}' in parents`,
                fields: 'nextPageToken, files(name)',
                pageToken: pageToken
            }, function (err, res) {
                if (err) {
                    console.error(err);
                } else {
                    var files = res.data.files;
                    var file = files.find((file) =>  file.name == batch );

                    if(file && file.name == batch)
                        resolve(true);

                    pageToken = res.nextPageToken;

                    if(pageToken == null)
                        resolve(false);
                }
            });
        }while(pageToken != null);
    });
        
}

async function create_new_batch(drive, sheets, folderId, year)
{
    var spreadsheetId = await create_spread_sheet(drive, folderId, year)
    await make_sheet1_general_format(sheets, spreadsheetId);
    await addSheets(sheets, spreadsheetId);
    await make_year_sheets_general_format(sheets, spreadsheetId);
    console.log("done : ", folderId);
}


function get_department_folder_ids(drive, folderId)
{
    return new Promise((resolve, reject) =>{

        var pageToken = null;
        department_ids = {};

        do{
            drive.files.list({
                q: `'${folderId}' in parents`,
                fields: 'nextPageToken, files(name, id)',
                pageToken: pageToken
            }, function (err, res) {
                if (err) {
                    console.error(err);
                } else {
                    var files = res.data.files;
                    for(let file of files)
                    {
                        department_ids[file.name] = file.id;
                    }

                    pageToken = res.nextPageToken;

                    if(pageToken == null)
                        resolve(department_ids);
                }
            });
        }while(pageToken != null);
    });
}


async function main(year)
{
    const folderId = student_achievements_folder_id;
    const departments = all_departments;
    
    const drive = google.drive({version: 'v3', auth});
    const sheets = google.sheets({version: 'v4', auth});
    
    const department_ids = await get_department_folder_ids(drive, folderId);
    
    var isPresent = await isBatchPresent(drive, department_ids["CE"], year); // if it is there in the first department then it is there in every department

    if(isPresent == true)
    {
        console.log("batch already present");
        return;
    }

    for(let department of departments)
    {
        create_new_batch(drive, sheets, department_ids[department], year) // not using await here coz they are not dependent on each other and can execute separately
    }
}

main(2018);