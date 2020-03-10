<template>
	<div class="infoshow">
		<el-row type="flex" class="row-bg" justify="center">
			<el-form :model="news" :rules="rules" class="newsForm" ref="newsForm" label-width="100px">
				<el-form-item label="新闻标题" prop="title">
					<el-input v-model="news.title" placeholder="请输入新闻标题"></el-input>
				</el-form-item>
				<el-form-item label="新闻缩略图" prop="img">
					<el-upload class="upload-demo" :on-change="onImgChange" ref="upload" drag :show-file-list="false" :on-success="handleSuccess"
					 :action="news.action" :auto-upload="false">
						<el-image style="width: 100%; height: 100%" v-if="news.img" :src="news.img"></el-image>
						<template v-else style="padding: 30px 20px;">
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
						</template>
					</el-upload>
				</el-form-item>
				<el-form-item label="新闻作者" prop="author">
					<el-input v-model="news.author" placeholder="请输入新闻作者"></el-input>
				</el-form-item>
				<el-form-item label="阅读数" prop="views">
					<el-input v-model="news.views" placeholder="请输入阅读数(选填)"></el-input>
				</el-form-item>
				<el-form-item label="点赞数" prop="likes">
					<el-input v-model="news.likes" placeholder="请输入点赞数(选填)"></el-input>
				</el-form-item>
				<el-form-item>
						<quill-editor v-model="news.content" ref="myQuillEditor" :options="editorOption">
						</quill-editor>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="submit_btn" @click="submitForm('newsForm')">确定</el-button>
				</el-form-item>
			</el-form>
			<!-- <el-upload class="editor-uploader" :action="news.action" :on-success="uploadEditSuccess" :on-error="uploadEditError"
			 :before-upload="beforeEditUpload">
			</el-upload> -->
		</el-row>
	</div>
</template>
<script>
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	import {
		quillEditor,
		Quill
	} from 'vue-quill-editor'
	import {
		container,
		ImageExtend
	} from 'quill-image-extend-module'
	import {
		ImageDrop
	} from 'quill-image-drop-module'
	import ImageResize from 'quill-image-resize-module'
	Quill.register('modules/imageDrop', ImageDrop)
	Quill.register('modules/imageResize', ImageResize)
	Quill.register('modules/ImageExtend', ImageExtend)
	import {
		editorOption
	} from '../util/vue-quill-editor-config.js'
	export default {
		name: "neswedit",
		data() {
			return {
				option: 'add',
				editorOption: editorOption,
				news: {
					title: '',
					author: '',
					content: '',
					img: '',
					views: '',
					likes: '',
					action: 'http://26s26v6375.wicp.vip:52907/upload'
				},
				quillUpdateImg: false,
				rules: {
					title: [{
						required: true,
						message: '新闻标题不能为空',
						trigger: 'blur'
					}],
					img: [{
						required: true,
						message: '新闻缩略图不能为空',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '新闻内容不能为空',
						trigger: 'blur'
					}],
				}
			}
		},
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill
			},

		},
		components: {
			quillEditor
		},
		methods: {
			handleSuccess(res, file) {
				if (!res.data) {
					this.$message({
						message: "图片上传失败！",
						type: "success"
					});
					return false;
				} else {
					this.news.img = res.data
					this.uploadData()
				}
			},
			onImgChange(file, fileList) {
				this.news.img = URL.createObjectURL(file.raw);
			},
			uploadImg() {
				this.$refs.upload.submit();
			},
			submitForm(formName) {
				this.$refs[formName].validate(async valid => {
					if (valid) {
						this.uploadImg();
					}
				});
			},
			uploadData() {
				//替换缩略图地址，上传全部新闻数据
				const url = this.option == "add" ? "add" : "edit";
				this.$axios.post(`news/add`, this.news).then(res => {
					this.$message({
						message: "保存成功！",
						type: "success"
					});

					// 页面跳转
					this.$router.push("/newslist");

				})
			},
			/* beforeEditUpload() {
				// 显示loading动画
				this.quillUpdateImg = true
			},

			uploadEditSuccess(res, file) {

				// 获取富文本组件实例
				let quill = this.$refs.myQuillEditor.quill
				// 如果上传成功
				if (res.data) {
					// 获取光标所在位置
					let length = quill.getSelection().index;
					// 插入图片  res.info为服务器返回的图片地址
					quill.insertEmbed(length, 'image', res.data)
					// 调整光标到最后
					quill.setSelection(length + 1)
				} else {
					this.$message.error('图片插入失败')
				}
				// loading动画消失
				this.quillUpdateImg = false
			},

			uploadEditError() {
				// loading动画消失
				this.quillUpdateImg = false
				this.$message.error('图片插入失败')
			} */
		},
	};
</script>
<style>
	.quill-editor:not(.bubble) .ql-container,
	.quill-editor:not(.bubble) .ql-container .ql-editor {
		height: 30rem;
		padding-bottom: 1rem;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.row-bg {
		width: 100%;
		height: 100%;
		padding: 30px 16px;
		box-sizing: border-box;
	}
</style>
