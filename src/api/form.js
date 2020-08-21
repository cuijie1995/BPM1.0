import request from '@/utils/request'
export function getFormData(data) {
    return request({
        url: '/api/services/app/FormDefinition/GetAll',
        method: 'get',
        params: data
    })
}

export function deleteFormData(data) {
    return request({
        url: '/api/services/app/FormDefinition/Delete',
        method: 'delete',
        params: data
    })
}

export function batchDeleteFormData(data) {
    return request({
        url: '/api/services/app/Menu/DeleteBatch',
        method: 'delete',
        data
    })
}

export function CreateOrUpdateFormData(data) {
    return request({
        url: '/api/services/app/FormDefinition/CreateOrUpdate',
        method: 'post',
        data
    })
}


export function getDetailFormData(data) {
    return request({
        url: '/api/services/app/FormDefinition/Get',
        method: 'get',
        params: data
    })
}