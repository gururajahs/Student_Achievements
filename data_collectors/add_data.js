const get_auth = require('./get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');
const add_achievement_count = require('./add_count');
const add_year_data = require('./add_year_data');
const sort_year_data = require('./sort_year_data');

module.exports = (userData) => {
//async function main(userData) {

    return new Promise(async (resolve, reject) => {

        const auth = await get_auth();
        const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
        await add_year_data(auth, spreadsheetId, userData);
        await add_achievement_count(auth, spreadsheetId, userData);
        await sort_year_data(auth, spreadsheetId, userData.year);
        resolve("done");
        
    });
}



// var userData = {
//     usn: 241,
//     name: "Deven Prakash Paramaj",
//     email: "devenparamaj.is19@bmsce.ac.in",
//     nameOfEvent: "ab",
//     detailsOfEvent: "cd",
//     level: "ef",//"Level(state/national/international)",
//     award: "fg",
//     department_id: "1HkK1ea1gAKUbSs7EexCKHOoBCfLOwKjc",
//     batch: 2018,
//     year: 1,
// };

// main(userData);