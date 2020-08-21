
import request from '@/utils/request'
export function getAllUser(data) {
    return request({
        url: '/api/services/app/User/GetAll',
        method: 'get',
        params: data
    })
}


export function CreateUser(data) {
    return request({
        url: '/api/services/app/User/Create',
        method: 'post',
        data
    })
}


export function UpdateUser(data) {
    return request({
        url: '/api/services/app/User/Update',
        method: 'put',
        data
    })
}

export function getDetailUser(data) {
    return request({
        url: '/api/services/app/User/Get',
        method: 'get',
        params: data
    })
}

export function deleteUser(data) {
    return request({
        url: '/api/services/app/User/Delete',
        method: 'delete',
        params: data
    })
}







