var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  dir = process.argv[2] || process.cwd(),
  port = process.argv[3] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
  var filename = path.join(dir, uri);

  path.exists(filename, function(exists) {
    if (!exists) {
      response.writeHead(404, {
        "Content-Type": "text/plain"
      });
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain"
        });
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Node-static file server running at\n  => http://localhost:" + port + "/\n  => " + dir + "/\n CTRL + C to shutdown");