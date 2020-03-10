<template>
	<div class="fillcontain">
		<div>
			<el-form :inline="true">
				<el-form-item>
					<el-date-picker v-model="search_data" type="datetimerange" :picker-options="pickerOptions" range-separator="至"
					 start-placeholder="选择开始时间" end-placeholder="选择结束时间" align="right">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" icon="search" @click="onScreeoutMoney()">筛选</el-button>
					<el-button type="primary" size="small" icon="search" @click="onDeleteChoose()">删除所选</el-button>
				</el-form-item>
				<el-form-item class="btnRight">
					<el-button type="primary" size="small" icon="view" @click="onAddExcel()">表格添加</el-button>
					<el-button type="primary" size="small" icon="view" @click="onOutExcel()">表格导出</el-button>
					<el-button type="primary" size="small" icon="view" @click="onAddMoney()">添加</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table_container">
			<el-table v-if="tableData.length>0" :data="tableData"  border :default-sort="{prop:'date',order:'descending'}"
			 style="width: 100%;" stripe @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
				<el-table-column type="date" label="创建时间" align="center" width="250">
					<template slot-scope="scope">
						<el-icon name="time"></el-icon>
						<span style="margin-left: 10px;">{{scope.row.createdAt}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="type" label="收支类型" align="center" width="150"></el-table-column>
				<el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
				<el-table-column prop="income" label="收入" align="center" width="170">
					<template slot-scope="scope">
						<span style="color: #00d053;">+{{scope.row.income}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="expend" label="支出" align="center" width="170">
					<template slot-scope="scope">
						<span style="color: #f56767;">-{{scope.row.expend}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="cash" label="账户现金" align="center" width="170">
					<template slot-scope="scope">
						<span style="color:#4db3ff">{{ scope.row.cash }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center" width="220"></el-table-column>
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
		<DialogFound :dialog='dialog' :form='form' @update="getProfile"></DialogFound>
		<!-- excel上传弹窗 -->
		<el-drawer title="表格导入" :visible.sync="drawer" :before-close="handleClose">
			<div class="excelDrawer">
				<p class="excelModelTitle">点击图标下载模板</p>
				<a href="http://127.0.0.1/excel/money.xlsx" class="excelModel">
					<!-- <el-image class="excelModelImg" src="../assets/Excel.png">
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						  </div>
					</el-image> -->
					<img src="../assets/Excel.png" class="excelModelImg">
					<p class="excelModelName">
						资金流水表格模板
					</p>
				</a>
				<div class="excel-info">
					<h3>温馨提示：</h3>
					<ul>
						<li>1.上传的文件只能是excel格式的文件</li>
						<li>2.请确保文件内容的格式与模板一样，上传之前请用格式刷刷一下</li>
						<li>3.文件最大不可超过10M，文件越大等待时间越久，上传之后请不要操作系统，等待数据导入结果</li>
					</ul>
				</div>
				<div class="excel">
					<el-upload class="upload-demo" ref="upload" drag :show-file-list="false" :on-success="handleSuccess" :action="action">
						<template style="padding: 30px 20px;">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						</template>
					</el-upload>
				</div>
			</div>
		</el-drawer>
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
					page_size: 10, //1页显示几条
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
				drawer: false,
				action: 'api/excel',
			}
		},
		components: {
			DialogFound
		},
		created: function() {
			this.getProfile()
		},
		methods: {
			getProfile() {
				// const that = this;
				this.$axios.get(`/profiles/all?page=${this.paginations.page_index}&prepage=${this.paginations.page_size}`).then(res => {
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
				this.getProfile()
			},
			handleSizeChange(page_size) {
				this.paginations.page_index = 1;
				this.paginations.page_size = page_size;
				this.getProfile()
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
					this.$axios.post(`profiles/delete/choose`, {
						multipleSelection: this.multipleSelection
					}).then(res => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.multipleSelection = [];
						this.getProfile();
					});

				})
			},
			onEditMoney(row) {
				// 编辑
				this.dialog = {
					show: true,
					title: "修改资金信息",
					option: "edit",
				};
				this.form = {
					type: row.type,
					describe: row.describe,
					income: row.income,
					expend: row.expend,
					cash: row.cash,
					remark: row.remark,
					id: row.id
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
					// this.getProfile();
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
					// this.getProfile();
				});
			},
			//打开表格导入窗口
			onAddExcel() {
				this.drawer = true;
			},
			//关闭表格导入窗口
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			handleSuccess(res, file) {
				if (!res.data) {
					this.$message({
						message: "文件上传失败，请重试！",
						type: "success"
					});
					return false;
				} else {
					this.getProfile();
					this.$message({
						message: "文件上传成功！",
						type: "success"
					});
				}
			},
			onOutExcel() {
				
				this.$axios({
					method: 'GET',
					url: 'excel/out',
					responseType: 'blob',//声明返回的是blob格式

				}).then(res => {
					// let data = new Blob([res.data], {
					// 	type: 'application/vnd.ms-excel;charset=utf-8'
					// });
					console.log(res)
					// 创建一个a标签
					var oA = document.createElement('a')
					oA.href = window.URL.createObjectURL(new Blob([res], {
						type: 'application/vnd.ms-excel;charset=utf-8'
					}))
					// oA.href = window.URL.createObjectURL(new Blob([res.data.data], { type: 'application/vnd.openxmlformats;charset=utf-8' }))
					// 给文件命名
					oA.download = '资金流水表.xlsx'
					// 模拟点击
					oA.click()
				})

			}

		},
	}
</script>
<style scoped>
	.fillcontain {
		width: 100%;
		/* height: 100%; */
		padding: 30px 16px;
		box-sizing: border-box;
	}

	.btnRight {
		float: right;
	}

	.pagination {
		text-align: right;
		margin-top: 10px;
	}

	.excelDrawer {
		padding: 0 30px;
		font-color: #696969;

	}

	.excelModelTitle {
		color: #696969;
		font-size: 20px;
		padding-bottom: 20px;
	}

	.excelModel {
		width: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10px auto;
		border: dashed #bebebe 1px;
		border-radius: 8px;
		height: 80px;
		text-decoration: none;
	}

	.excelModelImg {
		width: 50px;
		height: 50px;
		margin-right: 20px;
	}

	.excelModelName {
		color: #696969;

	}

	.excel-info {
		width: 100%;
		padding-top: 20px;
		color: #696969;
		line-height: 30px;
		padding-bottom: 20px;
	}

	.upload-demo {
		text-align: center;
	}
</style>
