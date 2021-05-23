const http = require('http')

http.createServer((req, res) => {
  let body = []
  req.on('error', (err) => {
    console.log('err', err)
  }).on('data', (chunk) => {
    body.push(chunk.toString())
  }).on('end', () => {
    body =  (Buffer.concat([ Buffer.from(body.toString()) ])).toString()
    console.log("body", body)
    res.writeHead(200, { 'Content-Type': 'text/html'})
    res.end(
`<html lang="en">
<head>
</head>
<style>
#box {
  width: 500px;
  height: 300px;
  background-color: rgb(255, 255, 255);
  display: flex;
}
#myid {
  background-color: rgb(255, 0, 0);
  width: 200px;
  height: 200px;
}
.c1 {
  background-color: rgb(0, 255, 0);
  flex: 1;
}
</style>
<body>
<div id="box">
  <div id="myid"></div>
  <div class="c1"></div>
</div>
</body>
</html>`
    )
  })
}).listen(8088)

console.log('server started')