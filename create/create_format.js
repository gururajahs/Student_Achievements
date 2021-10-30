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
                //console.log('File Id: ', file.data.id);
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


function create_new_batch(drive, sheets, folderId, year)
{
    return new Promise(async (resolve, reject) =>{

        var spreadsheetId = await create_spread_sheet(drive, folderId, year)
        
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
                console.log("created : ", folderId);
                resolve(`created ${folderId}`);
            }
        });

    });
}

function sleep_s(sec)
{
    return new Promise((resolve, reject) => {
        console.log("waiting");
        setTimeout(resolve, sec * 1000);
    });
}

function print_started()
{
    return new Promise((resolve, reject) => {
        console.log("started");
        resolve("started");
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

    var promises = [];
    for(let department of departments)
    {
        //await create_new_batch(drive, sheets, department_ids[department], year);
        var promise = create_new_batch(drive, sheets, department_ids[department], year);
        promises.push(promise);
    }

    //promises.push(sleep(15));
    // for(let i = 0; i < 7; ++i)
    //     await Promise.all(promises.slice(i*promises.length/7, (i+1)*promises.length/7));
    // await sleep_for_60s();
    var promises1 = promises.slice(0, 7);
    promises1.push(print_started());
    var promises2 = promises.slice(7, promises.length);
    promises2.push(print_started());
    await Promise.all(promises1);
    console.log("here1");
    await sleep_s(15);
    console.log("here2");
    await Promise.all(promises2);
    console.log("here3");

    console.log("Done with all Departments");
}

main(2019);