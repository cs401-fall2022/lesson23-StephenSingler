var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          if (rows.length === 1) {
            db.all(`SELECT blog_id, blog_txt FROM blog`, (err, rows) => {
              res.render('index.pug', { title: 'Express', data: rows });
            });
          } else {
            db.exec(`CREATE TABLE blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_txt text NOT NULL);

                      INSERT INTO blog (blog_txt)
                      VALUES ('entry 1'),
                             ('entry 2');`,
              () => {
                db.all(`SELECT blog_id, blog_txt FROM blog`, (err, rows) => {
                  res.render('index.pug', { title: 'Express', data: rows });
                });
              });
          }
        });
    });
});

module.exports = router;
