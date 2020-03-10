<template>
	<el-row class="menu_page">
		<el-col>

			<el-menu mode="vertical" unique-opened collapse-transition :collapse="menuShow" background-color="#324057"
			 text-color="#fff" active-text-color="#409eff" class="el-menu-vertical-demo">
				<router-link to="/home">
					<el-menu-item index="0">
						<i class="fa fa-margin fa-server"></i>
						<span slot="title">首页</span>
					</el-menu-item>
				</router-link>
				<template v-for="item in items">
					<el-submenu :index="item.path" :key="item.path">
						<template slot="title">
							<i :class="'fa fa-margin '+item.icon"></i>
							<span slot="title">{{item.name}}</span>
						</template>
						<router-link v-for="(citem,cindex) in item.children" :to="citem.path" :key="cindex">
							<el-menu-item :index="citem.path">
								<span slot="title">{{citem.name}}</span>
							</el-menu-item>
						</router-link>
					</el-submenu>
				</template>
			</el-menu>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		name: 'left-menu',
		data() {
			return {

				items: [{
						icon: "fa-money",
						name: "资金管理",
						path: "fund",
						children: [{
							path: "foundlist",
							name: "资金流水"
						}]
					},
					/* {
						icon: "fa-asterisk",
						name: "信息管理",
						path: "info",
						children: [{
							path: "infoshow",
							name: "个人信息"
						}]
					}, */
					{
						icon: "fa-envelope",
						name: "新闻管理",
						path: "news",
						children: [{
							path: "newslist",
							name: "新闻列表"
						}, {
							path: "newsedit",
							name: "新闻添加"
						}]
					},
					{
						icon: "fa-users",
						name: "用户管理",
						path: "user",
						children: [{
							path: "userlist",
							name: "用户列表"
						}]
					},
					{
						icon: "fa-area-chart",
						name: "统计分析",
						path: "analysis",
						children: [{
							path: "analysis",
							name: "资金统计"
						}]
					}
				]
			}
		},
		computed: {
			menuShow() {
				return this.$store.getters.menuShow
			}
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.menu_page {
		
		min-height: 100%;
		background-color: #324057;
		z-index: 99;
	}

	.el-menu {
		border: none;
	}

	.fa-margin {
		margin-right: 5px;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 180px;
		min-height: 400px;
	}

	.el-submenu .el-menu-item {
		min-width: 180px;
	}

	.hiddenDropdown,
	.hiddenDropname {
		display: none;
	}

	a {
		text-decoration: none;
	}
</style>
