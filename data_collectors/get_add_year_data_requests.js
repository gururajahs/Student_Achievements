
function get_add_year_data_requests(userData) {

    return new Promise((resolve, reject) => {

        var data = [
            userData.usn,
            userData.name,
            userData.email,
            userData.nameOfEvent,
            userData.detailsOfEvent,
            userData.level,//"Level(state/national/international)",
            userData.award//"Award/Price"
        ];
        var values = [];

        for(let ele of data)
        {
            values.push({
                userEnteredValue: {
                    stringValue: ele,
                }
            });
        }

        var requests = [{
            appendCells : {
                sheetId: userData.yearOfAchievement,
                rows : [
                    {
                        values : values //only one row with values = values
                    }
                ],
                fields: "*"
            }
        }];

        resolve(requests);
        
    });
}

module.exports = get_add_year_data_requests;