const CODE_MAP = {
    success: {
        0: 'Success'
    },
    fail: {
        1: 'No authorization',
        2: 'Missing params',
        3: 'Role has not access right',
        4: 'Username and password not match',
    }
}

module.exports = async (ctx, next) => {
    ctx.state.success = (res) => {
        return {
            code: 0,
            msg: CODE_MAP['success'][0],
            res,
        }
    }

    ctx.state.fail = (code) => {
        return {
            code,
            msg: CODE_MAP['fail'][code] || 'Not any description'
        }
    }
    return next()
}