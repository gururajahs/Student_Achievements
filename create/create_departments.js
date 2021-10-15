const {google} = require('googleapis');
const get_auth = require("./get_auth");

function create_department_folder(drive, folderId, department)
{
    return new Promise((resolve, reject) => {

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
    const folderId = '1-9FENR7DWRuNF3oJ2T-wGbFDo56YP2Am';//folder is fixed
    var departments = ["CE", "ME", "EE", "EC", "IM", "CS", "TE", "IS", "EI", "ML", "BT", "CH", "AS", "AM"]
    const auth = await get_auth();
    const drive = google.drive({version: 'v3', auth});
    for(let department of departments)
    {
        await create_department_folder(drive, folderId, department); // can do this without await, that would be better, but we will have to count if all are done... so i put await so that we won't have to count and see if it is done
    }
}

main();