const crypto = require('crypto')

/**
 * url请求拦截规则，timestamp，sign
 */

function objKeySortStr(obj) {
    let newkey = Object.keys(obj).sort();
    let str = '';
    for (let i = 0; i < newkey.length; i++) {
        str += newkey[i].toLowerCase()
        str += obj[newkey[i]];
    }
    return str;
}

module.exports = async (ctx, next) => {
    const timestamp = ctx.request.header['timestamp']
    const sign = ctx.request.header['sign']

    if (!timestamp) {
        return ctx.body = ctx.state.fail(1)
    }
    if (!sign) {
        return ctx.body = ctx.state.fail(1)
    }

    // timestamp与当前服务器时间对比需要在5分钟之内，否则为超时
    const isTimeout = Math.abs(Date.now() - timestamp) > 5 * 60 * 1000
    if (isTimeout) {
        return ctx.body = ctx.state.fail(1)
    }

    const str = objKeySortStr({
        ...ctx.request.body || {},
        timestamp
    })

    const signRender = crypto.createHash('md5').update(str).digest('hex')

    console.table({
        actualSign: sign,
        expectedSign: signRender
    })


    if(sign !== signRender){
        return ctx.body = ctx.state.fail(1)
    }

    return next()
}