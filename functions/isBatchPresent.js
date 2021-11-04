const {google} = require('googleapis');

function isBatchPresent(auth, spreadsheetId, batch)
{
    return new Promise((resolve, reject) =>{

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

        const sheets = google.sheets({version: 'v4', auth});

        sheets.spreadsheets.developerMetadata.search({   //getByDataFilter({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(result.data.sheets[0].data[0].startRow);
                //console.log("isBatchPresent", result.data.matchedDeveloperMetadata);
                if(result.data.matchedDeveloperMetadata) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
        });

    });
}


module.exports = isBatchPresent;