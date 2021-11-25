import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

const originalPush = VueRouter.prototype.push

// 处理路由跳转会报错的问题
VueRouter.prototype.push = function push (...rest) {
  return originalPush.apply(this, rest).catch(err => err)
}

Vue.use(VueRouter)
// 自动扫描 modules 里面的路由模块，路由模块请根据业务自行拆分
const files = require.context('./modules', false, /\.js$/)

const routes = []
// 获取所有的路由内容
files.keys().forEach(key => {
  const file = files(key).default
  // 根据导出的内容判断是否数组，如果数组需使用扩展运算符
  if (Array.isArray(file)) {
    routes.push(...file)
  } else {
    routes.push(file)
  }
})

routes.push(
  ...[
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
)

const router = new VueRouter({
  routes,
  // 页面滚动行为
  scrollBehavior (/* to, from, savedPosition */) {
    return {
      x: 0,
      y: 0
    }
  }
})

// 设置标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '我是移动端项目'
  next()
})

export default router
