const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const protected_data = require("../auth/protected_Data.json");

//function get_department_ids(auth, spreadsheetId) {
module.exports = (auth, spreadsheetId) => {
    
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

// async function main()
// {
//     var file_ids = await get_department_ids(auth, protected_data.index_table_id);
//     console.log(file_ids);
// }

// main();