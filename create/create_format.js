const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const get_file_ids = require('../functions/get_file_ids');
const {student_achievements_folder_id, all_departments} = require('../auth/protected_data');


function create_spread_sheet(drive, folderId, year)
{
    return new Promise((resolve, reject) => {

        var fileMetadata = {
            name: `batch-${year}-${year+4}`,
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
                console.log('Created File Id: ', file.data.id);
                resolve(file.data.id);
            }
        });
    });
}


function get_sheet1_general_format_requests()
{
    return new Promise((resolve, reject) => {

        var headers = ["USN", "Name", "Bmsce Mail", "Phone Number"];
        var values = [];

        for(let header of headers)
        {
            values.push({
                userEnteredValue: {
                    stringValue: header,
                }
            });
        }

        var requests = [{
            appendCells : {
                sheetId: 0,
                rows : [
                    {
                        values : values //only one row with values = values
                    }
                ],
                fields: "*"
            }
        }];

        requests.push({             // to add student in 1000 + usn row and then sort and add meta data
            appendDimension: {
                sheetId: 0,
                dimension: "ROWS",
                length: 1000
            }
        })

        resolve(requests);
        
    });
}


function get_add_year_sheets_requests()
{
    return new Promise((resolve, reject) => {

        var requests = [];

        for(let i = 1; i <= 4; ++i)
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

        resolve(requests);
    });
}


function get_year_sheets_general_format_requests()
{
    return new Promise((resolve, reject) => {
        
        var headers = [
            "USN",
            "Name",
            "Bmsce Mail",
            "Name of Event",
            "Details or Location of Event",
            "Level",
            "Award"
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

        var requests = [];

        for(let i = 1; i <= 4; ++i)
        {
            requests.push({
                appendCells : {
                    sheetId: i,
                    rows : [
                        {
                            values : values //only one row with values = values
                        }
                    ],
                    fields: "*"
                }
            })
        }

        resolve(requests);

    });
}


function isBatchPresent(auth, folderId, year)
{
    return new Promise(async (resolve, reject) =>{

        var batch = `batch-${year}-${year+4}`;
        var files = await get_file_ids(auth, folderId, [batch]);
        if(files[batch])
            resolve(true);
        else
            resolve(false);

    });
}


function create_new_batch(sheets, spreadsheetId)
{
    return new Promise(async (resolve, reject) =>{

        // var spreadsheetId = await create_spread_sheet(drive, folderId, year) removing it from here and doing this separately and sequentially first and then doing the sheet general format using batch requests
        
        var requests = [];
        var requests1 = await get_sheet1_general_format_requests();
        var requests2 = await get_add_year_sheets_requests();
        var requests3 = await get_year_sheets_general_format_requests();
        requests.push(...requests1, ...requests2, ...requests3);

        const resource = {requests};
        
        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("made general format : ", spreadsheetId);
                resolve(`made general format ${spreadsheetId}`);
            }
        });

    });
}


async function main(year)
{
    const folderId = student_achievements_folder_id;
    const departments = all_departments;
    
    const drive = google.drive({version: 'v3', auth});
    const sheets = google.sheets({version: 'v4', auth});
    
    const department_ids = await get_file_ids(auth, folderId, departments);
    
    var isPresent = await isBatchPresent(auth, department_ids["CE"], year); // if it is there in the first department then it is there in every department

    if(isPresent == true)
    {
        console.log("batch already present");
        return;
    }

    var spreadsheetIds = [];
    for(let department of departments) // creating all the spreadsheets first as this has to done sequentially and slowly because of user rate limit exceeded
    {
        let spreadsheetId = await create_spread_sheet(drive, department_ids[department], year);
        spreadsheetIds.push(spreadsheetId);
    }

    var promises = [];
    for(let spreadsheetId of spreadsheetIds)
    {
        //await create_new_batch(drive, sheets, department_ids[department], year);
        var promise = create_new_batch(sheets, spreadsheetId);
        promises.push(promise);
    }
    await Promise.all(promises);

    console.log("Done with all Departments");
}

main(2018);