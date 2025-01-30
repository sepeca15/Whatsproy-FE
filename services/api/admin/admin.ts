import * as auth from "../auth/auth"
import * as products from "../products/products"
import * as company from "../company/company"
import * as plan from "../plan/plan"
import * as user from "../user/user"
import * as dataOrder from "../dateOrder/DateOrder"
import * as order from "../order/order"
import * as typeServices from "../typeServices/typeServices"
import * as client from "../clients/clients"

const api = {
    auth:{
        login:auth.Login,
        me: auth.GetMyAccountData,
    },
    products: {
        getAll: products.findAllProducts,
        find: products.find,
        update: products.update,
        delete: products.deletProd,
        create: products.create,
    },
    plans: {
        getAll: plan.getAllPlans,
        assignPlanToCompany: plan.AssignPlan
    },
    company: {
        create: company.createCompany,
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
        create: order.createOrder,
    },
    typeServices : {
        getAll : typeServices.getAll
    },
    client: {
        create: client.CreateOrReturnClient
    }
}

export default api