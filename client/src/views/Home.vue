<template>
	<div class="home">
		<div class="container">
			<h1 class="title">个人后台</h1>
			<br>
			<div class="info">
				<div class="info-left">
					<ul>
						<li>采用ElementUi和Vue CLI3.0进行前端搭建；</li>
						<li>采用Koa配合Sequelize CLI进行后端的开发和数据库的查询；</li>
						<li>采用JWT的跨域身份验证解决方案，后端使用koa-jwt在登陆时生成token发给前端和验证每次请求的请求头里token的有效性，前端配置axios将接收到的token写入每次请求的请求头中；</li>
						<li>项目的部署，由于后端有node开发，与原本服务器的环境有冲突。如果使用Nginx作端口转发会影响到其他项目，所以将后端部署到另外一台服务器上。</li>
					</ul>
				</div>
				
			</div>

		</div>
	</div>
</template>

<style scoped>
	.home {
		width: 100%;
		height: 100%;
		background: url(../assets/showcase.png) no-repeat;
		background-size: 100% 100%;
	}

	.container {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding-top: 100px;
		background-color: rgba(0, 0, 0, 0.7);
		text-align: center;
		color: white;
	}

	.title {
		font-size: 30px;
	}

	.lead {
		margin-top: 50px;
		font-size: 22px;
	}
	.info-left{
		margin: 3% 20%;
		text-align: left;
		
		}
		.info-left li{
			margin: 10px;
		}
</style>
