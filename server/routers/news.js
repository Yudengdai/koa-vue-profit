const router = require('koa-router')();

const Models = require('../models');
const Sequelize = require('sequelize');
const {
	success,
	error
} = require('./response')

/* 
添加信息接口
 @url    POST /news/add
 @req    title,author,img,content,views,likes
 @access private
 */
router.post('/add', async ctx => {
	console.log(123)
	console.log(ctx.request.body)
	// let newsData=ctx.body.news
	let title = ctx.request.body.title.trim();
	let author = ctx.request.body.author.trim();
	let img = ctx.request.body.img.trim();
	let content = ctx.request.body.content.trim();
	let views = ctx.request.body.views.trim();
	let likes = ctx.request.body.likes.trim();
	
	if (title == '' || img == '' || content == '') {
		error(ctx,'信息不完整')
	}
	let news = await Models.News.build({
		title,author,img,content,views,likes
	}).save();
	success(ctx,news)
});
/* 
获取所有信息
 @url    GET /news/all
 @req    page,prepage
 @access private
 */
router.get('/all', async ctx => {
	let page = parseInt(ctx.query.page) || 1;
	let prepage = parseInt(ctx.query.prepage) || 2;
	let offset = (page - 1) * prepage;
	let news = await Models.News.findAndCountAll({
		limit: prepage,
		offset,
	});
	success(ctx,{
		count: news.count,
		data: news.rows
	})
})
/* 
获取单个信息
 @url    GET /news/:id
 @req    id
 @access private
 */
router.get('/:id', async ctx => {
	// console.log(ctx.params)
	let id = ctx.params.id;
	let news = await Models.News.findOne({
		where: {
			id
		}
	});

	if (news === null) {
		error(ctx,'不存在该数据')
	} else {
		success(ctx,news)
	}
})
/* 
编辑单个信息
 @url    Post /news/edit
 @req    id
 @access private
 */
router.post('/edit', async ctx => {
	let id = ctx.request.body.id.trim();
	let title = ctx.request.body.title.trim();
	let author = ctx.request.body.author.trim();
	let img = ctx.request.body.img.trim();
	let content = ctx.request.body.content.trim();
	let views = ctx.request.body.views.trim();
	let likes = ctx.request.body.likes.trim();
	
	if (id == '' || title == '' || img == '' || content == '') {
		error(ctx,'信息不完整')
	}
	let news = await Models.News.findOne({
		where: {
			id
		}
	});

	if (news === null) {
		error(ctx,'不存在该数据')
	} else {
		let news = await Models.News.update({
			title,author,img,content,views,likes
		}, {
			where: {
				id
			},
			fields: ['title','author','img','content','views','likes']
		});
		success(ctx,news)
		
	}
})
/* 
删除单个信息
 @url    POST /news/delete
 @req    id
 @access private
 */
router.post('/delete', async ctx => {
	let id = ctx.request.body.id;
	console.log(id)
	if (id == "") {
		error(ctx,'信息不完整')
	}
	let news = await Models.News.destroy({
		where: {
			id
		},
		limit: 1
	});
	success(ctx,'删除成功')
})
/* 
删除多个信息
 @url    POST /news/delete/choose
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
	let news = await Models.News.destroy({
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
 @url    POST /news/search
 @req    search
 @access private
 */
router.post('/search', async ctx => {
	let search = ctx.request.body.search;
	if (search== "") {
		error(ctx,'信息不完整')
	}
	console.log(search)
	let news = await Models.News.findAll({
		where: {
			createdAt:{
				[Sequelize.Op.gte]:search[0],
				[Sequelize.Op.lte]:search[1]

			}
		},
	});
	success(ctx,news)
})
module.exports = router.routes();
