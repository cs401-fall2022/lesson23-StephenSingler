var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(`SELECT blog_id, blog_txt FROM blog`, (err, rows) => {
              console.log("Returning " + rows.length + " records");
              res.render('index', { title: 'Express', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`CREATE TABLE blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_txt text NOT NULL);
                      INSERT INTO blog (blog_txt)
                      VALUES ('This is the first entry on the blog !!'),
                             ('Heres the second one, some filler text for you.');`,
              () => {
                db.all(`SELECT blog_id, blog_txt FROM blog`, (err, rows) => {
                  res.render('index', { title: 'My ePiC Blog', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  console.log("Adding blog entry to table");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error: " + err);
        exit(1);
      }
      console.log("Inserting: " + req.body.blog);
      db.run("INSERT INTO blog (blog_txt) VALUES (?)", [req.body.blog]);
      //redirect to homepage
      res.redirect('/');
    }
  );
});

router.post('/delete', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("deleting " + req.body.blog);
      db.run("DELETE FROM blog WHERE blog_id= ?", [req.body.blog]);     
      res.redirect('/');
    }
  );
})

router.post('/edit', (req, res, next) => {
  console.log("Editing specified blog entry");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error: " + err);
        exit(1);
      }
      console.log("Editing: " + req.body.blog);
      db.run("UPDATE blog SET blog_txt = ? WHERE blog_id = ?", [req.body.txt, req.body.blog_id]);
      //redirect to homepage
      res.redirect('/');
    }
  );
});

module.exports = router;