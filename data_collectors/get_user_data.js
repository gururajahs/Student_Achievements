const auth = require("../auth/get_auth");
const protected_data = require("../auth/protected_Data.json");
const get_spreadsheetId = require("../functions/get_spreadsheet_id");
const isBatchPresent = require("../functions/isBatchPresent");

module.exports = (usn) => {
//function get_user_data(usn) {
    
    return new Promise(async (resolve, reject) => {

        const departments = new Set(protected_data.all_departments);

        var data = {};

        year = parseInt("20" + usn.slice(3, 5));
        data.batch = `batch-${year}-${year+4}`;

        data.department = usn.slice(5, 7);
        if(!departments.has(data.department))
            reject("Invalid department");

        var isPresent = await isBatchPresent(auth, protected_data.index_table_id, data.batch);
        if(isPresent == false)
            reject("Invalid batch");

        data.usn = parseInt(usn.slice(7));
        if(data.usn < 1 || data.usn > 999)
            reject("Invalid usn no");

        data.spreadsheetId = await get_spreadsheetId(auth, data.department, data.batch);

        console.log(data);
        resolve(data);

    });
}

// async function main()
// {
//     await get_user_data("1BM19IS048");
// }

// main();