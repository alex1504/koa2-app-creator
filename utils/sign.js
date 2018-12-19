const jwt = require('jsonwebtoken')
const {
    SECRET_KEY
} = require('../config')

module.exports = {
    /**
     * 根据payload生成Token
     * @param {Object} payload {id, role}
     */
    sign(payload = {}) {
        return jwt.sign(payload, SECRET_KEY)
    }
}