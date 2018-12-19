const {
    sign
} = require('../utils/sign')
const {
    ROLE
} = require('../config')
const {
    User
} = require('../models/index')

module.exports = {
    login: async (ctx, next) => {
        const username = ctx.request.body.username
        const password = ctx.request.body.password
        if (!username || !password) {
            return ctx.body = ctx.state.fail(2)
        }
        const user = await User.findOne({
            where: {
                username,
                password
            },
            attributes: {
                exclude: ['password']
            },
            raw: true
        })
        if (!user) {
            return ctx.body = ctx.state.fail(4)
        }
        ctx.body = ctx.state.success({
            ...user,
            token: sign({
                id: user.id,
                role: ROLE.user
            })
        })
    },
    getAllUser: async (ctx, next) => {
        const users = await User.findAll({
            raw: true
        })
        return ctx.body = ctx.state.success({
            users
        })
    },
    getUser: async (ctx, next) => {
        const id = ctx.state.user.id
        const user = await User.findById(id, {
            attributes: {
                exclude: ['password']
            },
            raw: true
        })
        ctx.body = ctx.state.success(user)
    }
}