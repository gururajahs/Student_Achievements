const {google} = require('googleapis');
const global_data = require('../auth/global_data');
const fs = require('fs');


function get_certificate_folder_id(auth, spreadsheetId) {
    
    return new Promise((resolve, reject) => {

        var request = {
            dataFilters: [
                {
                    developerMetadataLookup: {
                        metadataKey: "Certificates",
                        visibility: "PROJECT"
                    }
                }
            ]
        };

        const resource = request;

        const sheets = google.sheets({ version: 'v4', auth });

        sheets.spreadsheets.developerMetadata.search({
            spreadsheetId,
            resource
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var folder_id = result.data.matchedDeveloperMetadata[0].developerMetadata.metadataValue;
                //console.log("certificate folder id", folder_id);
                resolve(folder_id);
            }
        });
    });
}

function upload_certificate(auth, filepath, filename)
{
    return new Promise(async (resolve, reject) => {

        var folder_id = await get_certificate_folder_id(auth, global_data.index_table_id);

        var fileMetadata = {
            name: `${filename}.pdf`,
            parents: [folder_id]
        };

        var media = {
            mimeType: 'application/pdf',
            body: fs.createReadStream(filepath)
        };

        const drive = google.drive({version: 'v3', auth});

        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id, webViewLink",
            uploadType: 'media'
        }, function (err, file) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                //console.log("file uploaded to drive successfully", file.data.webViewLink);
                resolve(file.data.webViewLink);
            }
        });
    });
}

module.exports = upload_certificate;