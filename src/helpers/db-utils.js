const { dbConnection } = require("../config/dbConfig");

const executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        try{
            dbConnection.query(query, function (err, result) {
                if (err){
                    reject(err)
                    return "error"
                }
                resolve(result);
            });
        }
        catch(e){
            reject(e)
            return "error"
        }
    })
}

module.exports = {
    executeQuery
}