const {google} = require('googleapis');
const protected_data = require("../auth/global_data");

function get_department_sheet_id(sheets, spreadsheetId, department) {
    
    return new Promise((resolve, reject) => {

        var request = {
            dataFilters: [
                {
                    developerMetadataLookup: {
                        metadataKey: department,
                        visibility: "PROJECT"
                    }
                }
            ]
        };

        const resource = request;

        sheets.spreadsheets.developerMetadata.search({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var index = result.data.matchedDeveloperMetadata[0].developerMetadata.location.dimensionRange.startIndex + 1;
                //console.log("department sheet index", index);
                resolve(index);
            }
        });
    });
}


function get_batch_spreadsheetId(sheets, spreadsheetId, department_sheet_id, batch) {

    return new Promise(async (resolve, reject) =>{

        var request = {
            dataFilters: [
                {
                    developerMetadataLookup: {
                        metadataKey: batch,
                        visibility: "PROJECT"
                    }
                }
            ]
        };

        const resource = request;

        sheets.spreadsheets.developerMetadata.search({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(result.data.matchedDeveloperMetadata);
                var metadatas = result.data.matchedDeveloperMetadata;
                for(let metadata of metadatas)
                {
                    //console.log(metadata.developerMetadata.location.dimensionRange.sheetId);
                    if(metadata.developerMetadata.location.dimensionRange.sheetId == department_sheet_id)
                    {
                        resolve(metadata.developerMetadata.metadataValue);
                    }
                }
                reject("batch not found");
            }
        });

    });
}


function get_spreadsheet_id(auth, department, batch) {

    return new Promise(async (resolve, reject) => {
       
        const sheets = google.sheets({version: 'v4', auth});
        const department_sheet_id = await get_department_sheet_id(sheets, protected_data.index_table_id, department);
        const spreadsheet_id = await get_batch_spreadsheetId(sheets, protected_data.index_table_id, department_sheet_id, batch);
        resolve(spreadsheet_id);

    });
}

module.exports = get_spreadsheet_id;