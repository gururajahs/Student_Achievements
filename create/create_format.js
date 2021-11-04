const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const get_department_ids = require('../functions/get_department_ids');
const protected_data = require("../auth/protected_Data.json");
const isBatchPresent = require("../functions/isBatchPresent");


function create_spread_sheet(drive, folderId, batch)
{
    return new Promise((resolve, reject) => {

        var fileMetadata = {
            name: batch,
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

function make_batch_general_format(sheets, spreadsheetId)
{
    return new Promise(async (resolve, reject) =>{

        // var spreadsheetId = await create_spread_sheet(drive, folderId, year) removing it from here and doing this separately and so that i can add the spreadsheetids to index table in a batch request
        
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


function get_no_of_batches(sheets, spreadsheetId)
{
    return new Promise(async (resolve, reject) =>{

        var request = {
            dataFilters: [{
                developerMetadataLookup: {
                    metadataKey: "no_of_batches",
                    visibility: "PROJECT",
                    metadataLocation: {
                        spreadsheet: true
                    }
                }
            }]
        };

        const resource = request;

        sheets.spreadsheets.developerMetadata.search({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var no_of_batches = parseInt(result.data.matchedDeveloperMetadata[0].developerMetadata.metadataValue);
                console.log(no_of_batches);
                resolve(no_of_batches);
            }
        });

    });
}


function get_update_no_of_batches_request(no_of_batches)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            updateDeveloperMetadata : {
                dataFilters: [{
                    developerMetadataLookup: {
                        metadataKey: "no_of_batches",
                        visibility: "PROJECT",
                        metadataLocation: {
                            spreadsheet: true
                        }
                    }
                }],
                developerMetadata: {
                    visibility: "PROJECT",
                    metadataKey: "no_of_batches",
                    metadataValue: `${no_of_batches + 1}`, // it is string type, convert it to int before calculation
                    location: {
                        spreadsheet: true,
                    }
                },
                fields: "*"
            }
        });

        resolve(requests);
    });
}


function get_add_batch_to_index_table_requests(sheets, spreadsheetId, departments, spreadsheetIds, batch)
{
    return new Promise(async (resolve, reject) => {

        var no_of_batches = await get_no_of_batches(sheets, spreadsheetId);
        var startRowIndex = no_of_batches;

        var requests = [];

        for(let i in departments)
        {
            requests.push({
                appendCells : {
                    sheetId: parseInt(i)+1,
                    rows : [
                        {
                            values : [
                                {
                                    userEnteredValue: {
                                        stringValue: batch,
                                    }
                                },
                                {
                                    userEnteredValue: {
                                        stringValue: spreadsheetIds[i],
                                    }
                                }
                            ]
                        }
                    ],
                    fields: "*"
                }
            });
        }


        for(let i in departments)
        {
            requests.push({
                createDeveloperMetadata: {
                    developerMetadata: {
                        visibility: "PROJECT",
                        metadataKey: batch,
                        metadataValue: spreadsheetIds[i],
                        location: {
                            dimensionRange: {
                                sheetId: parseInt(i) + 1,
                                dimension: "ROWS",
                                startIndex: startRowIndex,
                                endIndex: startRowIndex + 1
                            }
                        }
                    }
                }
            });
        }

        var requests1 = await get_update_no_of_batches_request(no_of_batches);
        requests.push(...requests1);

        resolve(requests);
        
    });
}

function add_batch_to_index_table(sheets, spreadsheetId, departments, spreadsheetIds, batch)
{
    return new Promise(async (resolve, reject) => {

        var requests = await get_add_batch_to_index_table_requests(sheets, spreadsheetId, departments, spreadsheetIds, batch);

        const resource = {requests};
        
        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("added batch to index table");
                resolve("added batch to index table");
            }
        });

    });
}

function create_batch_for_all_departments(sheets, batch)
{
    return new Promise(async (resolve, reject) => {

        const drive = google.drive({version: 'v3', auth});

        const departments = protected_data.all_departments;
        const department_ids = await get_department_ids(auth, protected_data.index_table_id);

        var promises = [];
        for(let department of departments) // creating all the spreadsheets first as this has to done sequentially and slowly because of user rate limit exceeded
        {
            let promise = create_spread_sheet(drive, department_ids[department], batch);
            promises.push(promise);
        }
        var spreadsheetIds = await Promise.all(promises);

        await add_batch_to_index_table(sheets, protected_data.index_table_id, departments, spreadsheetIds, batch);

        resolve(spreadsheetIds);

    });
}


async function main(year)
{   
    const sheets = google.sheets({version: 'v4', auth});

    var batch = `batch-${year}-${year+4}`;
    
    var isPresent = await isBatchPresent(auth, protected_data.index_table_id, batch);

    if(isPresent == true)
    {
        console.log("batch already present");
        return;
    }

    var spreadsheetIds = await create_batch_for_all_departments(sheets, batch);

    var promises = [];
    for(let spreadsheetId of spreadsheetIds)
    {
        let promise = make_batch_general_format(sheets, spreadsheetId);
        promises.push(promise);
    }
    await Promise.all(promises);

    console.log("Done with all Departments");
}

main(2019);