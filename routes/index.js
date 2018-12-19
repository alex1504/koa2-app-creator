const router = require("koa-router")();

//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
//

router.get("/index", async (ctx) => {
    await ctx.render('index.ejs', {
        title: 'title'
    })
});

module.exports = router;