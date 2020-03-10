/* 
 自定义接口的参数格式
	code 0=>成功 1=>失败
 */

const success = (ctx, data = '') => {
	return ctx.body = {
		code: 0,
		data,
	}
}
const error = (ctx, error) => {
	return ctx.body = {
		code: 1,
		data: '',
		msg: error,
	}
}

module.exports = {
	success,
	error
}
