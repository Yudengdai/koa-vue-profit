import axios from 'axios'
import {Loading,Message} from 'element-ui'
import router from '../router'

let loading;
function startLoading(){
	loading = Loading.service({
		lock:true,
		text:'加载中......',
		background:"rgba(0,0,0,0.7)"
	})
}

function endLoading(){
	loading.close()
}
axios.defaults.baseURL="http://26s26v6375.wicp.vip:52907/"//配置跨域标识
// axios.defaults.baseURL="/api/"//配置跨域标识
//请求拦截
axios.interceptors.request.use(config=>{
	//加载动画
	startLoading()
	if(localStorage.eleToken){
		//设置统一的请求header
		config.headers.Authorization = localStorage.eleToken;
	}
	return config
},error=>{
	return Promise.reject(error)
})

//响应拦截
axios.interceptors.response.use(response=>{
	endLoading()
	const headers = response.headers
      if(headers['content-type'] === 'application/vnd.ms-excel;charset=utf-8'){
        return response.data
      }

	if(response.data.code==0){
		return response.data;
	}else{
		Message.error(response.data.msg)
	}
},error=>{
	endLoading()
	Message.error('请求出错'+error)
	//获取错误状态码
	const {status}=error.response;
	if(status==401){
		Message.error('登录状态已过期，请重新登录')
		//清除过期token
		localStorage.removeItem('eleToken')
		router.push('/login')
	}
	return Promise.reject(error)
})
export default axios