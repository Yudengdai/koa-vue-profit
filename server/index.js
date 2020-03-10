const koa = require('koa');
const router = require('./routers/main');
// const KoaBodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const errorHandle = require('./util/errorHandle')
const {
	getUploadDirName,
	getUploadFileExt,
	checkDirExist,
	getUploadFileName
} = require('./util/file')
const jwt = require('koa-jwt')
const path = require('path')
const app = new koa();
const koaBody = require('koa-body');
const {
	secret,
	uploadDir
} = require('./config')


app.use(cors());
//文件上传
app.use(koaBody({
	multipart: true,
	// encoding: 'gzip',
	formidable: {
		uploadDir: path.join(__dirname, uploadDir, 'img'), // 设置文件上传目录
		keepExtensions: true, // 保持文件的后缀
		maxFileSize: 20 * 1024 * 1024, // 设置上传文件大小最大限制，20M
		multipart: true,
		onFileBegin: (name, file) => {
			// 获取文件后缀
			const ext = getUploadFileExt(file.name);
			// 最终要保存到的文件夹目录
			const dirName = getUploadDirName();
			const dir = path.join(__dirname, uploadDir, 'img');
			// 检查文件夹是否存在如果不存在则新建文件夹
			checkDirExist(dir);
			// 获取文件名称
			const fileName = getUploadFileName(ext);
			// 重新覆盖 file.path 属性
			file.path = `${dir}/${fileName}`;
			app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
			app.context.uploadpath[name] = `${dirName}/${fileName}`;
		}
	}
}));
//设置静态文件夹 

app.use(require('koa-static')(__dirname + uploadDir))
//加载自定义401错误
app.use(errorHandle);
//定义不需要判断token的url
app.use(jwt({
	secret,
}).unless({
	path: [/\/register/, /\/login/, /\/img/, /\/upload/, /\/excel/],
}))

// app.use(KoaBodyParser());

app.use(router.routes());
app.use(router.allowedMethods())


// 监听当前机器的地址，端口
app.listen(80,'0.0.0.0');
console.log('listen on 80');

