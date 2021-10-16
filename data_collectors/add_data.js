const auth = require('../auth/get_auth');
const get_spreadsheetId = require('./get_spreadsheetId');
const add_achievement_count = require('./add_count');
const add_year_data = require('./add_year_data');
const sort_year_data = require('./sort_year_data');

module.exports = (userData) => {
//async function main(userData) {

    return new Promise(async (resolve, reject) => {

        const spreadsheetId = await get_spreadsheetId(auth, userData.department_id, userData.batch);
        await add_year_data(auth, spreadsheetId, userData);
        await add_achievement_count(auth, spreadsheetId, userData);
        await sort_year_data(auth, spreadsheetId, userData.year);
        resolve("done");
        
    });
}



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

// main(userData);