import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			redirect: '/index',
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('./views/Register.vue')
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('./views/Login.vue')
		},
		{
			path: '/index',
			name: 'index',
			component: () => import('./views/Index.vue'), 
			children: [{
				component: () => import('./views/Home.vue'),
				path:'',
				name:'home',
			},{
				path:'/home',
				name:'home',
				component: () => import('./views/Home.vue')
			},{
				path:'/infoshow',
				name:'infoshow',
				component: () => import('./views/InfoShow.vue')
			},{
				path:'/foundlist',
				name:'foundlist',
				component: () => import('./views/FoundList.vue')
			},{
				path:'/newslist',
				name:'newslist',
				component: () => import('./views/NewsList.vue')
			},{
				path:'/newsedit',
				name:'newsedit',
				component: () => import('./views/NewsEdit.vue')
			},{
				path:'/userlist',
				name:'userlist',
				component: () => import('./views/UserList.vue')
			},{
				path:'/analysis',
				name:'analysis',
				component: () => import('./views/Analysis.vue')
			}]
		},{
				path:'/test',
				name:'test',
				component: () => import('./views/jdd-barchart.vue')
			},
		
		{
			path: '*',
			name: 'noFount',
			component: () => import('./views/404.vue')
		}
	]
})
router.beforeEach((to, from, next) => {
	//判断是否登录
	const isLogin = localStorage.eleToken ? true : false;
	if (to.path == '/login' || to.path == '/register') {
		next()
	} else {
		isLogin ? next() : next('/login');
	}
})
export default router;
