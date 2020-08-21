import request from '@/utils/request'
export function getAllPost(data) {
    return request({
        url: '/api/services/app/Post/GetAll',
        method: 'get',
        params: data
    })
}


export function CreateOrUpdate(data) {
    return request({
        url: '/api/services/app/Post/CreateOrUpdate',
        method: 'post',
        data
    })
}


export function DeletePost(data) {
    return request({
        url: '/api/services/app/Post/Delete',
        method: 'delete',
        params: data
    })
}



export function getByIdPost(data) {
    return request({
        url: '/api/services/app/Post/Get',
        method: 'get',
        params: data
    })
}


export function GetUserByPostID(data) {
    return request({
        url: '/api/services/app/Post/GetUserByPostID',
        method: 'get',
        params: data
    })
}

