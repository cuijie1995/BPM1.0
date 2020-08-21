import request from '@/utils/request'
export function login(data) {
    return request({
        url: '/api/TokenAuth/Authenticate',
        method: 'post',
        data
    })
}