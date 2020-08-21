import request from '@/utils/request'
export function UploadIForm(data) {
    return request({
        url: '/api/services/app/Enclosure/UploadIFormas',
        method: 'post',
        data
    })
}

// 单个下载
export function GetEnclosure(data) {
    return request({
        url: '/api/services/app/Enclosure/GetEnclosure',
        method: 'get',
        params: data
    })
}

// 获取列表
export function GetEnclosuresByKey(data) {
    return request({
        url: '/api/services/app/Enclosure/GetEnclosuresByKey',
        method: 'get',
        params: data
    })
}

export function DeleteEnclosure(data) {
    return request({
        url: '/api/services/app/Enclosure/DeleteEnclosure',
        method: 'delete',
        params: data
    })
}



