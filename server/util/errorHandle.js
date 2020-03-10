/* 
自定义 401 拦截中间件 
	避免直接将 koa-jwt 暴露的错误信息直接返回给用户
 */

module.exports = (ctx, next) => {
	return next().catch((err) => {
		
		if (err.status === 401) {
			ctx.status = 401;
			// ctx.body = {
			// 	error: err.originalError ? err.originalError.message : '登录已过期',
			// };
			ctx.body = err
		} else {
			throw err;
		}
	});
}
