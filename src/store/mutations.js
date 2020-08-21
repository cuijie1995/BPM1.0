const mutations = {
    SET_USER(state,user){
        if(user){
            state.user = user
        }else{
            state.user = null
        }
   
    },


    SET_ROUTERS(state,routers){
        if(routers){
            state.routers = routers
        }else{
            state.routers = null
        }
    }

}

export default mutations