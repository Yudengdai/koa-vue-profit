<template>
	<div class="index">
		<headnav class="nav"></headnav>
		<div class="content">
			<leftmenu class="menu"></leftmenu>
			<div class="rightContainer">
				<router-view class="manage"></router-view>
				<footer class="copy">
					<a href="tel:15160598969" style="text-decoration: none; color: #696969;">
						Copyright (c) 2015-2019 余秋南</a>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
	import headnav from "../components/HeadNav"
	import leftmenu from "../components/LeftMenu"

	export default {
		name: 'index',
		components: {
			headnav,
			leftmenu
		},
		created() {
			this.$axios.get('/user/current').then(res => {
				// 存储数据
				this.$store.dispatch("setIsAutnenticated", !this.isEmpty(res.data.dat));
				this.$store.dispatch("setUser", res.data.data);
			})
		},
		methods: {
			isEmpty(value) {
				return (
					value === undefined ||
					value === null ||
					(typeof value === "object" && Object.keys(value).length === 0) ||
					(typeof value === "string" && value.trim().length === 0)
				);
			}
		},
	};
</script>

<style scoped>
	.index {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;

	}

	.nav {
		width: 100%;
		flex: 0 0 60px;
	}

	.content {
		flex: 1 1 auto;
		display: flex;

	}

	.menu {}
	.manage{
		flex: 0 0 auto;
		overflow-y: scroll;
		height: calc(100% - 60px);
		width: 100%;
	}

	.rightContainer {

		width: 100%;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}

	footer {
		background-color: #F5F7FA;
		flex: 0 0 60px;
		bottom: 0;
		height: 60px;
		border-top: 1px solid #e4eaec;
		padding: 20px;
		z-index: 0;
		box-sizing: border-box;
		font-size: 14px;
		line-height: 1.52857143;
		color: #656565;
	}
</style>
