var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

/* GET post page */
router.get('/', (req, res, next) => {
    res.render('post', { title: 'Post' });
});

router.post('/', (req, res, next) => {
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

module.exports = router;