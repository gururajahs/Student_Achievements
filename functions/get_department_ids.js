const {google} = require('googleapis');

function get_department_ids(auth, spreadsheetId) {
    
    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});
        var file_ids = {};

        const range = `Sheet1!A:B`;
        sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(result.data.values);
                var files = result.data.values;
                for(let file of files)
                    file_ids[file[0]] = file[1];
                resolve(file_ids);
            }
        });
    });
}


module.exports = get_department_ids;