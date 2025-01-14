import * as auth from "../auth/auth"
import * as products from "../products/products"
import * as company from "../company/company"
import * as plan from "../plan/plan"
import * as user from "../user/user"
import * as dataOrder from "../dateOrder/DateOrder"
import * as order from "../order/order"

const api = {
    auth:{
        login:auth.Login,
        me: auth.GetMyAccountData,
    },
    products: {
        getAll: products.findAllProducts
    },
    plans: {
        getAll: plan.getAllPlans,
        assignPlanToCompany: plan.AssignPlan
    },
    company: {
        update: company.updateCompany,
        loadQR: company.LoadQR,
        loadAuthCode: company.LoadAuthCode
    },
    user: {
        create: user.createUser,
        update: user.updateUser,
        findAll: user.findAllUsers,
        find: user.findUser,
        delete : user.deleteUser
    },
    //(INFO-LINES)
    dataOrder: {
        getAll: dataOrder.getAll,
        create: dataOrder.create,
        delete: dataOrder.deleteOrderDate
    },
    order: {
        getCalendarOrders: order.getOrderForCalendar,
        getOrderDetails: order.getDetailsOfOrder,
        getFinished: order.getAllFinished ,
        getPending: order.getAllPending ,
        remove: order.removeOrder,
        confirm: order.confirmOrder,
    },
}

export default api