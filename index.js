const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//estabelencendo a conexão
	
	const connection = mysql.createConnection({
	  host     : 'us-cdbr-iron-east-05.cleardb.net',
	  port     : 3306,
	  user     : 'b09e1b52c84fbe',
	  password : 'c70ff534',
	  database : 'heroku_720dfde834c09a4'
	});

	connection.connect(function(err){
	  if(err) return console.log(err);
	  console.log('conectou!');
	  createDatabase(connection);
	})

	function createDatabase(conn){
	
		//var databaseSql = "CREATE DATABASE IF NOT EXISTS vejapormim;";  
		
		//conn.query(databaseSql, function (error, results, fields){
		//	if(error) return console.log(error);
		//	console.log('criou o banco!');
	//	});
		
			var databaseSql = "USE heroku_720dfde834c09a4;";  
			conn.query(databaseSql, function (error, results, fields){
				if(error) return console.log(error);
				console.log('esta usando o banco!');
				createTable(connection);
			});
		
		
		
	}
	
	function createTable(conn){
				  
	var tableSql = "CREATE TABLE IF NOT EXISTS Obstaculos (\n"+
	   			  "ID int NOT NULL AUTO_INCREMENT,\n"+
				  "Type varchar(150) NOT NULL,\n"+
				  "Latitude numeric(10) NOT NULL,\n"+
				  "Longitude numeric(10) NOT NULL,\n"+
				  "PRIMARY KEY (ID)\n"+
				  ");";
					  
			conn.query(tableSql, function (error, results, fields){
			  if(error) return console.log(error);
			  console.log('criou a tabela!');
			 
		  });
	}


//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

router.get('/Obstacle/get', (req, res) =>{
    execSQLQuery('SELECT * FROM Obstaculos', res);
	console.log(req.query.lat);     
    console.log(req.query.lng);     
    console.log(req.query.type);
})

router.post('/Obstacle/insert', (req, res) =>{
    const latitude = req.body.lat.substring(0,15);
    const longitude = req.body.lng.substring(0,15);
	const tipo = req.body.type.substring(0,15);
    execSQLQuery(`INSERT INTO Obstaculos(Latitude, Longitude, Type) VALUES('${latitude}','${longitude}', "${tipo}")`, res);
	});

//inicia o servidor
app.listen(process.env.PORT || 3000); //use port 3000 when testing locally, and the dinamic port assigned by Heroku when testing on this environment.
console.log('API funcionando!');

//faz uma query a cada 5 segundos pra manter a conexão com o banco ativa 
setInterval(function () {
    connection.query('SELECT 1');
}, 5000);

function execSQLQuery(sqlQry, res){
	

	const connection = mysql.createConnection({
		host     : 'us-cdbr-iron-east-05.cleardb.net',
		port     : 3306,
		user     : 'b09e1b52c84fbe',
		password : 'c70ff534',
		database : 'heroku_720dfde834c09a4'
    });
 
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
      console.log('executou!');
  });
}
