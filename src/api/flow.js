import request from '@/utils/request'
export function getFlowData(data) {
    return request({
        url: '/api/services/app/FlowDefinition/GetAll',
        method: 'get',
        params: data
    })
}


export function CreaOrUpdateFlowData(data) {
    return request({
        url: '/api/services/app/FlowDefinition/CreateOrUpdate',
        method: 'post',
        data
    })
}


export function deleteFlowData(data) {
    return request({
        url: '/api/services/app/FlowDefinition/Delete',
        method: 'delete',
        params: data
    })
}


export function getForEditFlow(data) {
    return request({
        url: '/api/services/app/FlowDefinition/GetForEdit',
        method: 'get',
        params: data
    })
}




// export function GetAttributeEnum(data) {
//     return request({
//         url: '​/api/services/app/FormDefinition/GetAttributeEnum',
//         method: 'get',
//         params: data
//     })
// }


export function GetAttributeEnum(data) {
    return request({
        url: '/api/services/app/FormDefinition/GetAttributeEnum',
        method: 'get',
        params: data
    })
}





// 流程类型
export function GetFlowTypes(data) {
    return request({
        url: '/api/services/app/FlowDefinition/GetFlowTypes',
        method: 'get',
        params: data
    })
}

export function GetAllTypes(data) {
    return request({
        url: '/api/services/app/FlowType/GetAllTypes',
        method: 'get',
        params: data
    })
}

export function GetFlowType(data) {
    return request({
        url: '/api/services/app/FlowDefinition/GetFlowType',
        method: 'get',
        params: data
    })
}



export function CreatOrUpdateFlowType(data) {
    return request({
        url: '/api/services/app/FlowDefinition/CreatOrUpdateFlowType',
        method: 'post',
        data
    })
}

export function DeleteFlowType(data) {
    return request({
        url: '/api/services/app/FlowDefinition/DeleteFlowType',
        method: 'delete',
        params: data
    })
}

