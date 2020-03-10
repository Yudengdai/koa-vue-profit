const router = require('koa-router')();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const Models = require('../models');
const Sequelize = require('sequelize');
const axios = require('axios');
const {
	secret,
	secretTime
} = require('../config');
const {
	success,
	error
} = require('./response')
/* 
	测试路由是否设置成功
	/user
 */
router.get('/', async ctx => {
	success(ctx, {
		msg: 'good'
	})
})
/* 
注册
 @url    POST /user/register
 @req    username,password,repassword,email,identity
 @access public
 */
router.post('/register', async ctx => {

	console.log(ctx.request.body.username);
	let username = ctx.request.body.username.trim();
	let password = ctx.request.body.password.trim();
	let repassword = ctx.request.body.repassword.trim();
	let email = ctx.request.body.email.trim();
	let identity = ctx.request.body.identity.trim();

	if (username == '' || password == '' || repassword == '') {
		error(ctx, '用户名或密码不能为空')
	}
	if (password != repassword) {
		error(ctx, '两次输入的密码不一致')
	}

	let user = await Models.User.findOne({
		where: {
			username
		}
	});

	if (user !== null) {
		error(ctx, '当前用户已经被注册了')
	}
	//获取注册用户的ip和地址
	const getUserIp = (req) => {
		return req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress || // 判断 connection 的远程 IP
			req.socket.remoteAddress || // 判断后端的 socket 的 IP
			req.connection.socket.remoteAddress;
	}
	const getUserAddress = (ip) => {
		let url = `https://restapi.amap.com/v3/ip?ip=${ip}&key=78bad801973307a5fac8467dae87923f`
		axios.get(url)
			.then((res) => {
				console.log(res)
				if (res.data.status == 1) {

					return res.data.province + res.data.city
				} else {
					return "福建省厦门市1"
				}
			})
			.catch(() => {})
	}
	let ip = await getUserIp(ctx.req)
	let address = await getUserAddress(ip)
	console.log(ip + address)
	let newUser = await Models.User.build({
		username,
		email,
		avatar: 'http://127.0.0.1/img/1.jpg',
		address,
		ip,
		identity,
		password: md5(password)
	}).save();
	success(ctx, {
		id: newUser.get('id'),
		username: newUser.get('username')
	})
});
/* 
登录
 @url    POST /user/login
 @req    username,password
 @access public
 */
router.post('/login', async ctx => {
	let username = ctx.request.body.username;
	let password = ctx.request.body.password;
	let user = await Models.User.findOne({
		where: {
			username
		}
	});

	if (user === null) {
		error(ctx, '不存在该用户')
	}

	if (user.get('password') !== md5(password)) {
		error(ctx, '密码错误')
	}
	const userinfo = {
		id: user.id,
		username: user.username,
		avatar: user.avatar,
		identity: user.identity,
	}
	let token = 'Bearer ' + jwt.sign({
		data: userinfo,
	}, secret, {
		expiresIn: '1h',
	})
	success(ctx, token)
})
/* 
token解析
 @url    get /user/current
 @req    
 @access private
 */
router.get('/current', async ctx => {
	let token = ctx.headers.authorization;
	let userinfo = jwt.decode(token.split(' ')[1], secret)
	success(ctx, userinfo)
})


/* 用户列表模块接口 */
/* 
获取所有信息
 @url    GET /user/all
 @req    page,prepage
 @access private
 */
router.get('/all', async ctx => {
	let page = parseInt(ctx.query.page) || 1;
	let prepage = parseInt(ctx.query.prepage) || 2;
	let offset = (page - 1) * prepage;
	let users = await Models.User.findAndCountAll({
		limit: prepage,
		offset,
	});
	success(ctx, {
		count: users.count,
		data: users.rows
	})
})
/* 
获取单个信息
 @url    GET /user/:id
 @req    id
 @access private
 */
router.get('/:id', async ctx => {
	// console.log(ctx.params)
	let id = ctx.params.id;
	let user = await Models.User.findOne({
		where: {
			id
		}
	});

	if (user === null) {
		error(ctx, '不存在该数据')
	} else {
		success(ctx, user)
	}
})
/* 
修改自己信息
 @url    Post /user/edit
 @req    id
 @access private
 */
router.post('/edit', async ctx => {
	let id = ctx.request.body.id;
	let username = ctx.request.body.username.trim();
	let email = ctx.request.body.email.trim();
	let password = ctx.request.body.password.trim();
	let avatar = ctx.request.body.avatar.trim();
	let identity = ctx.request.body.identity.trim();
	let repassword = ctx.request.body.repassword.trim();

	if (username == '' || password == '' || repassword == '') {
		error(ctx, '用户名或密码不能为空')
	}
	if (password != repassword) {
		error(ctx, '两次输入的密码不一致')
	}

	let user = await Models.User.findOne({
		where: {
			username
		}
	});

	let newUser = await Models.User.update({
		username,
		email,
		avatar,
		identity,
		password: md5(password)
	}, {
		where: {
			id
		},
		fields: ['username', 'email', 'avatar', 'identity', 'password']
	});
	success(ctx, newUser)

})
/* 
删除单个信息
 @url    POST /user/delete
 @req    id
 @access private
 */
router.post('/delete', async ctx => {
	let id = ctx.request.body.id;
	console.log(id)
	if (id == "") {
		error(ctx, '信息不完整')
	}
	let user = await Models.User.destroy({
		where: {
			id
		},
		limit: 1
	});
	success(ctx, '删除成功')
})
/* 
删除多个信息
 @url    POST /user/delete/choose
 @req    multipleSelection
 @access private
 */
router.post('/delete/choose', async ctx => {
	let deleteItem = ctx.request.body.multipleSelection;
	if (deleteItem == "") {
		error(ctx, '信息不完整')
	}
	let deleteItemIds = deleteItem.map(item => {
		return item.id
	})
	let user = await Models.User.destroy({
		where: {
			id: {
				[Sequelize.Op.in]: deleteItemIds
			}
		},
	});
	success(ctx, '删除成功')
})
/* 
按时间搜索
 @url    POST /user/search
 @req    search
 @access private
 */
router.post('/search', async ctx => {
	let search = ctx.request.body.search;
	if (search == "") {
		error(ctx, '信息不完整')
	}
	console.log(search)
	let user = await Models.User.findAll({
		where: {
			username: {
				[Sequelize.Op.like]: search,
			}
		},
	});
	success(ctx, user)
})
module.exports = router.routes();
