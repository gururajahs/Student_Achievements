const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const protected_data = require("../auth/protected_Data.json");
const get_department_ids = require("../functions/get_department_ids");
// const {student_achievements_folder_id, all_departments} = require('../auth/protected_data');
// const get_file_ids = require('../functions/get_file_ids');


function get_batches_having_academic_year(batches, start_academic_year, end_academic_year)
{
    return new Promise((resolve, reject) =>{

        var new_batches = [];
        for(let batch of batches)
        {
            var arr = batch.split("-");
            var begin = arr[1];
            var end = arr[2];
            if((start_academic_year >= begin && start_academic_year < end) || (end_academic_year <= end && end_academic_year > begin))
                new_batches.push(batch);
        }    
        resolve(new_batches);
    
    });
}

function get_batch_data(sheets, batch_id, years)
{
    return new Promise((resolve, reject) =>{

        var spreadsheetId = batch_id;
        var ranges = [];
        for(let year of years)
            ranges.push(`${year}!A2:G`);

        sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(`got ${batch_id} achievements`);
                var data = {};
                for(let i in years)
                    data[years[i]] = result.data.valueRanges[i].values;
                resolve(data);
            }
        });
    });
}

function get_all_batches_data(sheets, batch_ids, start_academic_year, end_academic_year)
{
    return new Promise(async (resolve, reject) =>{

        var data = {};
        var promises = [];

        for(let batch in batch_ids)
        {
            var arr = batch.split("-");
            var begin = parseInt(arr[1]);
            var years = [];
            for(let i = 0; i < 4; ++i)
            {
                if(begin + i >= start_academic_year && begin + i < end_academic_year)
                    years.push(`year${i+1}`);
            }
            
            var promise = get_batch_data(sheets, batch_ids[batch], years);
            promises.push(promise);
        }
        
        var temp_data = await Promise.all(promises);
        var i = 0;
        for(let batch in batch_ids)
            data[batch] = temp_data[i++];

        resolve(data);

    });
}


function get_batch_ids_of_department(sheets, spreadsheetId, departments, batches) {

    return new Promise((resolve, reject) => {
        
        var department_batch_ids = {};
        batches = new Set(batches);

        var ranges = [];
        for(let department of departments)
            ranges.push(`${department}!A:B`);

        sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges,
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                
                var files = result.data.valueRanges;
                for(let i in departments)
                {
                    var values = files[i].values;
                    department_batch_ids[departments[i]] = {};
                    var department_batches = {};
                    for(let value of values)
                        department_batches[value[0]] = value[1];
                    for(let batch of batches)
                        department_batch_ids[departments[i]][batch] = department_batches[batch];
                }
                //console.log(department_batch_ids);
                resolve(department_batch_ids);
            }
        });
    });
}


// function view_achievements(departments, batches, start_academic_year, end_academic_year)
module.exports = (departments, batches, start_academic_year, end_academic_year) =>
{
    return new Promise(async (resolve, reject) =>{

        var data = {};
        const sheets = google.sheets({version: 'v4', auth});

        batches = await get_batches_having_academic_year(batches, start_academic_year, end_academic_year);

        var department_batches = await get_batch_ids_of_department(sheets, protected_data.index_table_id, departments, batches);

        var promises = [];
        for(let department in department_batches)
        {
            var promise = get_all_batches_data(sheets, department_batches[department], start_academic_year, end_academic_year);
            promises.push(promise);
        }

        var data_temp = await Promise.all(promises);
        for(let i in data_temp)
            data[departments[i]] = data_temp[i];

        resolve(data);

    });
}


// const departments = protected_data.all_departments;
// //const departments = ["IS", "CS", "AM", "AS", "EC"];
// const batches = ["batch-2019-2023"];

// async function main()
// {
//     var data = await view_achievements(departments, batches, 2019, 2021);
//     console.log(data);
//     console.log(data.IS);
//     // const sheets = google.sheets({version: 'v4', auth});
//     // await get_batch_ids_of_department(sheets, protected_data.index_table_id, departments, batches);
// }

// main();