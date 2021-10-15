const {google} = require('googleapis');
const get_auth = require("./get_auth");

function get_department_id(auth, folderId, department) {

    return new Promise((resolve, reject) =>{

        const drive = google.drive({version: 'v3', auth});

        var pageToken = null;

        do{
            drive.files.list({
                q: `'${folderId}' in parents`,
                fields: 'nextPageToken, files(name, id)',
                pageToken: pageToken
            }, function (err, res) {
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    var files = res.data.files;
                    var file = files.find((file) =>  file.name == department );

                    if(file && file.name == department)
                        resolve(file.id);

                    pageToken = res.nextPageToken;

                    if(pageToken == null)
                        resolve("Wrong Batch");
                }
            });
        }while(pageToken != null);
    });
        
}


async function isBatchPresent(auth, folderId, year) {

    return new Promise((resolve, reject) =>{

        const drive = google.drive({version: 'v3', auth});

        var batch = `batch-${year}-${year+4}`;
        var pageToken = null;

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


module.exports = (usn) => {
//async function get_user_data(usn) {
    
    return new Promise(async (resolve, reject) => {

        const folderId = '1-9FENR7DWRuNF3oJ2T-wGbFDo56YP2Am'; // folder is fixed
        const departments = new Set(["CE", "ME", "EE", "EC", "IM", "CS", "TE", "IS", "EI", "ML", "BT", "CH", "AS", "AM"]);

        const auth = await get_auth();
        data = {};

        data.batch = parseInt("20" + usn.slice(3, 5));

        data.department = usn.slice(5, 7);
        if(!departments.has(data.department))
            reject("Invalid usn");

        data.department_id = await get_department_id(auth, folderId, data.department);
        var isPresent = await isBatchPresent(auth, data.department_id, data.batch);
        if(isPresent == false)
            reject("Invalid usn");

        data.usn = parseInt(usn.slice(7));
        if(data.usn < 1 || data.usn > 999)
            reject("Invalid usn");

        console.log(data);
        resolve(data);

    });
}

// async function main()
// {
//     await get_user_data("1BM18IS048");
// }

// main();