import {
	QuillWatch
} from 'quill-image-extend-module'
const container = [
	['bold', 'italic', 'underline', 'strike'],
	['blockquote', 'code-block'],
	[{
		'header': 1
	}, {
		'header': 2
	}],
	[{
		'list': 'ordered'
	}, {
		'list': 'bullet'
	}],
	[{
		'script': 'sub'
	}, {
		'script': 'super'
	}],
	[{
		'indent': '-1'
	}, {
		'indent': '+1'
	}],
	[{
		'direction': 'rtl'
	}],
	[{
		'size': ['small', false, 'large', 'huge']
	}],
	[{
		'header': [1, 2, 3, 4, 5, 6, false]
	}],
	[{
		'color': []
	}, {
		'background': []
	}],
	[{
		'font': []
	}],
	[{
		'align': []
	}],
	['clean'],
	['link', 'image', 'video']
]
export const editorOption = {
	modules: {
		toolbar: {
			container: container,
			handlers: {
				'image': function(value) {
					if (value) {
						QuillWatch.emit(this.quill.id)
					} else {
						this.quill.format('image', false);
					}
				}
			}
		},
		// syntax: {
		// 	highlight: text => hljs.highlightAuto(text).value
		// },
		history: {
			delay: 1000,
			maxStack: 50,
			userOnly: false
		},
		ImageExtend: { // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入 
			name: 'file', // 图片参数名
			size: 3, // 可选参数 图片大小，单位为M，1M = 1024kb
			action: 'http://26s26v6375.wicp.vip:52907/upload', // 服务器地址, 如果action为空，则采用base64插入图片
			// response 为一个函数用来获取服务器返回的具体图片地址
			// 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
			// 则 return res.data.url
			response: (res) => {
				return res.data
			},
			headers: (xhr) => {
				// xhr.setRequestHeader('myHeader','myValue')
			}, // 可选参数 设置请求头部
			sizeError: () => {}, // 图片超过大小的回调
			start: () => {}, // 可选参数 自定义开始上传触发事件
			end: () => {}, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
			error: () => {}, // 可选参数 上传失败触发的事件
			success: () => {}, // 可选参数  上传成功触发的事件
			change: (xhr, formData) => {
				// xhr.setRequestHeader('myHeader','myValue')
				// formData.append('token', 'myToken')
			} // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
		},
		imageDrop: false,
		imageResize: {
			displayStyles: {
				backgroundColor: 'black',
				border: 'none',
				color: 'white'
			},
			modules: ['Resize', 'DisplaySize', 'Toolbar']
		}

	}
}
