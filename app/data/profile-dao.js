/* The ProfileDAO must be constructed with a connected database object */
function ProfileDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ProfileDAO)) {
        console.log("Warning: ProfileDAO constructor called without 'new' operator");
        return new ProfileDAO(db);
    }

    const users = db.collection("users");

    /* Fix for A6 - Sensitive Data Exposure

    // Use crypto module to save sensitive data such as ssn, dob in encrypted format
    const crypto = require("crypto");
    const config = require("../../config/config");

    /// Helper method create initialization vector
    // By default the initialization vector is not secure enough, so we create our own
    const createIV = () => {
        // create a random salt for the PBKDF2 function - 16 bytes is the minimum length according to NIST
        const salt = crypto.randomBytes(16);
        return crypto.pbkdf2Sync(config.cryptoKey, salt, 100000, 512, "sha512");
    };

    // Helper methods to encryt / decrypt
    const encrypt = (toEncrypt) => {
        config.iv = createIV();
        const cipher = crypto.createCipheriv(config.cryptoAlgo, config.cryptoKey, config.iv);
        return `${cipher.update(toEncrypt, "utf8", "hex")} ${cipher.final("hex")}`;
    };

    const decrypt = (toDecrypt) => {
        const decipher = crypto.createDecipheriv(config.cryptoAlgo, config.cryptoKey, config.iv);
        return `${decipher.update(toDecrypt, "hex", "utf8")} ${decipher.final("utf8")}`;
    };
    */

    /* Fix A6 - Part 3

    // se cambia la funcion const por var para que no genere un error al ingresar una variable */
    
    var crypto = require("crypto");

    //Set keys config object
    var config = {
        cryptoKey: "a_secure_key_for_crypto_here",
        cryptoAlgo: "aes256", // or other secure encryption algo here
        iv: ""
    };

    // metodo auxiliar crea el vector de inicializacion
    // el vector de inicializacion no es seguro, por tal motivo creamos el nuestro*/
    
    var createIV = function() {
        // Crea un salt aleatorio para la funcion - tomando como longitud minima los 16 bits segun NIST
        var salt = crypto.randomBytes(16);
        return crypto.pbkdf2Sync(config.cryptoKey, salt, 100000, 512, "sha512");
    };

    //Meto auxiliar de encriptacion y desencriptar
    var encrypt = function(toEncrypt) {
        config.iv = createIV();
        var cipher = crypto.createCipheriv(config.cryptoAlgo, config.cryptoKey, config.iv);
        return cipher.update(toEncrypt, "utf8", "hex") + cipher.final("hex");
    };

    var decrypt = function(toDecrypt) {
        var decipher = crypto.createDecipheriv(config.cryptoAlgo, config.cryptoKey, config.iv);
        return decipher.update(toDecrypt, "hex", "utf8") + decipher.final("utf8");
    };
    
    // Encriptar los valores luego de salvar los datos
    user.ssn = encrypt(ssn);
    user.dob = encrypt(dob);
    
    // Descrifrar valores para verlos en la vista
    user.ssn = decrypt(user.ssn);
    user.dob = decrypt(user.dob);

    //
    

    this.updateUser = (userId, firstName, lastName, ssn, dob, address, bankAcc, bankRouting, callback) => {

        // Create user document
        const user = {};
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (address) {
            user.address = address;
        }
        if (bankAcc) {
            user.bankAcc = bankAcc;
        }
        if (bankRouting) {
            user.bankRouting = bankRouting;
        }
        if (ssn) {
            user.ssn = ssn;
        }
        if (dob) {
            user.dob = dob;
        }
        /*
        // Fix for A7 - Sensitive Data Exposure
        // Store encrypted ssn and DOB
        if(ssn) {
            user.ssn = encrypt(ssn);
        }
        if(dob) {
            user.dob = encrypt(dob);
        }
        */

        users.update({
                _id: parseInt(userId)
            }, {
                $set: user
            },
            err => {
                if (!err) {
                    console.log("Updated user profile");
                    return callback(null, user);
                }

                return callback(err, null);
            }
        );
    };

    this.getByUserId = (userId, callback) => {
        users.findOne({
                _id: parseInt(userId)
            },
            (err, user) => {
                if (err) return callback(err, null);
                /*
                // Fix for A6 - Sensitive Data Exposure
                // Decrypt ssn and DOB values to display to user
                user.ssn = user.ssn ? decrypt(user.ssn) : "";
                user.dob = user.dob ? decrypt(user.dob) : "";
                */

                callback(null, user);
            }
        );
    };
}

module.exports = { ProfileDAO };
