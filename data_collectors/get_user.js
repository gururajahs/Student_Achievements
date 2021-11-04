const {google} = require('googleapis');

function get_row_data(sheets, spreadsheetId, row_no)
{
    return new Promise((resolve, reject) => {

        var data = {};
        const range = `Sheet1!A${row_no}:D${row_no}`;
        sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(result.data.values[0]);
                data.usn = result.data.values[0][0];
                data.phone = result.data.values[0][3];
                //console.log(data);
                resolve(data);
            }
        });
    });
}


function get_user(auth, spreadsheetId, email)
{
    return new Promise((resolve, reject) =>{

        var request = {
            dataFilters: [
                {
                    developerMetadataLookup: {
                        metadataKey: email,
                        visibility: "PROJECT"
                    }
                }
            ]
        };

        const resource = request;

        const sheets = google.sheets({version: 'v4', auth});
        var row_no = 0;

        sheets.spreadsheets.developerMetadata.search({   //getByDataFilter({
            spreadsheetId,
            resource
        }, async (err, result) => {
            if (err) {
                console.log(err);
            } else {
                
                if(!result.data.matchedDeveloperMetadata){
                    resolve(undefined);
                }
                else{
                    row_no = result.data.matchedDeveloperMetadata[0].developerMetadata.location.dimensionRange.startIndex + 1;
                    //console.log(row_no);
                    resolve(await get_row_data(sheets, spreadsheetId, row_no));
                }
            }
        });
    });
}

module.exports = get_user;