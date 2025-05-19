import * as auth from "../auth/auth";
import * as products from "../products/products";
import * as company from "../company/company";
import * as plan from "../plan/plan";
import * as user from "../user/user";
import * as dataOrder from "../dateOrder/DateOrder";
import * as order from "../order/order";
import * as typeServices from "../typeServices/typeServices";
import * as client from "../clients/clients";
import * as image from "../image/image";
import * as perfil from "../perfil/perfil";
import * as stripe from "../stripe/stripe";
import * as category from "../category/category";
import * as estado from "../estado/estado";
import * as cambioEstado from "../cambioEstado/cambioEstado";
import * as getchat from "../chat/chatData";
import * as payments from "../payments/payment";
import * as cierreProvisorio from "../cierre_provisoro/cierreProvisorio";
import * as numeroConfianza from "../numeroConfianza/numeroConfianza"


const api = {
  auth: {
    login: auth.Login,
    me: auth.GetMyAccountData,
    resetPassword: auth.resetPassword,
    sendLink: auth.sendLinkToGmail
  },
  products: {
    getAll: products.findAllProducts,
    find: products.find,
    update: products.update,
    isEmpresaAvailable: products.isEmpresaAvailable,
    delete: products.deletProd,
    create: products.create,
  },
  payments: {
    createInitial: payments.createInitial,
    verifyPaymentIsOk: payments.verifyPaymentIsOk,
    getPlans: payments.getPlans,
  },
  plans: {
    getAll: plan.getAllPlans,
    assignPlanToCompany: plan.AssignPlan,
  },
  company: {
    create: company.createCompany,
    update: company.updateCompany,
    loadQR: company.LoadQR,
    loadAuthCode: company.LoadAuthCode,
  },
  user: {
    create: user.createUser,
    update: user.updateUser,
    findAll: user.findAllUsers,
    find: user.findUser,
    updateFcm: user.updateFCM,
    delete: user.deleteUser,
  },
  //(INFO-LINES)
  dataOrder: {
    getAll: dataOrder.getAll,
    create: dataOrder.create,
    delete: dataOrder.deleteOrderDate,
  },
  order: {
    getStatitics: order.getStatitics,
    getCalendarOrders: order.getOrderForCalendar,
    getOrderDetails: order.getDetailsOfOrder,
    getAvailableDates: order.getAvailableDates,
    getActive: order.getAllActive,
    getFinished: order.getAllFinished,
    getPending: order.getAllPending,
    subOrderStatus: order.subOrderStatus,
    remove: order.removeOrder,
    confirm: order.confirmOrder,
    create: order.createOrder,
    moneyinday: order.getMoneyInDay,
    lastThreeOrders: order.lastThreeOrders,
    getOrdersByDate: order.getOrdersByDate,
    getNextDateAvailable: order.getNextDateAvailable,
  },
  typeServices: {
    getAll: typeServices.getAll,
  },
  client: {
    create: client.CreateOrReturnClient,
  },

  image: {
    upload: image.uploadImage,
  },
  perfil: {
    getResumenVentas: perfil.resumenVentas,
  },
  stripe: {
    createIntent: stripe.createIntent,
  },
  category: {
    create: category.createCategory,
    getAll: category.getAllCategories,
    getProducts: category.getProductFromCategory,
    delete: category.deleteCategory,
  },
  status: {
    create: estado.createStatus,
    find: estado.findStatus,
    findAll: estado.findAllStatus,
    update: estado.updateStatus,
    delete: estado.deleteStatus,
  },
  chat: {
    getChatMessages: getchat.getchat,
  },
  changeStatus: {
    cambioEstado: cambioEstado.creteStatusChange,
  },
  cierreProvisorio : {
    create: cierreProvisorio.createCierreProvisorio,
    getAll: cierreProvisorio.getAllCierreProvisorio,
    delete: cierreProvisorio.deleteCierreProvisorio
  },
  numeroConfianza: {
    create: numeroConfianza.create,
    findAll: numeroConfianza.getAllNumbers,
    delete: numeroConfianza.deleteNumber

  }
};

export default api;
