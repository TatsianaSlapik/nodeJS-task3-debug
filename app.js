var express = require("express");
var app = express();
var db = require("./db");
var user = require("./controllers/usercontroller");
var game = require("./controllers/gamecontroller");
//  var bodyParser = require("body-parser");

// 9. db.sync(); sync() is not a function
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
try {
  db.sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
app.use(express.json());
//removed body-parser
app.use("/api/auth", user);
app.use(require("./middleware/validate-session"));
app.use("/api/game", game);
//10. no PORT (13)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("App is listening on 4000");
});
