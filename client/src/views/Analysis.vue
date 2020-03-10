<template>
	<div class="home">
		<div class="datasection container" ref="datasection">
			<h1></h1>
			<el-row type="flex" justify="center" :gutter="10" class="rowlist orderlist">
				<el-col :span="10">
					<pie-chart type="ordertype"></pie-chart>
				</el-col>
				<el-col :span="10" :offset="2">
					<line-chart></line-chart>
				</el-col>
				<!-- <el-col :span="7">
					<radar-chart></radar-chart>
				</el-col> -->
			</el-row>
			<el-row type="flex" justify="center" :gutter="10" class="rowlist orderlist">
				<el-col :span="22">
					<bar-chart type="barChart"></bar-chart>
				</el-col>
			</el-row>
			

		</div>
	</div>
</template>
<script>
	import barChart from '../components/echarts/barChart' //  柱状图
	import pieChart from '../components/echarts/pieChart' //  饼状图
	// import radarChart from '../components/echarts/radarChart' //  雷达图
	import lineChart from '../components/echarts/lineChart' //  折线图
	export default {

		components: {

			barChart,
			pieChart,
			// radarChart,
			lineChart
		},
		mounted() {},
		methods: {

		}
	}
</script>
<style scoped>
	.home {
		width: 100%;
		/* height: 100%; */
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

	.datasection {
		padding-left: 20px;
		padding-right: 20px;
		/* overflow: auto; */
		border-radius: 2px;
	}

	.rowlist {
		margin-bottom: 38px;
	}

	.rowbase {
		padding: 10px;
		box-sizing: border-box;
		background: #fff;
		border-radius: 6px;
		height: 120px;
	}

	.orderlist {
		text-align: center;
	}

	.orderArea {
		width: 100%;
		height: 300px;
		background: #fff !important;
		border-radius: 6px;
		box-sizing: border-box;
		padding: 10px;
		padding-top: 40px;
		overflow: hidden;
	}

	.orderbarArea {
		height: 370px;
	}

	.datalist {
		text-align: center;
		font-size: 14px;
		border-radius: 6px;
		padding: 10px;
		color: #fff;
		height: 80px;

	}

	.leftItem {
		align-items: start;
		justify-content: space-between;
		text-align: left;
	}

	.rightItem {
		width: 62px;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.svg-icon {
		font-size: 30px;
	}

	.number {
		font-size: 22px;
		font-weight: bold;

	}

	.perTitle {
		font-size: 13px;
		margin-left: 5px;
	}

	.pay {}

	.leftItem {
		justify-content: space-around;
	}
</style>
