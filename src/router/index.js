import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/Layout/Index.vue';
import jwt_decode from 'jwt-decode';
import flowCenter from "./modules/flowCenter";
import baseConfiguration from "./modules/baseConfiguration";


Vue.use(Router)

let routes = []

let rootRouter = {
  path: '/',
  name: 'dashboard',
  component: Layout,
  hidden: true,
  redirect: '/home',
  children: [
    {
      path: '/home',
      name: 'home',
      meta: { title: '首页', icon: 'iconfont icon-shouye' },
      component: () => import('../views/Home.vue')
    },

  ]
}

let baseRouter = {
  path: '/basicConfiguration',
  name: 'BasicConfiguration',
  hidden: true,
  meta: { title: "基础配置", icon: "iconfont icon-jichupeizhi" },
  component: Layout,
  redirect: "/form",
  children: []
}


let loginRouter = {
  path: '/login',
  name: 'login',
  hidden: false,
  meta: { title: '系统登录' },
  component: () => import('@/views/Login/Login.vue')
}

let flowCenterRouter = {
  path: '/flowCenter',
  name: 'FlowCenter',
  hidden: true,
  meta: { title: "流程中心", icon: "iconfont icon-liuchengzhongxin" },
  component: Layout,
  redirect: "/pendingFlow",
  children: []
}

flowCenter(flowCenterRouter.children)
baseConfiguration(baseRouter.children)




const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes.concat([rootRouter, baseRouter, loginRouter, flowCenterRouter])
})


export const asyncRouterMap = routes.concat([rootRouter, baseRouter, loginRouter, flowCenterRouter])

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.Token ? true : false;
  if (to.path == '/login') {
    next()
  } else {
    isLogin ? next() : next("/login");
    // if (isLogin) {
    //   const decoded = jwt_decode(localStorage.Token);
    //   const { key } = decoded;
    //   // 判断是否有权限进入
    //   if (hasPermission(key, to)) {
    //     next()
    //   } else {
    //     next('/404'); // 没有权限进入
    //   }

    // } else {
    //   next("/login")
    // }
  }
})

/**
 * 判断是否有权限
 * @param roles 当前角色
 * @param route 当前路由对象
 * 
 */

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    //  如果meta.roles是否包含角色的key值，如果包含那么就是权限，否则无权限
    return route.meta.roles.some((role) => {
      role.indexOf(roles) >= 0
    })
  } else {
    //  默认不设置有权限
    return true
  }
}

export default router
