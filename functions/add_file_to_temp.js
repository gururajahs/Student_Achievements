function add_file_to_temp(file, filename)
{
    return new Promise((resolve, reject) => {
        
        var filepath = `./temp/${filename}`; // only allow to upload pdf
        file.mv(filepath, (err) => {
            if(err) {
                console.log("couldn't upload to node js server", err);
                reject("upload failed to node js server");
            } else {
                //console.log("file uploaded to node js server");
                resolve(filepath);
            }
        });

    });
}

module.exports = add_file_to_temp;