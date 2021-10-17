
module.exports = (ph_num) => {
//function validate_ph_number(ph_num) {
        
    return new Promise((resolve, reject) => {

        var isValid = ph_num.match(/^\d{10}$/);
        if(isValid == null)
            reject(false);
        else
            resolve(true);

    });
}
