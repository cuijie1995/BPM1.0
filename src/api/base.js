import request from '@/utils/request'
export function getFormTypeData() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=FormTypeEnum',
        method: 'get'
    })
}

export function getFlowNodeTypeEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=FlowNodeTypeEnum',
        method: 'get'
    })
}

export function getInFlowTypeEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=InFlowTypeEnum',
        method: 'get'
    })
}

export function getOutFlowTypeEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=OutFlowTypeEnum',
        method: 'get'
    })
}

export function getTaskAssignmentTypeEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=TaskAssignmentTypeEnum',
        method: 'get'
    })
}

export function getTimeOutHandlingEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=TimeOutHandlingEnum',
        method: 'get'
    })
}

export function getFlowRoleConnectorEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=FlowRoleConnectorEnum',
        method: 'get'
    })
}
export function getFlowRoleOperatorEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=FlowRoleOperatorEnum',
        method: 'get'
    })
}


export function getFlowCustomTypeEmun() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=FlowCustomTypeEmun',
        method: 'get'
    })
}


export function getFlowFinishTypeEnum() {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=FlowFinishTypeEnum',
        method: 'get'
    })
}


export function getAccessApi() {
    return request({
        url: '/api/services/app/BindApi/GetAccessApi',
        method: 'get'
    })
}

