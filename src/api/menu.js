import request from '@/utils/request'


// 自定义菜单
export function getAllMenu(data) {
    return request({
        url: '/api/services/app/Menu/GetAll',
        method: 'get',
        params: data
    })
}

export function CreateOrUpdateMenu(data) {
    return request({
        url: '/api/services/app/Menu/CreateOrUpdate',
        method: 'post',
        data
    })
}

export function DeleteMenu(data) {
    return request({
        url: '/api/services/app/Menu/Delete',
        method: 'delete',
        params: data
    })
}

export function DeleteBatchMenu(data) {
    return request({
        url: '/api/services/app/Menu/DeleteBatch',
        method: 'delete',
        params: data
    })
}

export function getByIdMenu(data) {
    return request({
        url: '/api/services/app/Menu/Get',
        method: 'get',
        params: data
    })
}

// 查找下级菜单
export function GetSubmenus(data) {
    return request({
        url: '/api/services/app/Menu/GetSubmenus',
        method: 'get',
        params: data
    })
}





// 设置权限

export function CreateMenuOrganizeJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/CreateMenuOrganizeJurisdiction',
        method: 'post',
        data
    })
}

export function CreateMenuPostJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/CreateMenuPostJurisdiction',
        method: 'post',
        data
    })
}

export function CreateMenuRoleJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/CreateMenuRoleJurisdiction',
        method: 'post',
        data
    })
}

export function CreateMenuUserJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/CreateMenuUserJurisdiction',
        method: 'post',
        data
    })
}


export function DeleteMenuOrganizeJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/DeleteMenuOrganizeJurisdiction',
        method: 'delete',
        params: data
    })
}

export function DeleteMenuPostJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/DeleteMenuPostJurisdiction',
        method: 'delete',
        params: data
    })
}

export function DeleteMenuRoleJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/DeleteMenuRoleJurisdiction',
        method: 'delete',
        params: data
    })
}

export function DeleteMenuUserJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/DeleteMenuUserJurisdiction',
        method: 'delete',
        params: data
    })
}




export function GetMenuOrganizeJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/GetMenuOrganizeJurisdiction',
        method: 'get',
        params: data
    })
}

export function GetMenuPostJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/GetMenuPostJurisdiction',
        method: 'get',
        params: data
    })
}

export function GetMenuRoleJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/GetMenuRoleJurisdiction',
        method: 'get',
        params: data
    })
}

export function GetMenuUserJurisdiction(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/GetMenuUserJurisdiction',
        method: 'get',
        params: data
    })
}

export function GetUserMenus(data) {
    return request({
        url: '/api/services/app/MenuJurisdiction/GetUserMenus',
        method: 'get',
        params: data
    })
}



