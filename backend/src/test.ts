var diskDb = require('diskdb');
var db=diskDb.connect("./",["test.json"]);
db.get()