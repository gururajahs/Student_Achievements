const {google} = require('googleapis');
const get_auth = require("./get_auth");

module.exports = (auth, year) => {

    return new Promise((resolve, reject) =>{

        const drive = google.drive({version: 'v3', auth});

        const folderId = '1-9FENR7DWRuNF3oJ2T-wGbFDo56YP2Am';//folder is fixed
        var batch = `batch-${year}-${year+4}`;

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
                    var file = files.find((file) =>  file.name == batch );

                    if(file && file.name == batch)
                        resolve(file.id);

                    pageToken = res.nextPageToken;

                    if(pageToken == null)
                        resolve("Wrong Batch");
                }
            });
        }while(pageToken != null);
    });
        
}