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
                `=FILTER(year1!A:G, year1!A:A="${userData.usn}")`, null, null, null, null, null, null,
                `=FILTER(year2!A:G, year2!A:A="${userData.usn}")`, null, null, null, null, null, null,
                `=FILTER(year3!A:G, year3!A:A="${userData.usn}")`, null, null, null, null, null, null,
                `=FILTER(year4!A:G, year4!A:A="${userData.usn}")`
            ]
        ];

        var range = `${userData.email}!A:G`;
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
        var ranges = [`${userData.email}!A:G`,`${userData.email}!H:N`,`${userData.email}!O:U`,`${userData.email}!V:AB`];
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


function get_achievements(auth, userData) {
    
    return new Promise(async (resolve, reject) => {

        const sheets = google.sheets({version: 'v4', auth});
        const spreadsheetId = userData.spreadsheetId;
        const sheetId = await add_sheet_to_get_achievements(sheets, spreadsheetId, userData);
        await add_filters_to_sheet(sheets, spreadsheetId, userData);
        const data = await get_filtered_achievements(sheets, spreadsheetId, userData);
        await delete_sheet_of_achievemets(sheets, spreadsheetId, sheetId);
        //console.log(data, "final data");
        resolve(data);
        
    });

}

module.exports = get_achievements;



// var userData = {
//     usn: 48,
//     name: "Deven Prakash Paramaj",
//     email: "devenparamaj.is19@bmsce.ac.in",
//     phone: "1234567890",
//     nameOfEvent: "ab",
//     detailsOfEvent: "cd",
//     level: "ef",//"Level(state/national/international)",
//     award: "fg",
//     department_id: "1s0xIu0UaUhwwRVsOybSz4CyM514u9sA0",
//     batch: 2018,
//     year: 1,
// };


// async function main()
// {
//     var userData = {
//         email : "deven"
//     };
//     const sheets = google.sheets({version: 'v4', auth});
//     var sheetId = await add_sheet_to_get_achievements(sheets, "1eJArd7fs6JHeDeU5fyK6G06XgN2Jt8Toa-Lu67fEgWM", userData);
//     console.log(sheetId);
// }

// main();