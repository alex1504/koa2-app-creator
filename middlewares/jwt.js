const jwt = require('jsonwebtoken')
const {
    SECRET_KEY
} = require('../config')

const roleMdwGenerator = (userRole) => {
    return async (ctx, next) => {
        const token = ctx.request.header.authorization
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            console.log(decoded)
            const expectedRole = decoded.role;
            if (expectedRole === userRole) {
                ctx.state.user = decoded
                return next()
            } else {
                ctx.body = ctx.state.fail(3)
            }
        } catch (err) {
            ctx.body = ctx.state.fail(1)
        }
    }
}

module.exports = {
    adminLoginAuth: roleMdwGenerator('admin'),
    vipLoginAuth: roleMdwGenerator('vip'),
    userLoginAuth: roleMdwGenerator('user')
}