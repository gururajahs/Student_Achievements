const {google} = require('googleapis');

function get_achievements(auth, userData) {
    
    return new Promise(async (resolve, reject) => {

        const sheets = google.sheets({version: 'v4', auth});
        const spreadsheetId = userData.spreadsheetId;

        var ranges = [];
        for(let i = 1; i <= 4; ++i) {
            ranges.push(`year${i}!A2:H`);
        }

        sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log("got all achievements");
                var data = {};
                for(let i = 0; i < 4; ++i) {
                    var values = [];

                    var rows = result.data.valueRanges[i].values;
                    if(rows){
                        for(let row of rows) {
                            if(row[2].localeCompare(userData.email) == 0) {
                                values.push(row);
                            }
                        }
                    }

                    data[`year${i+1}`] = values;
                }
                resolve(data);
            }
        });
        
    });

}

module.exports = get_achievements;