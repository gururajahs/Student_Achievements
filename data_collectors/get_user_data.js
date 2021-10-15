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


module.exports = (usn) => {
//async function get_user_data(usn) {
    
    return new Promise(async (resolve, reject) => {

        const folderId = '1-9FENR7DWRuNF3oJ2T-wGbFDo56YP2Am'; // folder is fixed
        const auth = await get_auth();
        data = {}; // 1BM19IS048
        data.batch = parseInt("20" + usn.slice(3, 5));
        data.department_id = await get_department_id(auth, folderId, usn.slice(5, 7));
        data.usn = parseInt(usn.slice(7));
        //console.log(data);
        resolve(data);

    });
}

//get_user_data("1BM19IS048");