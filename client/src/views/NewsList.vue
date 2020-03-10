<template>
	<div class="fillcontain">
		<div>
			<el-form :inline="true">
				<el-form-item>
					<el-button type="danger" size="small" icon="search" @click="onDeleteChoose()">删除所选</el-button>
					<el-button type="primary" size="small" icon="view" @click="onAddMoney()">添加</el-button>
				</el-form-item>
				<el-form-item class="btnRight">
					<el-button type="primary" size="small" icon="search" @click="onScreeoutMoney()">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table_container">
			<el-table v-if="tableData.length>0" :data="tableData" max-height="450" border :default-sort="{prop:'date',order:'descending'}"
			 style="width: 100%;" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
				<el-table-column type="date" label="创建时间" align="center" width="250">
					<template slot-scope="scope">
						<el-icon name="time"></el-icon>
						<span style="margin-left: 10px;">{{scope.row.createdAt}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="title" label="标题" align="center" width="150"></el-table-column>
				<el-table-column prop="author" label="作者" align="center" width="180"></el-table-column>
				<el-table-column prop="views" label="阅读数" align="center" width="170">
					<template slot-scope="scope">
						<span style="color: #00d053;">{{scope.row.views}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="likes" label="点赞数" align="center" width="170">
					<template slot-scope="scope">
						<span style="color: #f56767;">{{scope.row.likes}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="img" label="新闻封面" align="center" width="400">
					<template slot-scope="scope">
						<el-image style="width: 100%; height: 100%" :src="scope.row.img" :alt="scope.row.title"></el-image>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="remark" label="备注" align="center" width="220"></el-table-column> -->
				<el-table-column prop="operation" label="操作" align="center" width="180">
					<template slot-scope="scope">
						<el-button type="warning" icon="edit" size="small" @click="onEditMoney(scope.row)">编辑</el-button>
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
		<!-- 弹框页面 -->
		<DialogFound :dialog='dialog' :form='form' @update="getData"></DialogFound>
	</div>
</template>
<script>
	import DialogFound from '../components/DialogFound'
	export default {
		name: 'foundlist',
		data() {
			return {
				tableData: [],
				multipleSelection: [],
				dialog: {
					show: false,
					title: '',
					option: 'edit'
				},
				form: {
					type: '',
					describe: '',
					income: '',
					expend: '',
					cash: '',
					remark: '',
					id: ''
				},
				//给分页组件传递的信息
				paginations: {
					page_index: 1, //当前位于哪一页
					total: 0, //总数
					page_size: 5, //1页显示几条
					page_sizes: [5, 10, 15, 20], //可选择的每页显示几条数据
					layout: 'total,sizes,prev,pager,next,jumper', //分页属性
				},
				//日期选择器快捷键设置
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				search_data: '',
			}
		},
		components: {
			DialogFound
		},
		created: function() {
			this.getData()
		},
		methods: {
			getData() {
				// const that = this;
				this.$axios.get(`/news/all?page=${this.paginations.page_index}&prepage=${this.paginations.page_size}`).then(res => {
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
					this.$axios.post(`news/delete/choose`, {
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
			onEditMoney(row) {
				// 编辑
				this.dialog = {
					show: true,
					title: "修改资金信息",
					option: "edit"
				};
				this.form = {
					type: row.type,
					describe: row.describe,
					income: row.income,
					expend: row.expend,
					cash: row.cash,
					remark: row.remark,
					id: row._id
				};
			},
			onDeleteMoney(row, index) {
				// 删除
				this.$axios.post(`profiles/delete`, {
					id: row.id
				}).then(res => {
					this.$message("删除成功");
					this.tableData = this.tableData.filter(item => {
						return item.id != row.id
					})
					// this.getData();
				});
			},
			onAddMoney() {
				// 添加
				this.dialog = {
					show: true,
					title: "添加资金信息",
					option: "add"
				};
				this.form = {
					type: "",
					describe: "",
					income: "",
					expend: "",
					cash: "",
					remark: "",
					id: ""
				};
			},

			onScreeoutMoney() {
				// 筛选
				this.$axios.post(`profiles/search`, {
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
