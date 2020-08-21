import request from '@/utils/request'


export function getAllRole(data) {
    return request({
        url: '/api/services/app/Role/GetAll',
        method: 'get',
        params: data
    })
}


export function CreateRole(data) {
    return request({
        url: '/api/services/app/Role/Create',
        method: 'post',
        data
    })
}


export function UpdateRole(data) {
    return request({
        url: '/api/services/app/Role/Update',
        method: 'put',
        data
    })
}


export function getDetailRole(data) {
    return request({
        url: '/api/services/app/Role/Get',
        method: 'get',
        params: data
    })
}

export function deleteRole(data) {
    return request({
        url: '/api/services/app/Role/Delete',
        method: 'delete',
        params: data
    })
}



export function deleteBatchRole(data) {
    return request({
        url: '/api/services/app/Menu/DeleteBatch',
        method: 'delete',
        params: data
    })
}

