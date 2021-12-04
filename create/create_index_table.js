const {google} = require('googleapis');
const auth = require("../auth/get_auth");
var global_data = require("../auth/global_data");

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
                //console.log('Index table Id: ', file.data.id);
                resolve(file.data.id);
            }
        });
    });
}

async function main()
{ 
    const folderId = global_data.student_achievements_folder_id;
    var index_table_id = await create_index_table(auth, folderId);
    console.log("Index table Id: ", index_table_id, "\nadd this to .env");
}

main();