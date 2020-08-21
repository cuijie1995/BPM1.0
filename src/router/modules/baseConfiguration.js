// 配置 baseConfiguration
export default function (router) {

    // router.push({
    //     path: '/business',
    //     name: "designBusiness",
    //     meta: { title: "业务设计", icon: "iconfont icon-yewusheji-liebiao" },
    //     component: () => import('@/views/baseConfiguration/designBusiness/index.vue')
    // })
    // router.push({
    //     path: '/addBusiness',
    //     name: "AddBusiness",
    //     hidden: true,
    //     meta: { title: "添加/编辑业务设计", icon: "iconfont icon-dongtaibiaodanpeizhi" },
    //     component: () => import('@/views/baseConfiguration/designBusiness/components/businessDetail.vue')
    // })
    router.push({
        path: '/menu',
        name: "Menu",
        meta: { title: "菜单管理", icon: "iconfont icon-daichuliliucheng" },
        component: () => import('@/views/menu/index.vue')
    })
    router.push({
        path: '/flowType',
        name: "FlowType",
        meta: { title: "流程类型", icon: "iconfont icon-liuchengleixing" },
        component: () => import('@/views/baseConfiguration/flowType/index.vue')
    })

    router.push({
        path: '/addFlowType',
        name: "AddFlowType",
        hidden: true,
        meta: { title: "添加/编辑流程", icon: "iconfont icon-ziyuan" },
        component: () => import('@/views/baseConfiguration/flowType/CreateOrUpdateType.vue')
    })


    router.push({
        path: '/form',
        name: "formIndex",
        meta: { title: "动态表单", icon: "iconfont icon-dongtaibiaodanpeizhi" },
        component: () => import('@/views/baseConfiguration/forms/index.vue')
    })
    router.push({
        path: '/dynamicform',
        name: "dynamicForm",
        hidden: true,
        meta: { title: "添加/编辑表单", icon: "iconfont icon-dongtaibiaodanpeizhi" },
        component: () => import('@/views/baseConfiguration/forms/components/formDetail.vue')
    })

    router.push({
        path: '/flow',
        name: "flowIndex",
        meta: { title: "流程设计", icon: "iconfont icon-ziyuan" },
        component: () => import('@/views/baseConfiguration/flowschemes/index.vue')
    })

    router.push({
        path: '/addFlow',
        name: "addFlow",
        hidden: true,
        meta: { title: "添加流程", icon: "iconfont icon-ziyuan" },
        component: () => import('@/views/baseConfiguration/flowschemes/add.vue')
    })

    router.push({
        path: '/editFlow',
        name: "editFlow",
        hidden: true,
        meta: { title: "编辑流程", icon: "iconfont icon-ziyuan" },
        component: () => import('@/views/baseConfiguration/flowschemes/edit.vue')
    })


    router.push({
        path: '/organizational',
        name: "organizational",
        meta: { title: "组织架构", icon: "iconfont icon-zuzhi" },
        component: () => import('@/views/baseConfiguration/base/index.vue')
    })
    router.push({
        path: '/personnel',
        name: "personnel",
        meta: { title: "用户管理", icon: "iconfont icon-yonghu" },
        component: () => import('@/views/baseConfiguration/base/personnel/index.vue')
    })
    router.push({
        path: '/persongroup',
        name: "personnelGroup",
        meta: { title: "人员组管理", icon: "iconfont icon-renyuanzuguanli" },
        component: () => import('@/views/baseConfiguration/base/personnelGroup/index.vue')
    })

}