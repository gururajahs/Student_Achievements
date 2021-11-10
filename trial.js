// function sleep3(ms) {
//     var data = null;
//     return new Promise(resolve => setTimeout(() => { data = 1; console.log("here"); resolve(data); }, ms));
// }

// async function sleep2(){
//     var data = null;
//     data = await sleep3(2000);
//     //get
//     //write
//     //delete
//     return data;
// }

// function doSomething(data)
// {
//     console.log("do something", data);
// }

// function trial()
// {
//     var data = [];
//     for(let i = 0; i < 3; ++i)
//     {
//         data[i] = sleep2();-
//         data[i].then(value => doSomething(value));
//         console.log("happening asyncly");
//     }
//     return data;
// }

// data = trial();
// console.log(data);
// setTimeout(() => {console.log(data)}, 3000);



// var p1 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve('one'), 5000);
//   });
//   var p2 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve('two'), 3000);
//   });
//   var p3 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve('three'), 6000);
//   });
//   var p4 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve('four'), 2000);
//   });
//   var p5 = new Promise((resolve, reject) => {
//     reject(new Error('reject'));
//   });
  
// Using .catch:
// Promise.all([p1, p2, p3, p4])
// .then(values => {
//   console.log(values);
// })
// .catch(error => {
//   console.error(error.message)
// });

//From console:
//"reject"



// const get_file_ids = require('./functions/get_file_ids');
const auth = require('./auth/get_auth');
const get_user = require('./data_collectors/get_user');
const protected_data = require('./auth/protected_Data.json');
const get_spreadsheetId = require('./functions/get_spreadsheet_id')
const is_lecturer = require('./functions/is_lecturer');
const upload_certificate = require('./functions/get_upload_certificate_promise');
// const {student_achievements_folder_id, all_departments} = require('./auth/protected_data');

async function main()
{
    // var spreadsheetId = await get_spreadsheetId(auth, "IS", "batch-2019-2023");
    // await get_user(auth, spreadsheetId, "devenparamaj1.is19@bmsce.ac.in");
    // var is_lect = await is_lecturer("gururajhs.ise@bmsce.ac.in");
    // console.log(is_lect);
    //console.log(await get_file_ids(auth, student_achievements_folder_id, all_departments));
    // var a = [];
    // var b = [1, 2];
    // var c = [3, 4];
    // a.push(...b, ...c);
    // console.log(a);
    //console.log(Date.now());
    
    await upload_certificate(auth, "E:/Engineering college/documents/Deven Prakash Paramaj-ID Card.pdf", "dev1");

}

main()

// <thead>
//               <tr>
//                 <th scope="col" class="d-none d-md-block">Sl.No</th>
//                 <th scope="col">Department</th>
//                 <th scope="col">Year</th>
//                 <th scope="col">Usn</th>
//                 <th scope="col">Name</th>
//                 <th scope="col">Email</th>
//                 <th scope="col">Event</th>
//                 <th scope="col">Details/Location</th>
//                 <th scope="col">Level</th>
//                 <th scope="col">Award</th>
//               </tr>
//             </thead>  
            
//             <% let i = 1; for(let department in data) { %>
//               <% for(let batch in data[department]) { %>
//                 <% for(let year in data[department][batch]) {%>
//                   <% if(data[department][batch][year]) { %>
//                     <% for(let achievement of data[department][batch][year]) { %>
//                       <tr>
//                         <th scope="col"><%=i%></th>
//                         <th scope="col"><%=department%></th>
//                         <th scope="col"><%=year%></th>
//                         <% for(let ele of achievement) { %>
//                           <th scope="col"><%=ele%></th>
//                         <% } %>
//                       </tr>
//             <% i++; } } } } } %>



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


// const departments = protected_data.all_departments;
// //const departments = ["IS", "CS", "AM", "AS", "EC"];
// const batches = ["batch-2019-2023"];

// async function main()
// {
//     var data = await view_achievements(departments, batches, 2018, 2022);
//     console.log(data);
//     // console.log(data.IS);
//     // const sheets = google.sheets({version: 'v4', auth});
//     // await get_batch_ids_of_department(sheets, protected_data.index_table_id, departments, batches);
// }

// main();






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


// async function main()
// {
//     var userData = {
//         email : "deven"
//     };
//     const sheets = google.sheets({version: 'v4', auth});
//     var sheetId = await add_sheet_to_get_achievements(sheets, "1eJArd7fs6JHeDeU5fyK6G06XgN2Jt8Toa-Lu67fEgWM", userData);
//     console.log(sheetId);
// }

// main();