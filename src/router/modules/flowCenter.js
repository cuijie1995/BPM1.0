// 配置 flowCenter
export default function (router) {
    router.push({
        path: '/pendingFlow',
        name: "PendingFlow",
        meta: { title: "待处理流程", icon: "iconfont icon-daichuliliucheng" },
        component: () => import('@/views/flowCenter/pendingFlow.vue')
    })
    router.push({
        path: '/myFlow',
        name: "MyFlow",
        meta: { title: "我的流程", icon: "iconfont icon-wodeliucheng" },
        component: () => import('@/views/flowCenter/MyFlow/myFlow.vue')
    })

    router.push({
        path: '/addMyFlow',
        name: "addMyFlow",
        hidden: true,
        meta: { title: "新的申请", icon: "iconfont icon-wodeliucheng" },
        component: () => import('@/views/flowCenter/MyFlow/addFlow.vue')
    })

    router.push({
        path: '/editMyFlow',
        name: "EditMyFlow",
        hidden: true,
        meta: { title: "编辑申请", icon: "iconfont icon-wodeliucheng" },
        component: () => import('@/views/flowCenter/MyFlow/editFlow.vue')
    })


    router.push({
        path: '/seeFlow',
        name: "SeeFlow",
        hidden: true,
        meta: { title: "查看申请", icon: "iconfont icon-wodeliucheng" },
        component: () => import('@/views/flowCenter/MyFlow/seeFlow.vue')
    })

    router.push({
        path: '/processedFlow',
        name: "ProcessedFlow",
        meta: { title: "已处理流程", icon: "iconfont icon-23yichuliliucheng" },
        component: () => import('@/views/flowCenter/processedFlow.vue')
    })


    router.push({
        path: '/delegatedTask',
        name: "DelegatedTask",
        meta: { title: "委托任务", icon: "iconfont icon-c-commission" },
        component: () => import('@/views/flowCenter/delegatedTask/delegatedTask.vue')
    })

    // router.push({
    //     path: '/404',
    //     name: "404",
    //     meta: { title: "404", icon: "iconfont icon-c-commission" },
    //     component: () => import('@/views/404.vue')
    // })






}