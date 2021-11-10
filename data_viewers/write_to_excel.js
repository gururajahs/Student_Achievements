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
            "Certificate",
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