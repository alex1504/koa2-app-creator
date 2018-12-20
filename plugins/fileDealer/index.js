const request = require('request')
const path = require('path')
const fs = require('fs')

class FileDealer {
    constructor(options) {
        const defaultOptions = {}
        options = Object.assign(defaultOptions, options)

        for (let key in options) {
            this[key] = options[key]
        }
    }
    /**
     * 下载网络文件到本地
     * @param {string}  fileUrl       文件网络地址
     * @param {string}  output        输出文件路径
     * @param {Boolean}  isPrefix     文件名是否添加前缀保证唯一性
     */
    downloadNetResource(fileUrl, output, isPrefix = true) {
        const timestamp = Date.now();
        const random = parseInt(Math.random() * 100000000);
        const dirname = path.dirname(output)
        let basename = path.basename(output)

        if (isPrefix) {
            basename = `${timestamp}-${random}-${basename}`
        }
        output = path.join(dirname, basename)

        const flag = fs.existsSync(dirname);
        if (!flag) {
            fs.mkdirSync(dirname);
        }

        const ws = fs.createWriteStream(output)
        return new Promise((resolve, reject) => {
            request
                .get(fileUrl)
                .on('error', function (err) {
                    reject(err)
                })
                .pipe(ws)
            ws.on('finish', () => {
                resolve(output)
            })
            ws.on('error', (err) => {
                reject(err)
            })
        })
    }
    /**
     * 从客户端下载文件
     * @param {object} file   文件对象
     * @param {string} output 接收文件路径
     */
    downloadClientResource(file, output) {
        return new Promise((resolve, reject) => {
            if (typeof file !== 'object') {
                throw Error('file param is not an object')
            }
            const dirname = path.dirname(output)

            const isDirExist = fs.existsSync(dirname);
            if (!isDirExist) {
                fs.mkdirSync(dirname);
            }

            const timestamp = Date.now();
            const random = parseInt(Math.random() * 100000000);
            const basename = `${timestamp}-${random}-${file.filename}`
            output = path.join(dirname, basename)

            const ws = fs.createWriteStream(output)
            fs.createReadStream(file.path).pipe(ws)

            ws.on('finish', () => {
                resolve(output)
            });
            ws.on('error', (err) => {
                reject(err);
            });
        })
    }

}

module.exports = FileDealer