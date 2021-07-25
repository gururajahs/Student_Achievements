const {google, containeranalysis_v1alpha1} = require('googleapis');
const get_auth = require("./get_auth");

function create_spread_sheet(drive, year)
{
    return new Promise((resolve, reject) => {
        const folderId = '1-9FENR7DWRuNF3oJ2T-wGbFDo56YP2Am';//folder is fixed
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
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
            resolve(file.data.id);
        }
        });
    });
}

function make_sheet1_general_format(sheets, spreadsheetId, year)
{
    return new Promise((resolve, reject) => {

        //var year = 2019;
        let values = [
            [
                "USN",
                "Name",
                "Bmsce Mail Id",
                `${year}`,
                `${year+1}`,
                `${year+2}`,
                `${year+3}`
            ],
            ["=SEQUENCE(300)"]
        ];
        var range = "Sheet1!A1:G2";
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
                // Handle error
                console.log(err);
            } else {
                //console.log('%d cells updated.', result.updatedCells);
                resolve("sheet 1 updated");
            }
        });

    });
}

function addSheet(sheets, spreadsheetId)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            addSheet: { },
        });

        const batchUpdateRequest = {requests};

        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: batchUpdateRequest,
        }, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(response);
                resolve("sheet 2 added");
            }
        });
    });
}


function make_sheet2_general_format(sheets, spreadsheetId)
{
    return new Promise((resolve, reject) => {
        
        let values = [
            [
                "USN",
                "Name",
                "Bmsce Mail Id",
                "year",
                "Name of Activity",
                "Details of Activity",
                "Place where the activity was held",
                "Level(state/national/international)",
                "Award/Price"
            ]
        ];
        var range = "Sheet2!A1:I1";
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
                // Handle error
                console.log(err);
            } else {
                //console.log('%d cells updated.', result.updatedCells);
                resolve("sheet 2 updated");
            }
        });

    });
}


async function isBatchPresent(drive, year) {

    //const drive = google.drive({version: 'v3', auth});
    const folderId = '1-9FENR7DWRuNF3oJ2T-wGbFDo56YP2Am';//folder is fixed
    var batch = `batch-${year}-${year+4}`;

    var pageToken = null;

    return new Promise((resolve, reject) =>{

        do{
            drive.files.list({
                q: `'${folderId}' in parents`,
                fields: 'nextPageToken, files(name)',
                pageToken: pageToken
            }, function (err, res) {
                if (err) {
                    // Handle error
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

async function create_new_batch(year)
{
    const auth = await get_auth();
    const drive = google.drive({version: 'v3', auth});
    var isPresent = await isBatchPresent(drive, year);
    //console.log(isPresent);
    if(isPresent == true)
    {
        console.log("batch already present");
        return;
    }
    var spreadsheetId = await create_spread_sheet(drive, year);
    const sheets = google.sheets({version: 'v4', auth});
    await make_sheet1_general_format(sheets, spreadsheetId, year);
    await addSheet(sheets, spreadsheetId);
    await make_sheet2_general_format(sheets, spreadsheetId);
}

create_new_batch(2020);