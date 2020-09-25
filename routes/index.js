const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser')
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'rt_lorem_ipsum',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RT Lorem' });
});


router.get('/content', function(req, res, next) {
	connection.query(
		'SELECT * FROM KEL_UTAMA ORDER BY NOMOR_RUMAH ASC',
		(error, results) => {
			// console.log(results);
			res.render('content.ejs', {items: results});
		}
	);
});


/* GET open to insert page. */
router.get('/new', (req, res) => {
  res.render('content-new.ejs');
});

/* post for insert data. */
router.post('/create',(req, res) => {
  let data = {NOMOR_RUMAH: req.body.itemNomorRumah, NAMA_KEPALA_KELUARGA: req.body.itemNamaWarga,NIK: req.body.itemNik };
  let sql = "INSERT INTO KEL_UTAMA SET ?";
  let query = connection.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/content');
  });
});


/* GET edit page */
router.get('/edit/:NOMOR_RUMAH', (req, res) => {
  connection.query(
  'select * from KEL_UTAMA where NOMOR_RUMAH = ?',
  [req.params.NOMOR_RUMAH],
  (error, results) =>{
    res.render('content-edit.ejs',{item:results[0]});
  }
  );
});

/* POST for update data. */
router.post('/update',(req, res) => {
  let sql = `UPDATE KEL_UTAMA SET NAMA_KEPALA_KELUARGA='${req.body.itemNamaWarga}', NIK='${req.body.itemNik}' WHERE NOMOR_RUMAH=${req.body.itemNomorRumah}`;
  let query = connection.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/content');
  });
});


router.post('/delete',(req, res) => {
  console.log(req.body.nomor_rumah);
  let sql = `DELETE FROM KEL_UTAMA WHERE NOMOR_RUMAH=${req.body.nomor_rumah}`;
  let query = connection.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/content');
  });
});


/* GET edit page */
router.get('/view/:NOMOR_RUMAH', (req, res) => {
  connection.query(
  'select * from KEL_UTAMA where NOMOR_RUMAH = ?',
  [req.params.NOMOR_RUMAH],
  (error, results) =>{
    res.render('content-edit.ejs',{item:results[0]});
  }
  );
});


module.exports = router;
