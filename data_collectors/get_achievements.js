const {google} = require('googleapis');

function add_sheet_to_get_achievements(sheets, spreadsheetId, userData)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            addSheet: { 
                properties:{
                    title: userData.email
                }
            },
        });

        const batchUpdateRequest = {requests};

        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: batchUpdateRequest,
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                //console.log("sheet added", res.data.replies[0].addSheet.properties.sheetId);
                resolve(res.data.replies[0].addSheet.properties.sheetId);
            }
        });
    });
}

function delete_sheet_of_achievemets(sheets, spreadsheetId, sheetId)
{
    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            deleteSheet: {
                sheetId: sheetId
            },
        })

        const batchUpdateRequest = {requests};

        sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: batchUpdateRequest,
        }, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                //console.log("deleted sheet");
                resolve("delete sheet of achievements");
            }
        });
    });
}


function add_filters_to_sheet(sheets, spreadsheetId, userData) {

    return new Promise((resolve, reject) => {

        let values = [
            [
                `=FILTER(year1!A:G, year1!A:A="${userData.usn}")`, null, null, null, null, null, null, null,
                `=FILTER(year2!A:G, year2!A:A="${userData.usn}")`, null, null, null, null, null, null, null, 
                `=FILTER(year3!A:G, year3!A:A="${userData.usn}")`, null, null, null, null, null, null, null,
                `=FILTER(year4!A:G, year4!A:A="${userData.usn}")`
            ]
        ];

        var range = `${userData.email}!A:H`;
        const resource = {
            values,
        };
        var valueInputOption = "USER_ENTERED";
        
        sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log("year filter added");
                resolve("year filter added");
            }
        });

    });
}

function get_filtered_achievements(sheets, spreadsheetId, userData)
{
    return new Promise((resolve, reject) => {
        var ranges = [`${userData.email}!A:H`,`${userData.email}!I:O`,`${userData.email}!P:V`,`${userData.email}!W:AC`];
        sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log("got all achievements");
                var data = {};
                for(let i = 0; i < 4; ++i)
                    data[`year${i+1}`] = result.data.valueRanges[i].values;
                resolve(data);
            }
        });
    });
}


// function get_achievements(auth, userData) {
    
//     return new Promise(async (resolve, reject) => {

//         const sheets = google.sheets({version: 'v4', auth});
//         const spreadsheetId = userData.spreadsheetId;
//         const sheetId = await add_sheet_to_get_achievements(sheets, spreadsheetId, userData);
//         await add_filters_to_sheet(sheets, spreadsheetId, userData);
//         const data = await get_filtered_achievements(sheets, spreadsheetId, userData);
//         await delete_sheet_of_achievemets(sheets, spreadsheetId, sheetId);
//         //console.log(data, "final data");
//         resolve(data);
        
//     });

// }

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