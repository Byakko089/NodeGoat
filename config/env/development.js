module.exports = {
   // If you want to debug regression tests, you will need the following which is also in the test config:
   
   // Local instance.
   // To install mongodb: https://docs.mongodb.org/manual/tutorial/
   // With mongodb installed, All you should need to do is uncomment the `db` property below, and run the following command:
   // grunt db-reset:development
   // That will create the local nodegoat data-store, or restore it to a clean state if it already exists.
   db: "mongodb://localhost:27017/nodegoatsecure",
   
   zapHostName: "localhost",
   zapPort: "8080",
   // Required from Zap 2.4.1. This key is set in Zap Options -> API _Api Key.
   zapApiKey: "v9dn0balpqas1pcc281tn5ood1",
   // Required if debugging security regression tests.
   zapApiFeedbackSpeed: 5000, // Milliseconds.
   //environmentalScripts: [`<script>document.write("<script src='http://" + (location.host || "localhost").split(":")[0] + ":35729/livereload.js'></" + "script>");</script>`]
};
