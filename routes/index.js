const router = require("koa-router")();
const redisClient = require('../libs/redis').client

//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
//

router.get("/index", async (ctx) => {
    const value = await redisClient.getAsync1('key')
    console.log(typeof value)
    await ctx.render('index.ejs', {
        title: 'title'
    })
});

module.exports = router;