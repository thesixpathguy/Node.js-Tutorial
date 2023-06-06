const fs = require('fs')
const path = require('path')

const rs = fs.createReadStream(path.join(__dirname, 'output.txt'), {encoding: 'utf8'})

const ws = fs.createWriteStream(path.join(__dirname, 'newFile.txt'))

// using listner 'on' -- listens for incoming data
// rs.on('data', (data) => {
//     ws.write(data)
// })

rs.pipe(ws)