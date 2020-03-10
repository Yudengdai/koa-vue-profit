const router = require('koa-router')();


const user = require('./user')
const profiles = require('./profiles')
const news = require('./news')
const upload = require('./upload')
const excel = require('./excel')
//测试路由是否设置成功
router.get('/', async ctx => {
	success(ctx, {
		msg: 'good'
	})
})
router.use('/user', user)
router.use('/profiles', profiles)
router.use('/news', news)
router.use( upload)
router.use( excel)

module.exports = router;
