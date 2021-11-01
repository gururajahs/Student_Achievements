const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const protected_data = require("../auth/protected_Data.json");

//function get_batches(auth, spreadsheetId) {
module.exports = (auth, spreadsheetId) => {
    
    return new Promise((resolve, reject) => {
        
        const sheets = google.sheets({version: 'v4', auth});
        var all_batches = [];

        const range = `IS!A:B`;
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
                    all_batches.push(file[0]);
                resolve(all_batches);
            }
        });
    });
}

// async function main()
// {
//     var file_ids = await get_batches(auth, protected_data.index_table_id);
//     console.log(file_ids);
// }

// main();