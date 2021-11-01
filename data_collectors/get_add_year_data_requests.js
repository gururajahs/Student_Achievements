
module.exports = (userData) => {

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



// async function main(userData)
// {
//     const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
//     await append_year_data(auth, spreadsheetId, userData);
// }

// var userData = {
//     usn: 48,
//     department_id: "1HkK1ea1gAKUbSs7EexCKHOoBCfLOwKjc",
//     batch: 2018,
//     name: "Deven Prakash Paramaj",
//     email: "devenparamaj.is19@bmsce.ac.in",
//     nameOfEvent: "ab",
//     detailsOfEvent: "cd",
//     level: "ef",//"Level(state/national/international)",
//     award: "fgi",
//     year: 2,
// };

// main(userData);