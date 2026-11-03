
const http = require("http");
const fs = require("fs");
const path = require("path");

const servidor = http.createServer((req, res) => {

    // Mostrar la página principal
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        fs.createReadStream(
            path.join(__dirname, "index.html")
        ).pipe(res);

        return;
    }

    // Recibir los datos autorizados
    if (req.method === "POST" && req.url === "/registrar") {

        let cuerpo = "";

        req.on("data", parte => {

            cuerpo += parte;

            if (cuerpo.length > 10000) {
                req.destroy();
            }

        });

        req.on("end", () => {

            try {

                const datos = JSON.parse(cuerpo);

                // Dirección de conexión observada por Node.js.
                // Puede ser la del proxy del alojamiento.
                const ip = req.socket.remoteAddress;

                console.log("\n================================");
                console.log("NUEVA PARTICIPACION EDUCATIVA");
                console.log("================================");

                console.log("IP de conexión:", ip);

                console.log("Navegador:",
                    String(datos.navegador || "").slice(0, 500));

                console.log("Sistema:",
                    String(datos.plataforma || "").slice(0, 100));

                console.log("Dispositivo móvil:",
                    Boolean(datos.movil));

                console.log("Idioma:",
                    String(datos.idioma || "").slice(0, 30));

                console.log("Pantalla:",
                    String(datos.pantalla || "").slice(0, 30));

                console.log("Fecha:",
                    new Date().toLocaleString());

                console.log("================================\n");

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    correcto: true
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    correcto: false
                }));

            }

        });

        return;
    }

    // Rutas no encontradas
    res.writeHead(404, {
        "Content-Type": "text/plain"
    });

    res.end("Pagina no encontrada");

});

const PUERTO = process.env.PORT || 3000;

servidor.listen(PUERTO, "0.0.0.0", () => {

    console.log("================================");
    console.log("LABORATORIO DE PRIVACIDAD");
    console.log("Servidor iniciado correctamente");
    console.log("Puerto:", PUERTO);
    console.log("================================");

});
