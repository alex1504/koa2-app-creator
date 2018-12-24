/**
 * 根据用户ROLE类型限定用户访问API的权限中间件
 * 除了管理员，用户只允许读写用户自己的信息
 */
module.exports = (ctx, next) => {
    const uid = ctx.params.uid || ctx.request.body.uid || ctx.query.uid
    if (!uid) {
        return ctx.body = ctx.state.fail(2)
    }
    const user = ctx.state.user
    if (user.role === 'admin') {
        return next()
    }
    if (parseInt(uid) !== user.id) {
        return ctx.body = ctx.state.fail(3)
    }
    return next()
}