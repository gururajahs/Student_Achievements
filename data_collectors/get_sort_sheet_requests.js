
function get_sort_sheet_requests(sheet_id) {

    return new Promise((resolve, reject) => {

        var requests = [];

        requests.push({
            sortRange: {
                range: {
                    sheetId: sheet_id, // added sheetId as properties in create format
                    startRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 10
                },
                sortSpecs: [
                    {
                        dimensionIndex: 0, // sort with respect to usn
                        sortOrder: "ASCENDING",
                    }
                ]
            },
        });
        
        resolve(requests);

    });
}

module.exports = get_sort_sheet_requests;