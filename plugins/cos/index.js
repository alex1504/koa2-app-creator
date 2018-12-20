const COS = require('cos-nodejs-sdk-v5');
const FileDealer = require('../fileDealer/index')
const path = require('path')

const fileDealer = new FileDealer()

class TecentCos {
    constructor(options) {
        const defaultOptions = {
            appid: '',
            secretId: '',
            secretKey: '',
            bucket: '',
            region: ''
        }
        options = Object.assign(defaultOptions, options)

        for (let key in options) {
            this[key] = options[key]
        }

        this.cos = new COS({
            SecretId: this.secretId,
            SecretKey: this.secretKey,
        })
    }

    /**
     * 本地文件分片上传到cos
     * @param {string}   filename     文件名
     * @param {string}   filePath     文件路径
     * @param {Boolean}  isPrefix     文件名是否添加前缀保证唯一性
     */
    sliceUpload(filename, filePath, isPrefix = false) {
        return new Promise((resolve, reject) => {
            if (isPrefix) {
                const random = parseInt(Math.random() * 100000000);
                const timestamp = Date.now();
                filename = `${timestamp}-${random}-${filename}`
            }
            this.cos.sliceUploadFile({
                Bucket: `${this.bucket}-${this.appid}`,
                Region: this.region,
                Key: filename,
                FilePath: filePath
            }, function (err, data) {
                if (err) {
                    return reject(err)
                }
                resolve(data)
            });
        })
    }
    /**
     * 下载cos文件到本地
     * @param {string} filename 文件名
     * @param {string} output   下载输出路径
     */
    download(filename, output) {
        const params = {
            Bucket: `${this.bucket}-${this.appid}`,
            Region: this.region,
            Key: filename,
            Output: output
        };
        return new Promise((resolve, reject) => {
            this.cos.getObject(params, (err, data) => {
                if (err) {
                    return reject(err)
                }
                resolve(data)
            });
        })
    }

    /**
     * 上传网络文件到cos
     * @param {string} fileUrl  网络文件地址
     * @param {string} output   临时文件输出路径
     */
    async uploadNetResource(fileUrl, output) {
        try {
            const filePath = await fileDealer.download(fileUrl, output, true)
            const filename = path.basename(filePath)
            return await this.sliceUpload(filename, filePath)
        } catch (err) {
            return err
        }
    }

    /**
     * 上传客户端文件到cos
     * @param {object} file    解析得到的客户端file对象
     * @param {string} output  文件输出路径
     */
    async uploadClientResource(file, output) {
        if (!output) {
            output = path.resolve('/tmp')
        }
        try {
            const filePath = await fileDealer.downloadClientResource(file, output)
            const filename = path.basename(filePath)
            return await this.sliceUpload(filename, filePath)
        } catch (err) {
            return err
        }
    }
}

module.exports = TecentCos