// 配置 flowCenter
export default function (router) {
    router.push({
        path: '/menu',
        name: "Menu",
        meta: { title: "菜单管理", icon: "iconfont icon-daichuliliucheng" },
        component: () => import('@/views/menu/index.vue')
    })

}