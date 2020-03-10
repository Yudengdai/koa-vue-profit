<template>
	<div class="fillcontain">
		<div>
			<el-form :inline="true">
				<el-form-item>
					<el-button type="danger" size="small" icon="search" @click="onDeleteChoose()">删除所选</el-button>
				</el-form-item>
				<el-form-item class="btnRight">
					<el-form-item label="用户名" prop="username"><el-input v-model="search_data" placeholder="请输入要搜索的用户名"></el-input></el-form-item>
					<el-button type="primary" size="small" icon="search" @click="onScreeoutMoney()">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table_container">
			<el-table v-if="tableData.length>0" :data="tableData" max-height="450" border :default-sort="{prop:'date',order:'descending'}"
			 style="width: 100%;" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
				<el-table-column prop="avatar" label="头像" align="center" width="150">
					<template slot-scope="scope">
						<el-avatar :shape="circle"  :src="scope.row.avatar" :alt="scope.row.username" :fit="contain"></el-avatar>
					</template>
				</el-table-column>
				<el-table-column prop="username" label="用户名" align="center" width="150"></el-table-column>
				<el-table-column prop="email" label="注册邮箱" align="center" width="180"></el-table-column>
				<el-table-column prop="ip" label="注册IP" align="center" width="170">
					<template slot-scope="scope">
						<span style="color: #00d053;">{{scope.row.ip}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="注册地址" align="center" width="170">
					<template slot-scope="scope">
						<span style="color: #f56767;">{{scope.row.address}}</span>
					</template>
				</el-table-column>
				
				<el-table-column prop="identity" label="权限" align="center" width="220"></el-table-column>
				<el-table-column prop="operation" label="操作" align="center" width="180">
					<template slot-scope="scope">
						<el-button type="danger" icon="delete" size="small" @click="onDeleteMoney(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-row>
				<el-col :span="24">
					<div class="pagination">
						<el-pagination v-if='paginations.total>paginations.page_size' :page-size="paginations.page_size" :page-sizes="paginations.page_sizes"
						 :total="paginations.total" :layout="paginations.layout" :current-page.sync='paginations.page_index'
						 @current-change='handleCurrentChange' @size-change='handleSizeChange'>
						</el-pagination>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'userlist',
		data() {
			return {
				tableData: [],
				multipleSelection: [],
				dialog: {
					show: false,
					title: '',
					option: 'edit'
				},
				//给分页组件传递的信息
				paginations: {
					page_index: 1, //当前位于哪一页
					total: 0, //总数
					page_size: 5, //1页显示几条
					page_sizes: [5, 10, 15, 20], //可选择的每页显示几条数据
					layout: 'total,sizes,prev,pager,next,jumper', //分页属性
				},
				search_data: '',
			}
		},
		created: function() {
			this.getData()
		},
		methods: {
			getData() {
				// const that = this;
				this.$axios.get(`/user/all?page=${this.paginations.page_index}&prepage=${this.paginations.page_size}`).then(res => {
					this.tableData = res.data.data;
					this.paginations.total = res.data.count;
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleCurrentChange(page) {
				// 当前页
				this.paginations.page_index = page;
				this.getData()
			},
			handleSizeChange(page_size) {
				this.paginations.page_index = 1;
				this.paginations.page_size = page_size;
				this.getData()
			},
			onDeleteChoose() {
				//删除所选
				if (this.multipleSelection.length == 0) {
					return this.$message({
						message: '请选择要删除的数据',
						type: 'warning'
					})
				}
				this.$confirm('是否要删除当前数据', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.post(`user/delete/choose`, {
						multipleSelection: this.multipleSelection
					}).then(res => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.multipleSelection = [];
						this.getData();
					});

				})
			},
			
			onDeleteMoney(row, index) {
				// 删除
				this.$axios.post(`user/delete`, {
					id: row.id
				}).then(res => {
					this.$message("删除成功");
					this.tableData = this.tableData.filter(item => {
						return item.id != row.id
					})
					// this.getData();
				});
			},
			

			onScreeoutMoney() {
				// 筛选
				this.$axios.post(`user/search`, {
					search: this.search_data
				}).then(res => {
					this.tableData = res.data
					// this.getData();
				});
			}
		},
	}
</script>
<style scoped>
	.fillcontain {
		width: 100%;
		height: 100%;
		padding: 16px;
		box-sizing: border-box;
	}

	.btnRight {
		float: right;
	}

	.pagination {
		text-align: right;
		margin-top: 10px;
	}
</style>
