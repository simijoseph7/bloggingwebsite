

const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const bcrypt = require('bcrypt');


async function createUser(user) {
    const db = await dbPromise;
    const result = await db.run(SQL `
        insert into users (userName, password, fname, lname, dob, email, userImage, description) values(${user.userName}, ${user.password},
        ${user.fname}, ${user.lname}, ${user.dob}, ${user.email},  ${user.userImage}, ${user.description})`);
    // Get the auto-generated ID value, and assign it back to the user object.
    user.userId = result.lastID;
}

/**
 * Read all records and all their columns from some given table.
 */

const readAll = async ({ table }) => {
  const db = await dbPromise
  const res = await db.all(`SELECT * FROM ${table}`);
  return res;
};



//  update a given table 
// const update = async ({ table,object,id }) => {
    
//    const key = Object.keys(id)[0]
//    const value = Object.values(id)[0]
//    const db = await dbPromise
//    const mapped = Object.entries(object).map(([k, v]) => `${k}='${v}'`).join(",")
 
//      db.run(SQL `
//         update ${table}
//         set ${mapped}
//         where ${key} = ${value};`)
//         .then(console.log)
//         .catch(console.log)
       
// //  return res;
// };

// sybscriber ==================================



// async function createSubscriber(subscriber) {
//     const db = await dbPromise;
//     const result = await db.run(SQL `
//         insert into subscription (email, firstName, lastName) values(${subscriber.email}, ${subscriber.firstName}, 
//         ${subscriber.lastName});`);
  
  
// }



async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL `
        select * from users
        where userId = ${id}`);

    return user;
}
async function retrieveUserByUserName(username) {
    const db = await dbPromise;

    const user = await db.get(SQL `
        select * from users
        where userName = ${username}`);

    return user;
}

//retrieves all the usernames in the database
async function retrieveAllUsernames() {
    const db = await dbPromise;
    const allUsernames = await db.all(SQL `SELECT username FROM users`);
    return allUsernames;
}


/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} userName the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(userName, password,callback) {
    const db = await dbPromise;
    const user = await db.get(SQL `
        select * from users
         where userName = ${userName}`);
        if(user){
            const match = await comparePassword(password,user.password)
          if(match) return callback(undefined,user)
          else return callback("Password doesn't match, try again ...",undefined)
        }else{
            return callback(('Account is not found!'),undefined)
        }

}
/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL `
        select * from users
        where authToken = ${authToken}`);

    return user;
}
/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await dbPromise;
    await db.run(SQL `
        update users
        set userName = ${user.userName}, password = ${user.password},
            fname = ${user.fname}, lname = ${user.lname},
            authToken = ${user.authToken}, dob = ${user.dob}, email = ${user.email},
            userImage = ${user.userImage},description = ${user.description} 
        where userId = ${user.userId};`);
}

/**
 * Deletes the user with the given id from the database.
 * 
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await dbPromise;

    await db.run(SQL `
        delete from users
        where userId = ${id}`);
}
/**
 * Deletes the subscriber with the given email from the database.
 * 
 * @param {string} email the subscriber's email
 */
async function deleteSubscriber(email) {
    const db = await dbPromise;

    await db.run(SQL `
        delete from subscribers
        where email = ${email}`);
}

// 
async function  hashPassword(password){
   const saltRounds = 10;
   const hashPsw = await bcrypt.hash(password,saltRounds)
   return hashPsw;
}
async function comparePassword(password,hash_Password) {
    const match = await bcrypt.compare(password, hash_Password)
    return match;
}

//compares username entered in signup page with usernames in the database
async function checkUsername(name){
    const db = await dbPromise;
    const matchingUsername = await db.get(SQL`SELECT userName FROM users
    WHERE userName = ${name}`);
    return matchingUsername;
}

// Export functions.
module.exports = {
    createUser,
    retrieveUserByUserName,
    retrieveUserWithAuthToken,
    retrieveUserWithCredentials,
    retrieveUserById,
    updateUser,
    retrieveAllUsernames,
    deleteUser,
    deleteSubscriber,
    hashPassword,
    comparePassword,
    checkUsername
}
