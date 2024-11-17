import * as auth from "../auth/auth"

const api = {
    auth:{
        login:auth.Login,
        me: auth.GetMyAccountData
    }
}

export default api