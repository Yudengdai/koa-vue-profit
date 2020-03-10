const router = require('koa-router')();
const Models = require('../models');
const Sequelize = require('sequelize');
// const formidable = require('formidable');
const nodeExcel = require('excel-export');
const fs = require('fs');
const xlsx = require('node-xlsx');
const path = require('path');
const {
	success,
	error
} = require('./response')
const {
	uploadDir,
	baseUrl
} = require('../config')
//表格导入
router.post('/excel', async ctx => {
	let curPath;
	// 文件上传处理
	let file = ctx.request.files.file;
	// 创建可读流
	// const readStream = fs.createReadStream(file.path);
	// let url = baseUrl + file.path.split('upload')[1];


	// 无论是什么格式都转换成xlsx格式进行保存,因为node-xlsx只能解析xlsx文件
	// curPath = __dirname + fileName + ".xlsx";
	curPath = path.resolve(__dirname, '../upload' + file.path.split('upload')[1]);
	const Data = await importExcel(curPath);
	success(ctx, curPath)
	/* // 将文件写入保存至本地
	let writeStream = fs.createWriteStream(file.path);
	// readStream.pipe(writeStream);
	readStream.pipe(writeStream);
	// 文件写入完成监听
	readStream.on('end', async function() {
		// fs.unlinkSync(tempPath); // 异步删除虚拟文件

		// fs.unlinkSync(curPath); // 导入结束后,异步删除本地文件
	}); */

	async function importExcel(filePath) {
		let workbook = xlsx.parse(filePath), // 获取excel文件对象
			sheet = workbook[0].data; // 获取第一个sheet的数据
		let importSing = {},
			excelImport = [];
		for (let i = 1; i < sheet.length; i++) {
			if (sheet[i] != [] && sheet[i] != '') {
				importSing.type = sheet[i][0];
				importSing.describe = sheet[i][1];
				importSing.income = sheet[i][2];
				importSing.expend = sheet[i][3];
				importSing.cash = sheet[i][4];
				importSing.remark = sheet[i][5];
				excelImport.push(importSing);
				importSing = {}
			}
		}
		console.log(excelImport)
		let profiles = await Models.Profile.bulkCreate(excelImport);

	};

});
router.get('/excel/out', async ctx => {

	let profiles = await Models.Profile.findAll({});
	async function exportdata(v) {
		let conf = {};
		conf.name = "mysheet"; //表格名
		let alldata = new Array();
		for (let i = 0; i < v.length; i++) {
			let arr = new Array();
			arr.push(v[i].type);
			arr.push(v[i].describe);
			arr.push(v[i].income);
			arr.push(v[i].expend);
			arr.push(v[i].cash);
			arr.push(v[i].remark);
			alldata.push(arr);
		}
		//决定列名和类型 					

		conf.cols = [{
			caption: '收支类型',
			type: 'string'
		}, {
			caption: '收支描述',
			type: 'string'
		}, {
			caption: '收入',
			type: 'string'
		}, {
			caption: '支出',
			type: 'string',

		}, {
			caption: '账号现金',
			type: 'string',

		}, {
			caption: '备注',
			type: 'string',

		}];
		conf.rows = alldata; //填充数据
		let result = nodeExcel.execute(conf);
		// 输出到本地
		/* var filePath = "./result.xlsx";
		fs.writeFile(filePath, result, 'binary', function(err) {
			if (err) {
				console.log(err);
			}
			console.log("success!");
		}); */
		//以文件流的形式传给前端
		// ctx.set('Content-Type', 'application/vnd.ms-excel;charset=UTF-8');
		let data = new Buffer(result, 'binary');
		ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");
		ctx.set('Content-Type', 'application/vnd.ms-excel;charset=utf-8');
		// return data;
		ctx.body=data;
	}
	
	let excel = await exportdata(profiles)
	// success(ctx, excel)
	

})

 module.exports = router.routes();
