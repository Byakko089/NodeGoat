// default app configuration
/*const port = process.env.PORT || 4000;
let db = process.env.MONGODB_URI || "mongodb://localhost:27017/nodegoat";

module.exports = {
    port,
    db,
    cookieSecret: "session_cookie_secret_key_here",
    cryptoKey: "a_secure_key_for_crypto_here",
    cryptoAlgo: "aes256",
    hostName: "localhost",
    environmentalScripts: []
};*/

module.exports = {
    port: process.env.PORT || 4001,
    db:  process.env.MONGOLAB_URI || process.env.MONGODB_URI || "mongodb://nodegoat:owasp@ds159217.mlab.com:59217/nodegoat",
    cookieSecret: "session_cookie_secret_key_here",
    cryptoKey: "a_secure_key_for_crypto_here",
    cryptoAlgo: "aes256",
    hostName: "localhost"
};

