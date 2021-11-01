const auth = require("../auth/get_auth");
const protected_data = require("../auth/protected_Data.json");
const get_spreadsheetId = require("../functions/get_spreadsheet_id");
const isBatchPresent = require("../functions/isBatchPresent");

module.exports = (usn) => {
//function get_user_data(usn) {
    
    return new Promise(async (resolve, reject) => {

        var data = {};

        let year = parseInt("20" + usn.slice(3, 5));
        let current_year = new Date().getFullYear();
        data.presentYear = current_year - year + 1;
        
        data.batch = `batch-${year}-${year+4}`;

        data.department = usn.slice(5, 7);

        data.usn = parseInt(usn.slice(7));
        if(data.usn < 1 || data.usn > 999)
            reject("Invalid usn no");

        console.log(data);
        resolve(data);

    });
}

// async function main()
// {
//     await get_user_data("1BM19IS048");
// }

// main();