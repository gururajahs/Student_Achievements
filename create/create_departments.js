const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const {student_achievements_folder_id, all_departments} = require('../auth/protected_data');

function create_department_folder(drive, folderId, department)
{
    return new Promise((resolve, reject) => {

        var fileMetadata = {
            name: department,
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

async function main()
{ 
    const folderId = student_achievements_folder_id;
    const departments = all_departments;
    const drive = google.drive({version: 'v3', auth});
    var promises = [];
    for(let department of departments)
    {
        var promise = create_department_folder(drive, folderId, department);
        promises.push(promise);
    }
    await Promise.all(promises);
}

main();