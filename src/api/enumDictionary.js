import request from '@/utils/request'
export function getRelativeExecutorEnum(data) {
    return request({
        url: '/api/services/app/EnumDictionary/GetDictionaryByName?name=RelativeExecutorEnum',
        method: 'get',
        data
    })
}

