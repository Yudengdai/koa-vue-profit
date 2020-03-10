const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const {
	success,
	error
} = require('./response')
const {
	uploadDir,
	baseUrl
} = require('../config')

/* 
图片上传接口
 @url    POST /upload
 @req    file
 @access public
 */
router.post('/upload', async ctx => {
	let file = ctx.request.files.file;
	// for (let file of files) {
	// 创建可读流
	const render = fs.createReadStream(file.path);
	// let filePath = path.join(uploadDir,'img', file.name);
	// url.push( baseUrl+'/img/'+file.name)
	let url=baseUrl+file.path.split('upload')[1];
	// 创建写入流
	const upStream = fs.createWriteStream(file.path);
	render.pipe(upStream);
	// }
	success(ctx,url)
});

module.exports = router.routes();
