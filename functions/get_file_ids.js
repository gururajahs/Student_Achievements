const {google} = require('googleapis');

//function get_file_ids(auth, folderId, req_files) {
module.exports = (auth, folderId, req_files) => {

    return new Promise((resolve, reject) => {

        const drive = google.drive({version: 'v3', auth});

        req_files = new Set(req_files);
        var file_ids = {};
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

                    for(var file of files)
                    {
                        if(req_files.has(file.name))
                            file_ids[file.name] = file.id;
                    }

                    pageToken = res.nextPageToken;

                    if(pageToken == null)
                        resolve(file_ids);
                }
            });

        }while(pageToken != null);

    });

}