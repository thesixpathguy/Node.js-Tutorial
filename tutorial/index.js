const fsPromises = require('fs').promises
const path = require('path')

const fileOps = async() => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'input.txt'), 'utf8')
        fsPromises.unlink(path.join(__dirname, 'input.txt'))
        // console.log(data)
        await fsPromises.writeFile(path.join(__dirname, 'output.txt'), 'Nice to meet you')
        // console.log('writing done')
        await fsPromises.appendFile(path.join(__dirname, 'output.txt'), 'Will see you there' + data)
        // console.log('appending done')
        const data1 = await fsPromises.readFile(path.join(__dirname, 'output.txt'), 'utf8')
        console.log(data1)
    } catch (err) {
        console.log(err)
    }
}

fileOps()

// fs.readFile(path.join(__dirname, 'input.txt'), 'utf8',  (err, data) => {
//     if (err) throw err
//     console.log(data)
// })

// console.log('Hello...')

// fs.writeFile(path.join(__dirname, 'output.txt'), 'Nice to meet you', (err) => {
//     if (err) throw err
//     console.log("op completed")
// })

// fs.appendFile(path.join(__dirname, 'output.txt'), 'Will see you there', (err) => {
//     if (err) throw err
//     console.log("append completed")
// })