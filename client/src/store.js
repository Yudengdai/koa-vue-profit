import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const types = {
	SET_ISAUTNENTIATED: 'SET_ISAUTNENTIATED', //是否通过认证
	SET_USER: 'SET_USER', //用户信息
	SET_MENUSHOW: 'SET_MENUSHOW', //菜单的显隐
}
export default new Vuex.Store({
	state: { //需要维护的状态
		isAutnentiated: false, //是否认证
		user: {} ,//用户信息
		menuShow:false//菜单的显隐
	},
	getters: {
		isAutnentiated: state => state.isAutnentiated,
		user: state => state.user,
		menuShow: state => state.menuShow,
	},
	mutations: {
		[types.SET_ISAUTNENTIATED](state, isAutnentiated) {
			if (isAutnentiated) {
				state.isAutnentiated = isAutnentiated
			} else {
				state.isAutnentiated = false
			}
		},
		[types.SET_USER](state, user) {
			if (user) {
				state.user = user
			} else {
				state.user = false
			}
		},
		[types.SET_MENUSHOW](state, menuShow) {
			state.menuShow = menuShow
		}
	},
	actions: {
		setIsAutnenticated: ({commit},isAutnentiated) => {
			commit(types.SET_ISAUTNENTIATED,isAutnentiated)
		},
		setUser: ({commit},user) => {
			commit(types.SET_USER,user)
		},
		clearCurrentState: ({commit}) => {
			commit(types.SET_ISAUTNENTIATED,false)
			commit(types.SET_USER,null)
		},
	}
})
