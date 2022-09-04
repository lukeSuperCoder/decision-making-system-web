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
    redirect: "UserManagement",
    children: [
      {
        path: "/UserManagement",
        name: "UserManagement",
        meta: {},
        component: () => import("../views/SystemManagement/UserManagement.vue"),
      },
      {
        path: "/RoleManagement",
        name: "RoleManagement",
        meta: {},
        component: () => import("../views/SystemManagement/RoleManagement.vue"),
      },
      {
        path: "/MenuManage",
        name: "MenuManage",
        meta: {},
        component: () => import("../views/SystemManagement/MenuManage.vue"),
      },
      {
        path: "/padfviewer",
        name: "padfviewer",
        meta: {},
        component: () => import("../components/PdfViewer.vue"),
      },
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
