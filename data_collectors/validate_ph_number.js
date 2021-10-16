
module.exports = (usn) => {
//function get_user_data(usn) {
        
    return new Promise((resolve, reject) => {

        var isValid = ph_num.match(/^\d{10}$/);
        if(isValid == null)
            reject(false);
        else
            resolve(true);

    });
}
