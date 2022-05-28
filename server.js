const http = require('http');
const url = require('url');
const fs = require('fs');
const { insertar,consultar,actualizar,eliminar} = require("./consultas")


http.createServer(async (req, res) => {

    if(req.url == '/' && req.method == 'GET'){
        res.setHeader("content-type", "text/html");
        res.statusCode = 200;
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html);
    }

    if(req.url == '/cancion' && req.method == 'POST'){
        let body = "";
        req.on("data", (chunk) => {
            body+= chunk;
        });
        req.on("end", async() => {
           // console.log(body);
            const datos = Object.values(JSON.parse(body));
            //console.log(datos);
            const respuesta = await insertar(datos);
            //console.log(respuesta)
            if(respuesta.code){
                res.statusCode = 400;
                res.end(respuesta.message);
            }else {
                res.statusCode = 201;
                res.end();
            }
            
        })
    }
    if(req.url == '/canciones' && req.method == 'GET'){
      // console.log(req);
        consultar().then(resultado =>{
            console.log(resultado);
            res.statusCode = 200;
            res.end(JSON.stringify(resultado));
        }).catch(error =>{
            res.statusCode = 500;
            res.end();
        })
    }

    if(req.url == '/cancion' && req.method == 'PUT'){
        let body = "";
        req.on("data", (chunk) => {
            body+= chunk;
        });
        req.on("end", async() => {
            //console.log(body);
            const datos = Object.values(JSON.parse(body));
            //console.log(datos);
            const respuesta = await actualizar(datos);
            //console.log(respuesta)
            if(respuesta.code){
                res.statusCode = 400;
                res.end(respuesta.message);
            }else {
                res.statusCode = 201;
                res.end();
            }
            
        })
    }


    if(req.url.startsWith('/cancion') && req.method == 'DELETE'){
    
        const { id } = url.parse(req.url, true).query;
       
        //console.log(id);
        eliminar(id).then(respuesta => {
            res.statusCode = 200;
            res.end();
        }).catch(error => {
            res.statusCode = 200;
            console.log(error)
            res.end(JSON.stringify(error));
        })

    }






}).listen(3000, console.log("Servidor corriendo en http://localhost:3000/"))
