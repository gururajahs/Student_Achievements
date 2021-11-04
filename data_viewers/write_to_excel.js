const ExcelJS = require('exceljs');

function write_to_sheet(sheet, rows)
{
    return new Promise((resolve, reject) => {

        var headers =  [
            "USN",
            "Name",
            "Bmsce Mail",
            "Name of Event",
            "Details or Location of Event",
            "Level",
            "Award",
            "Department",
            "Batch",
            "Year Of Achievement"
        ];
    
        sheet.addRow(headers);

        sheet.addRows(rows);

        resolve("wrote to sheet");

    });
}


function write_all_data_to_sheet1(sheet, data)
{
    return new Promise(async (resolve, reject) => {

        var rows = [];
        for(let ele in data)
            rows.push(...data[ele]);
        
        await write_to_sheet(sheet, rows);

        resolve("wrote to sheet1");

    });
}

function write_to_excel(filepath, data)
{
    return new Promise(async (resolve, reject) => {

        const workbook = new ExcelJS.Workbook();
        const sheet1 = workbook.addWorksheet('Sheet1');
        
        var promises = [];
        for(let academic_year in data)
        {
            var sheet = workbook.addWorksheet(academic_year);
            var promise = write_to_sheet(sheet, data[academic_year]);
            promises.push(promise);
        }
        var sheet1_promise = write_all_data_to_sheet1(sheet1, data);
        promises.push(sheet1_promise);

        await Promise.all(promises);

        await workbook.xlsx.writeFile(filepath);

        resolve("wrote to excel");
    });
}

module.exports = write_to_excel;

// async function main()
// {
//     await write_to_excel(`./temp/${Date.now()}.xlsx`, data);
// }

// var data = {
//     '2018-2019': [],
//     '2019-2020': [
//       [
//         '1BM19IS048',
//         'Deven Prakash Paramaj',
//         'devenparamaj.is19@bmsce.ac.in',   
//         'IEEE Event',
//         '24 hr hackathon, BSN Hall, Bmsce',
//         'international',
//         'no',
//         'IS',
//         'batch-2019-2023',
//         '1'
//       ],
//       [
//         '1BM19IS120',
//         'Preethi V Hiremath',
//         'preethiv.is19@bmsce.ac.in',
//         'HackerRank Challenges/Competition',
//         'Bleh',
//         'international',
//         'yes',
//         'IS',
//         'batch-2019-2023',
//         '1'
//       ]
//     ],
//     '2020-2021': [
//       [
//         '1BM19IS048',
//         'Deven Prakash Paramaj',
//         'devenparamaj.is19@bmsce.ac.in',
//         'IEEE Event',
//         'ADFAS',
//         'international',
//         'no',
//         'IS',
//         'batch-2019-2023',
//         '2'
//       ],
//       [
//         '1BM19IS120',
//         'Preethi V Hiremath',
//         'preethiv.is19@bmsce.ac.in',
//         'Quiz Competition',
//         'Awesome Quiz',
//         'college',
//         'no',
//         'IS',
//         'batch-2019-2023',
//         '2'
//       ]
//     ],
//     '2021-2022': [
//       [
//         '1BM19IS120',
//         'Preethi V Hiremath',
//         'preethiv.is19@bmsce.ac.in',
//         'Other',
//         'PhaseShift - logomania coordinator',
//         'college',
//         'no',
//         'IS',
//         'batch-2019-2023',
//         '3'
//       ]
//     ]
// };

// main();