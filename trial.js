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



var p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('one'), 5000);
  });
  var p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('two'), 3000);
  });
  var p3 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('three'), 6000);
  });
  var p4 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('four'), 2000);
  });
//   var p5 = new Promise((resolve, reject) => {
//     reject(new Error('reject'));
//   });
  
  // Using .catch:
  Promise.all([p1, p2, p3, p4])
  .then(values => {
    console.log(values);
  })
  .catch(error => {
    console.error(error.message)
  });
  
  //From console:
  //"reject"
  