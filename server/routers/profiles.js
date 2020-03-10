const router = require('koa-router')();
const Models = require('../models');
const Sequelize = require('sequelize');
const {
	success,
	error
} = require('./response')

/* 
添加信息接口
 @url    POST /profiles/add
 @req    type,describe,income,expend,cash,remark
 @access private
 */
router.post('/add', async ctx => {
	let type = ctx.request.body.type.trim();
	let describe = ctx.request.body.describe.trim();
	let income = ctx.request.body.income.trim();
	let expend = ctx.request.body.expend.trim();
	let cash = ctx.request.body.cash.trim();
	let remark = ctx.request.body.remark.trim();

	if (income == '' || expend == '' || cash == '') {
		error(ctx,'信息不完整')
	}
	let profiles = await Models.Profile.build({
		type,
		describe,
		income,
		expend,
		cash,
		remark
	}).save();
	success(ctx,profiles)
});
/* 
获取所有信息
 @url    GET /profiles/all
 @req    page,prepage
 @access private
 */
router.get('/all', async ctx => {
	let page = parseInt(ctx.query.page) || 1;
	let prepage = parseInt(ctx.query.prepage) || 2;
	let offset = (page - 1) * prepage;
	let profiles = await Models.Profile.findAndCountAll({
		limit: prepage,
		offset,
	});
	success(ctx,{
		count: profiles.count,
		data: profiles.rows
	})
})
/* 
获取单个信息
 @url    GET /profiles/:id
 @req    id
 @access private
 */
router.get('/:id', async ctx => {
	// console.log(ctx.params)
	let id = ctx.params.id;
	let profile = await Models.Profile.findOne({
		where: {
			id
		}
	});

	if (profile === null) {
		error(ctx,'不存在该数据')
	} else {
		success(ctx,profile)
	}
})
/* 
编辑单个信息
 @url    Post /profiles/edit
 @req    id
 @access private
 */
router.post('/edit', async ctx => {
	let id = ctx.request.body.id;
	let type = ctx.request.body.type.trim();
	let describe = ctx.request.body.describe.trim();
	let income = ctx.request.body.income.trim();
	let expend = ctx.request.body.expend.trim();
	let cash = ctx.request.body.cash.trim();
	let remark = ctx.request.body.remark.trim();
	
	if (id == '' || income == '' || expend == '' || cash == '') {
		error(ctx,'信息不完整')
	}
	let profiles = await Models.Profile.findOne({
		where: {
			id
		}
	});

	if (profiles === null) {
		error(ctx,'不存在该数据')
	} else {
		let profile = await Models.Profile.update({
			type,
			describe,
			income,
			expend,
			cash,
			remark
		}, {
			where: {
				id
			},
			fields: ['type', 'describe', 'income', 'expend', 'cash', 'remark']
		});
		success(ctx,profile)
		
	}
})
/* 
删除单个信息
 @url    POST /profiles/delete
 @req    id
 @access private
 */
router.post('/delete', async ctx => {
	let id = ctx.request.body.id;
	console.log(id)
	if (id == "") {
		error(ctx,'信息不完整')
	}
	let profiles = await Models.Profile.destroy({
		where: {
			id
		},
		limit: 1
	});
	success(ctx,'删除成功')
})
/* 
删除多个信息
 @url    POST /profiles/delete/choose
 @req    multipleSelection
 @access private
 */
router.post('/delete/choose', async ctx => {
	let deleteItem = ctx.request.body.multipleSelection;
	if (deleteItem == "") {
		error(ctx,'信息不完整')
	}
	let deleteItemIds= deleteItem.map(item=>{
		return item.id
	})
	let profiles = await Models.Profile.destroy({
		where: {
			id:{
				[Sequelize.Op.in]:deleteItemIds
			}
		},
	});
	success(ctx,'删除成功')
})
/* 
按时间搜索
 @url    POST /profiles/search
 @req    search
 @access private
 */
router.post('/search', async ctx => {
	let search = ctx.request.body.search;
	if (search== "") {
		error(ctx,'信息不完整')
	}
	console.log(search)
	let profiles = await Models.Profile.findAll({
		where: {
			createdAt:{
				[Sequelize.Op.gte]:search[0],
				[Sequelize.Op.lte]:search[1]

			}
		},
	});
	success(ctx,profiles)
})
module.exports = router.routes();
