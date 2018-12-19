const nodemailer = require('nodemailer');

const MAIL_SUPPLIERS = {
    '163': {
        host: 'smtp.163.com',
        port: 25,
        sslPort: 465
    },
    '126': {
        host: 'smtp.126.com',
        port: 25,
        sslPort: 465
    },
    'qq': {
        host: 'smtp.qq.com',
        sslPort: 465
    }
}

class SmtpMailer {
    constructor(options) {
        /**
         * attachments：Array [{filename, path}]
         */
        const defaultOptions = {
            from: '',
            auth: '',
            to: '',
            subject: 'Hello, this is jerry 👻, how do you do！',
            text: 'How do you do！',
            attachments: []
        }
        options = Object.assign(defaultOptions, options)

        for (let key in options) {
            this[key] = options[key]
        }

        const auth = {
            user: this.from,
            pass: this.auth
        };
        const type = this.getType(this.from)
        const secure = true
        const transporterOption = {
            auth,
            secure,
            host: MAIL_SUPPLIERS[type].host,
            port: secure ? MAIL_SUPPLIERS[type].sslPort : MAIL_SUPPLIERS[type].port,
        };

        const transporter = nodemailer.createTransport(transporterOption);

        this.transporter = transporter
    }
    /**
     * 邮件服务商
     */
    getType() {
        const reg = /@([\w\d]+)\.com/i
        const match = reg.exec(this.from)
        return match && match[1] || ''
    }
    send() {
        let mailOptions = {
            from: `"Hello, this is jerry 👻" <${this.from}>`,
            to: this.to,
            subject: this.subject,
            text: this.text,
            attachments: this.attachments
        };
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return Promise.reject(err)
                }
                resolve(info)
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        })
    }
}

module.exports = SmtpMailer