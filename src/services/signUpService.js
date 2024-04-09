const addInDb = require('../models/addInDb')
const existsInDB = require('../models/existsInDb')

async function createUser(username, password){
    const newUser = {username: username, password: password}
    let code = 0
    return existsInDB(newUser).then(result => {
        if(result == 1){
            console.log("Exista deja in BD");
            //aici ar trebui sa trimitem si un raspuns la server, nush cum
            code = 403
        }
        else{
            code = 200
            return addInDb(newUser)
        }
        return Promise.resolve(code)
    }).then(() => {
        return code;
    }).catch(error => {
        console.error("Error:", error)
        return 403;
    })
   
}

module.exports = {
    createUser: createUser
}