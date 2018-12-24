const router = require('koa-router')()
const {
    UserController
} = require('../controllers/index')

//
// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────────
//
const jwt = require('../middlewares/jwt')
const scopeMiddleware = require('../middlewares/scope')

//
// ─── PREFIX ─────────────────────────────────────────────────────────────────────
//

router.prefix('/users')

//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
//

router
    .post('/', jwt.userLoginAuth, UserController.getAllUser)
    .post('/id/:uid', jwt.userLoginAuth, scopeMiddleware, UserController.getUser)
    .post('/login', UserController.login)


module.exports = router