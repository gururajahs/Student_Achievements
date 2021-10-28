const {google} = require('googleapis');
const auth = require("../auth/get_auth");
const {student_achievements_folder_id, all_departments} = require('../auth/protected_data');
const get_file_ids = require('../functions/get_file_ids');


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
                console.log(`got ${batch_id} achievements`);
                var data = {};
                for(let i in years)
                    data[years[i]] = result.data.valueRanges[i].values;
                resolve(data);
            }
        });
    });
}

function get_all_batches_data(sheets, batch_ids, start_academic_year, end_academic_year, department)
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

function view_achievements(departments, batches, start_academic_year, end_academic_year)
{
    return new Promise(async (resolve, reject) =>{

        var data = {};
        const drive = google.drive({version: 'v3', auth});
        const sheets = google.sheets({version: 'v4', auth});
        const folderId = student_achievements_folder_id;
        var promises = [];

        var department_ids = await get_file_ids(drive, folderId, departments);
        batches = await get_batches_having_academic_year(batches, start_academic_year, end_academic_year);

        for(let department of departments) // doing departments here and not department_ids coz the order in dep_ids will be changed every time
        {
            var batch_ids = await get_file_ids(drive, department_ids[department], batches);
            var promise = get_all_batches_data(sheets, batch_ids, start_academic_year, end_academic_year);
            promises.push(promise);
        }

        var data_temp = await Promise.all(promises);
        for(let i in data_temp)
            data[departments[i]] = data_temp[i];

        resolve(data);

    });
}


//const departments = all_departments;
const departments = ["IS", "CS", "AM", "AS", "EC"];
const batches = ["batch-2018-2022"];

async function main()
{
    var data = await view_achievements(departments, batches, 2019, 2021);
    console.log(data);
    console.log(data.IS);
}

main();