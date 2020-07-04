const http = require("http");
const request = require("request");
const nodemailer = require("nodemailer");

function app(req, res) {
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write("<h1>Vitajte v aplikacii na vtipy o Chuck Norrisovi</h1>");
    res.write("<a href='/posli'>posli vtip na email</a>");
    res.end();
  } else if (req.url === "/posli") {
    //request na REST API o Chuckovi Norrisovi:
    request("https://api.chucknorris.io/jokes/random", { json: true }, function(
      err,
      response,
      body
    ) {
      if (err) {
        console.log(err);
        res.end();
      } else {
        //odoslanie emailov - odosielatel:
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "username@gmail.com",
            pass: "userpassword"
          }
        });

        //hlavicka, telo emailu a adresat/adresati:
        var mailOptions = {
          from: "niekto@gmail.com",
          to: "dedomraz@pobox.sk, jozko.mrkvicka@gmail.com",
          subject: "vtip Chuck",
          text: body.value
        };

        //spustenie odoslania emailu/emailov:
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            res.end();
          } else {
            console.log("Email sent: " + info.response);
            res.writeHead(200, { "content-type": "text/html" });
            res.write("<h1>Vtip bol odoslany na emaily</h1>");
            res.write("<a href='/'>Home</a>");
            res.end();
          }
        });
      }
    });
  } else {
    res.writeHead(404, { "content-type": "text/html" });
    res.write("<h1>page not found</h1>");
    res.end();
  }
}

const server = http.createServer(app);

server.listen(8080);
