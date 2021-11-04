const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const fs = require('fs');
var protected_data = require("../auth/protected_Data.json");

function create_index_table(auth, folderId)
{
    return new Promise((resolve, reject) => {

        const drive = google.drive({version: 'v3', auth});

        var fileMetadata = {
            name: "index_table",
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
                console.log('File(Folder) Id: ', file.data.id);
                resolve(file.data.id);
            }
        });
    });
}

async function main()
{ 
    const folderId = protected_data.student_achievements_folder_id;
    var index_table_id = await create_index_table(auth, folderId);
    protected_data.index_table_id = index_table_id;
    const data_string = JSON.stringify(protected_data);
    fs.writeFile("./auth/protected_Data.json", data_string, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });
}

main();