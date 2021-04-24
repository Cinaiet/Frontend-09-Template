const net = require('net');
const parser = require('./parser')
class Request {
  constructor(props) {
    this.method = props.method || 'GET',
    this.host = props.host
    this.port = props.port
    this.path = props.path || '/'
    this.body = props.body ||  {}
    this.headers = props.headers || {}
    if(!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if(this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)

    }  else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `key=${encodeURIComponent(this.body[key])}`).join('&')
    }
    this.headers['Content-length'] = this.bodyText.length
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser
      if(connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }

      connection.on('data', (data) => {
        // console.log(data.toString())
        parser.recceive(data.toString())
        if(parser.isFinished) {
          resolve(parser.response)
          connection.end()
        }
      })

      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })

    })
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`

  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINT_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerVal = ''
    this.bodyParser = null
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  recceive(str) {
    for(let i = 0; i < str.length; i++) {
      this.reveiveChar(str.charAt(i)) 
    }
  }

  reveiveChar(char) {
    if(this.current === this.WAITING_STATUS_LINE) {
      if(char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else {
        this.statusLine += char
      }
    } else if(this.current === this.WAITING_STATUS_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if(this.current === this.WAITING_HEADER_NAME) {
      if(char === ':') {
        this.current = this.WAITING_HEADER_SPACE
      } else if(char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
        if(this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser()
        }
      } else {
        this.headerName += char
      }
    } else if(this.current === this.WAITING_HEADER_SPACE) {
      if(char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    } else if(this.current === this.WAITING_HEADER_VALUE) {
      if(char === '\r') {
        this.current = this.WAITING_HEADER_LINT_END
        this.headers[this.headerName] = this.headerVal
        this.headerName = ''
        this.headerVal = ''
      } else {
        this.headerVal += char
      }
    } else if(this.current === this.WAITING_HEADER_LINT_END) {
      if(char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if(this.current === this.WAITING_HEADER_BLOCK_END) {
      if(char === '\n') {
        this.current = this.WAITING_BODY
      }
    } else if(this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_THUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }

  receiveChar(char) {
    if(this.current === this.WAITING_LENGTH) {
      if(char === '\r') {
        if(this.length === 0) {
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_LINE_END
      } else {
        this.length *= 16
        this.length += parseInt(char, 16)
      }
    } else if(this.current === this.WAITING_LENGTH_LINE_END) {
      if(char === '\n') {
        this.current = this.READING_THUNK
      }
    } else if(this.current === this.READING_THUNK) {
      this.content.push(char)
      this.length --;
      if(this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    } else if(this.current === this.WAITING_NEW_LINE) {
      if(char === '\r') {
        this.current = this.WAITING_NEW_LINE_END
      }
    } else if(this.current === this.WAITING_NEW_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
  }
  
}

void async function() {
  let request = new Request({
    method: 'POST',
    host: 'localhost',
    port: '8088',
    path: '/',
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: {
      name: 'Cinaiet'
    }
  })

  let response = await request.send()
  let dom = parser.parserHtml(response.body)
  var cache = [];
  var str = JSON.stringify(dom, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // 移除
              return
          }
          // 收集所有的值
          cache.push(value)
      }
      return value;
  });
  cache = null
  console.log(str)
}()