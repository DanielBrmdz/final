var pdf = require('html-pdf');

let html = '';

module.exports.createPdf = function createPdf(data){
    var names = data.names;
    setHeader(data);
    setBody(names);
    setStyle();
    var confirm = savePdf();
    return confirm;
}

function setHeader(data){
    html = `
    <html>
        <body>
            <div class="title">
                <h1>CASOS DE COVID-19 REGISTADOS EN `+ data.city +`</h1> 
                <h1 id = "titulo"></h1> 
                <script>
                var d = new Date();
                document.getElementById("titulo").innerHTML = d.toDateString()  ;
                </script>
                <h1> TOTAL DE CASOS:`+ data.total +` </h1>  
             </div>`;


}

function setBody(data){
    html = html + `
    
    <table class="egt">  
        <tr>
      
          <th>PACIENTES</th>
      
        </tr>`;

        let table = '';
        for (var i = 0; i < data.length; i++) {
            table = table +` <tr>
      
            <td>`+data[i]+`</td>
        
            </tr>`  
        }
        table  = table + `</table>`;
        html = html + table;


}

function setStyle(){

    html = html + `<style>
    table {
          font-family: 'Arial';
          margin: 25px auto;
          border-collapse: collapse;
          border: 1px solid #eee;
          border-bottom: 2px solid #00cccc;
          box-shadow: 0px 0px 20px rgba(0,0,0,0.10),
              0px 10px 20px rgba(0,0,0,0.05),
              0px 20px 20px rgba(0,0,0,0.05),
              0px 30px 20px rgba(0,0,0,0.05);
          }  
           
          th, td {
              color: #111;
              border: 1px solid #eee;
              padding: 12px 35px;
              border-collapse: collapse;
          }
          th {
              background: #00cccc;
              color: #fff;
              text-transform: uppercase;
              font-size: 12px;

          }

          body {
              background-color: #FFF;
          }
       
          .title {
              font-family: "Montserrat";
              color: #111;
              display: flex;
              flex-direction: column;
              align-items: center;        
              
              letter-spacing: 1px;
          }
</style>


</body>


</html>
`;
}


function savePdf(){
    pdf.create(html).toFile('./informe.pdf', function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log("el archivo se guardo");
        }
    });

    return "ok";
    
}    