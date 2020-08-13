const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const pdf = require('./createPdf');
const fs = require('fs');
const server = "http://172.17.0.1:4000";
const app = express();
const port = process.argv[2]; 

const storage = multer.diskStorage({
	destination:'imagenes',
	filename:(req,file,cb)=>{
	cb(null,imgCache(file.originalname));
	}		
});

app.use(express.json());
app.use(require('express-status-monitor')());

app.use(multer({
	storage,
	dest:'imagenes'	
}).single('file'));


function imgCache(nameFile){
	var separador = nameFile.split(".");
	var cache = "imgCache" + "."+ separador[1];
	return cache;
}



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/info', (req, res) => {
    var data = req.body;
})


app.post('/addPatient', (req, res) => {
    var data = req.body;
    sendPatient(data);
    res.send("LLEGO LA INFO");
})

app.get('/getData', (req, res) => {
    axios.get(server + '/getData')
      .then(function (response) {
        res.json(response.data)
      })
      .catch(function (error) {
        console.log("Fallo");
      });
})


app.get('/getPdf', (req,res) => {  
  var filePath = "/informe.pdf";
  fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
})

app.post('/createPdf', (req,res) => {  
  axios.post( server + '/getCity', req.body)
  .then( function (response) {
    var save =  pdf.createPdf(response.data);
    res.send(save);
  })
  .catch(function (error) {
    console.log("Fallo");
  });
})

app.post('/sendImage', (req, res) => {
   sendImg(req);
});


function sendPatient(data){
  axios.post( server + '/savePatient', data)
    .then(function (response) {
      console.log("se guardo el paciente");
    })
    .catch(function (error) {
      console.log("Fallo");
    });
}

function sendImg(req){
	var img = fs.readFileSync(req.file.path);
	var data = new FormData();
	data.append('file',img, req.file.originalname);
	var  url = server + '/sendImage';
	axios.post(url, data, {
		headers: data.getHeaders()
	})
	  .then((response) => {
		var data = response.data;
	  }, (error) => {
		console.log(error);
	  });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})