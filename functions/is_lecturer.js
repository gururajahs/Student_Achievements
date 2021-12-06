
function is_lecturer(email) {
        
    return new Promise((resolve, reject) => {

        var isValid = email.match(/^\w+\.\w+\d{2}/);
        if(isValid == null) {
            resolve(true);
        }
        else {
            reject("Not a lecturer");
        }

    });
}

// async function main() {
//     await is_lecturer("guruarajhs.ise@bmsce.ac.in");
// }

// main();

module.exports = is_lecturer;