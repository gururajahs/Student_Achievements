const { google } = require('googleapis');

function get_batches(auth, spreadsheetId) {

    return new Promise((resolve, reject) => {

        const sheets = google.sheets({ version: 'v4', auth });
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
                if (!files) {
                    resolve(null);
                } else {
                    for (let file of files) {
                        all_batches.push(file[0]);
                    }
                    resolve(all_batches);
                }

            }
        });
    });
}

module.exports = get_batches;