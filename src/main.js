import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./utils/rem.js";
import SlideVerify from "vue-monoplasty-slide-verify";
import VueI18n from "vue-i18n";
import Rsa from "../src/utils/rsa.js";
import { checkPermission } from "./utils/common";
import echarts from "echarts";
import JsonExcel from "vue-json-excel";
Vue.prototype.$echarts = echarts;
Vue.prototype.Rsa = Rsa; // 将Rsa注册为公共方法,方便其他页面调用
Vue.use(VueI18n);
Vue.component("downloadExcel", JsonExcel);

const i18n = new VueI18n({
  locale: "zh-CN", // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
  messages: {
    "zh-CN": require("./utils/lang/zh_cn.js"), // 中文简体语言包
    "zh-TW": require("./utils/lang/zh_tw.js"), // 中文繁体语言包
    "en-US": require("./utils/lang/en_us.js"), // 英文语言包
  },
});
Vue.config.productionTip = false;
Vue.directive("permission", {
  inserted (el, binding) {
    let permission = binding.value; // 获取到 v-permission的值
    if (permission) {
      let hasPermission = checkPermission(permission);
      if (!hasPermission) { // 没有权限 移除Dom元素
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  }
});
Vue.use(SlideVerify);
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
