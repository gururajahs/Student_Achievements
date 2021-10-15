const {google} = require('googleapis');
const get_auth = require("./get_auth");

function create_department_folder(drive, department)
{
    return new Promise((resolve, reject) => {

        const folderId = '1-9FENR7DWRuNF3oJ2T-wGbFDo56YP2Am';//folder is fixed
        var fileMetadata = {
            'name': department,
            'mimeType': 'application/vnd.google-apps.folder',
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
    var departments = ["CE", "ME", "EE", "EC", "IM", "CS", "TE", "IS", "EI", "ML", "BT", "CH", "AS", "AM"]
    const auth = await get_auth();
    const drive = google.drive({version: 'v3', auth});
    for(let department of departments)
    {
        await create_department_folder(drive, department);
    }
}

main();