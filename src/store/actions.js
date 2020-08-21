import jwt_decode from 'jwt-decode';
// import { asyncRouterMap } from '../router';
import { GetUserMenus, GetSubmenus } from "../api/menu";
import { GetEnclosure } from "../api/uplaod";

// let routerList

const actions = {
    async setUser({ state, commit }, user) {


        const decoded = jwt_decode(user);
        commit('SET_USER', decoded)

        // 返回当前用户拥有权限的路由
        let routerList = []
        GetUserMenus({ Id: localStorage.getItem("userId") }).then(response => {
            // console.log(response)
            routerList = response.result

            routerList.forEach((element, index) => {
                if (element.hierarchicalCode == "dashboard") {
                    routerList.splice(index, 1)
                }
                GetSubmenus({ id: element.id }).then(res => {
                    if (res.result.length > 0) {
                        element.children = res.result

                        element.children.forEach(item => {
                            GetEnclosure({ id: item.menuIcon }).then(res => {
                                item.icon = "data:image/png;base64," + res.result;
                            });
                        });
                    }
                })

                GetEnclosure({ id: element.menuIcon }).then(res => {
                    element.icon = "data:image/png;base64," + res.result;
                });



            });





            commit('SET_ROUTERS', routerList);
        })

    }
}



export default actions