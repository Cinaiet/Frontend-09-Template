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
  width: 100px;
  height: 100px;
  background-color: gray;
}
</style>
<body>
<div id="box"></div>
</body>
</html>`
    )
  })
}).listen(8088)

console.log('server started')