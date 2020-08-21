import request from '@/utils/request'


export function getMyFlow(data) {
    return request({
        url: '/api/services/app/FlowInstance/GetMyFlow',
        method: 'get',
        params: data
    })
}

export function getAllOfUserData(data) {
    return request({
        url: '/api/services/app/FlowInstance/GetAllOfUser',
        method: 'get',
        params: data
    })
}

export function CreateOrUpdate(data) {
    return request({
        url: "/api/services/app/FormData/CreateOrUpdate",
        method: 'post',
        data
    })
}

export function CloseInstance(data) {
    return request({
        url: "/api/services/app/FlowInstance/CloseInstance",
        method: 'post',
        params: data
    })
}

// 启动流程
export function StartFlowInstance(data) {
    return request({
        url: "/api/services/app/FlowInstance/StartFlowInstance",
        method: 'post',
        data
    })
}

// 完成任务
export function FinishTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/FinishTask",
        method: 'post',
        data
    })
}

// 退回
export function BackToPreviousTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/BackToPreviousTask",
        method: 'post',
        data
    })
}

// 加签
export function AddFlowTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/AddFlowTask",
        method: 'post',
        data
    })
}

// 转签
export function TransferFlowTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/TransferFlowTask",
        method: 'post',
        data
    })
}

// 传阅
export function CirculateFlowTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/CirculateFlowTask",
        method: 'post',
        data
    })
}

export function getFlowData(data) {
    return request({
        url: "/api/services/app/FlowInstance/GetFlowData",
        method: 'get',
        params: data
    })
}

// 跟踪流程图
export function GetFlowTrackInfo(data) {
    return request({
        url: "/api/services/app/FlowInstance/GetFlowTrackInfo",
        method: 'get',
        params: data
    })
}

// 委托任务列表
export function GetAllDelegateTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/GetAllDelegateTask",
        method: 'get',
        params: data
    })
}

// 新增委托
export function CreateDelegateTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/CreateDelegateTask",
        method: 'post',
        data
    })
}

// 关闭委托
export function CloseDelegateTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/CloseDelegateTask",
        method: 'post',
        params: data
    })
}

// 获得委托数据
export function GetDelegateTask(data) {
    return request({
        url: "/api/services/app/FlowInstance/GetDelegateTask",
        method: 'get',
        params: data
    })
}

// 查看意见
export function GetAllComments(data) {
    return request({
        url: "/api/services/app/FlowInstance/GetAllComments",
        method: 'get',
        params: data
    })
}

// 查看历史记录
export function GetAllHistoricalData(data) {
    return request({
        url: "/api/services/app/HistoricalData/GetAll",
        method: 'get',
        params: data
    })
}

// 导出数据
export function ExportExcel(data) {
    return request({
        url: "/api/services/app/HistoricalData/ExportExcel",
        method: 'post',
        data
    })
}




export function GetNextNode(data) {
    return request({
        url: "/api/services/app/FlowInstance/GetNextNode",
        method: 'get',
        params: data
    })
}


