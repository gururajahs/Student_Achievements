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
    console.log(Date.now());
    
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