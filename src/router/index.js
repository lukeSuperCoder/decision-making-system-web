import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/common/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/OriginDataStatic",
    children: [
      {
        path: '/OriginDataStatic',
        name: 'OriginDataStatic',
        meta: {},
        component: () => import("../views/MultidimensionalAnalysis/OriginDataStatic.vue"),
      },
      {
        path: '/BaseChartAnalysis',
        name: 'BaseChartAnalysis',
        meta: {},
        component: () => import("../views/MultidimensionalAnalysis/BaseChartAnalysis.vue"),
      },
      {
        path: '/DataPretreatment',
        name: 'DataPretreatment',
        meta: {},
        component: () => import("../views/MultidimensionalAnalysis/DataPretreatment.vue"),
      },
      {
        path: "/NullData",
        name: "NullData",
        meta: {},
        component: () => import("../views/DataPretreatment/NullData.vue"),
      },
      {
        path: "/AbnormalData",
        name: "AbnormalData",
        meta: {},
        component: () => import("../views/DataPretreatment/AbnormalData.vue"),
      },
      {
        path: "/MenuManage",
        name: "MenuManage",
        meta: {},
        component: () => import("../views/MenuManage/MenuManage.vue"),
      },
      {
        path: "/CrossAnalysis",
        name: "CrossAnalysis",
        meta: {},
        component: () => import("../views/CharacteristicEngineering/CrossAnalysis.vue"),
      },
      {
        path: "/FeaturesSelect",
        name: "FeaturesSelect",
        meta: {},
        component: () => import("../views/CharacteristicEngineering/FeaturesSelect.vue"),
      },
      {
        path: "/ModelPracitce",
        name: "ModelPracitce",
        meta: {},
        component: () => import("../views/ModelApplication/ModelPracitce.vue"),
      },
      {
        path: "/ModelApp",
        name: "ModelApp",
        meta: {},
        component: () => import("../views/ModelApplication/ModelApp.vue"),
      },
      {
        path: "/AlgorithmDisplay",
        name: "AlgorithmDisplay",
        meta: {},
        component: () => import("../views/AlgorithmDisplay/AlgorithmDisplay.vue"),
      },
      {
        path: "/SystemSettings",
        name: "SystemSettings",
        meta: {},
        component: () => import("../views/SystemSettings/SystemSettings.vue"),
      },
      {
        path: "/UserManagement",
        name: "UserManagement",
        meta: {},
        component: () => import("../views/SystemManagement/UserManagement.vue"),
      }
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
// router.beforeEach((to, from, next) => {
//   let token = sessionStorage.getItem("token");
//   if (to.name !== "Login" && !token) next({ name: "Login" });
//   else next();
// });
