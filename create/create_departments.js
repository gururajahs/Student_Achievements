const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const global_data = require("../auth/global_data");

function create_folder(drive, folderId, foldername)
{
    return new Promise((resolve, reject) => {

        var fileMetadata = {
            name: foldername,
            mimeType: 'application/vnd.google-apps.folder',
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


function get_add_departments_to_index_table_requests(sheetId, departments, department_ids)
{
    return new Promise((resolve, reject) => {

        var rows = [];
        for(let i in departments)
        {
            rows.push({
                values : [
                    {
                        userEnteredValue: {
                            stringValue: departments[i],
                        }
                    },
                    {
                        userEnteredValue: {
                            stringValue: department_ids[i],
                        }
                    }
                ]
            })
        }

        var requests = [{
            updateCells : {
                range : {
                    sheetId: sheetId,
                    startColumnIndex: 0, 
                    endColumnIndex: 2
                },
                rows : rows,
                fields: "*"
            }
        }];


        for(let i in departments)
        {
            requests.push({
                createDeveloperMetadata: {
                    developerMetadata: {
                        visibility: "PROJECT",
                        metadataKey: departments[i],
                        metadataValue: department_ids[i],
                        location: {
                            dimensionRange: {
                                sheetId: sheetId,
                                dimension: "ROWS",
                                startIndex: parseInt(i),
                                endIndex: parseInt(i)+1
                            }
                        }
                    }
                }
            });
        }

        resolve(requests);
        
    });
}

function get_add_department_sheets_requests(departments)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        for(let i in departments)
        {
            requests.push({
                addSheet: { 
                    properties:{
                        sheetId: parseInt(i)+1,
                        title: departments[i]
                    }
                },
            });
        }

        resolve(requests);
    });
}

function get_add_no_of_batches_metadata_request()
{
    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            createDeveloperMetadata: {
                developerMetadata: {
                    visibility: "PROJECT",
                    metadataKey: "no_of_batches",
                    metadataValue: "0", // it is string type, convert it to int before calculation
                    location: {
                        spreadsheet: true,
                    }
                }
            }
        });

        resolve(requests);
        
    });
}


function get_add_Certificates_folder_to_index_table_requests(sheetId, certificates_foldername, certificates_folder_id, row_index)
{
    return new Promise((resolve, reject) => {

        var requests = [{
            appendCells : {
                sheetId: sheetId,
                rows : [
                    {
                        values : [
                            {
                                userEnteredValue: {
                                    stringValue: certificates_foldername,
                                }
                            },
                            {
                                userEnteredValue: {
                                    stringValue: certificates_folder_id,
                                }
                            }
                        ]
                    }
                ],
                fields: "*"
            }
        }];


        requests.push({
            createDeveloperMetadata: {
                developerMetadata: {
                    visibility: "PROJECT",
                    metadataKey: certificates_foldername,
                    metadataValue: certificates_folder_id,
                    location: {
                        dimensionRange: {
                            sheetId: sheetId,
                            dimension: "ROWS",
                            startIndex: row_index,
                            endIndex: row_index+1
                        }
                    }
                }
            }
        });

        resolve(requests);
        
    });
}


function add_folders_to_index_table(spreadsheetId, departments, department_ids, certificate_foldername, certificates_folder_id)
{
    return new Promise(async (resolve, reject) => {
        
        var sheetId = 0;
        var requests = await get_add_departments_to_index_table_requests(sheetId, departments, department_ids);
        var requests1 = await get_add_department_sheets_requests(departments);
        var requests2 = await get_add_no_of_batches_metadata_request();
        var requests3 = await get_add_Certificates_folder_to_index_table_requests(sheetId, certificate_foldername, certificates_folder_id, parseInt(departments.length));
        requests.push(...requests1, ...requests2, ...requests3);

        const resource = {requests};

        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("added to index table");
                resolve("added to index table");
            }
        });
    });
}

async function main()
{ 
    const folderId = global_data.student_achievements_folder_id;
    const departments = global_data.all_departments;
    const drive = google.drive({version: 'v3', auth});

    var promises = [];
    for(let department of departments)
    {
        var promise = create_folder(drive, folderId, department);
        promises.push(promise);
    }
    var certificate_foldername = "Certificates";
    var promise = create_folder(drive, folderId, certificate_foldername);
    promises.push(promise);

    const folder_ids = await Promise.all(promises);
    const department_folder_ids = folder_ids.slice(0, -1);
    const certificates_folder_id = folder_ids[folder_ids.length-1];

    await add_folders_to_index_table(global_data.index_table_id, departments, department_folder_ids, certificate_foldername, certificates_folder_id);
}

main();