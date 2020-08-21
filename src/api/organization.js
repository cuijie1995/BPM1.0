import request from '@/utils/request'
export function getAlltOrganizet(data) {
    return request({
        url: '/api/services/app/Organize/GetAll',
        method: 'get',
        params:data
    })
}


export function CreateOrUpdateOrganize(data) {
    return request({
        url: '/api/services/app/Organize/CreateOrUpdate',
        method: 'post',
        data
    })
}



export function deleteOrganize(data) {
    return request({
        url: '/api/services/app/Organize/Delete',
        method: 'delete',
        params: data
    })
}


export function getDetailOrganize(data) {
    return request({
        url: '/api/services/app/Organize/Get',
        method: 'get',
        params: data
    })
}


export function getPostsByOrganizeId(data) {
    return request({
        url: '/api/services/app/Organize/GetPostsByOrganizeId',
        method: 'get',
        params: data
    })
}


// "/api/services/app/Organize/Delete?Id="