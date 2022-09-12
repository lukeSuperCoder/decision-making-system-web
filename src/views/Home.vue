<template>
  <scale-box>
    <el-container>
      <el-header>
        <div class="logo">{{ $t("lang.home.sysName") }}</div>
        <i :class="isCollapse? 'el-icon-s-fold':'el-icon-s-unfold'" style="margin-left: 50px;cursor:pointer;" @click="switchCollapse"></i>
        <div style="flex: 1">
        </div>
        <!-- <switch-lang></switch-lang> -->
        <div>
          <span class="timer">{{ currentTime }}</span>
          <div class="sxwCls">{{ $t(weekDay) + "&emsp;" + $t(sxw) }}</div>
        </div>
        <!-- <div>
          <div class="rightHeader">
            <img class="imgCls" src="../assets/image/home/user.png" />
            <a class="username">{{ name }}</a>
          </div>
          <div class="uCls">{{ userName }}</div>
        </div> -->
        <!-- <img
          src="../assets/image/home/logout1.png"
          :alt="$t('lang.home.logOut')"
          :title="$t('lang.home.logOut')"
          @click="logout"
        /> -->
      </el-header>
      <el-container>
        <el-aside class="aside-iscollapse" id="el-aside" v-show="isCollapse">
          <el-menu :default-active="activeIndex" router :collapse="false">
            <nav-menu :navMenus="menuData"></nav-menu>
          </el-menu>
        </el-aside>
        <el-aside class="aside-notcollapse" v-show="!isCollapse">
          <el-menu :default-active="activeIndex" router :collapse="true">
            <nav-menu :navMenus="menuData"></nav-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </scale-box>
</template>

<script>
// @ is an alias to /src
import ScaleBox from "../components/ScaleBox.vue";
import NavMenu from "../components/NavMenu.vue";
import { sessionClear,sessionGet, sessionSet } from "../utils/auth";
import dateUtil from "../utils/dateUtil";
import {roleHasMenu} from "../utils/request";
import {buildTree} from "../utils/common";
import SwitchLang from "../components/SwitchLang.vue";
export default {
  name: "Home",
  components: { NavMenu, ScaleBox, SwitchLang },
  data() {
    return {
      menuData: [],
      activeIndex: "OriginDataStatic",
      currentTime: new Date(), // 获取当前时间
      sxw: "lang.common.morning",
      weekDay: "",
      timer: "", //定义一个定时器的变量
      userName: sessionGet('deptName'),
      name: sessionGet('userName'),
      isCollapse: true
    };
  },
  created() {
    let that = this;
    that.timer = setInterval(() => {
      let ho = that.appendZero(new Date().getHours());
      //修改数据date
      that.currentTime = dateUtil.formatDateYmdhms(new Date());
      that.sxw =
        parseInt(ho) > 12 ? "lang.common.morning" : "lang.common.afternoon";
    }, 1000);
    let wk = new Date().getDay();
    let weeks = [
      "lang.common.Sunday",
      "lang.common.Monday",
      "lang.common.Tuesday",
      "lang.common.Wednesday",
      "lang.common.Thursday",
      "lang.common.Friday",
      "lang.common.Saturday",
    ];
    that.weekDay = weeks[wk];
  },
  mounted() {
    this.initMenu();
  },
  methods: {
    switchCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    initMenu() {
      // roleHasMenu({roleId:sessionGet('roleId')}).then((response) => {
      //   if (response['code'] === 0) {
      //     let permissions = [];
      //     response['data'].forEach(item => {
      //       if (item["menuUrl"]&&item["menuUrl"].indexOf('::') > -1) {
      //         permissions.push(item["menuUrl"]);
      //       } else {
      //         this.menuData.push({
      //         "entity": {
      //           "alias": item['notes']?item["notes"]:item["menuName"],
      //           "name": item["menuUrl"]?item["menuUrl"]:'',
      //           "icon": item['menuCode'],
      //           "id": item['menuId'],
      //           "parentId": item['parentMenuId'],
      //           "value": item["menuUrl"]?item["menuUrl"]:''
      //         }
      //       });
      //       }
      //     });
      //     sessionSet('permission',JSON.stringify({'permissions':permissions}));
      //     this.menuData.sort((a,b) => {
      //       return parseInt(b.id) - parseInt(a.id);
      //     });
      //     this.menuData = buildTree(this.menuData, 'id', 'parentId');
      //     console.log(this.menuData)
      //   }
      // });
      this.menuData = require("../assets/data/menus.json");
    },
    appendZero(obj) {
      if (obj < 10) {
        return "0" + obj;
      } else {
        return obj;
      }
    },
    logout() {
      sessionClear();
      this.$router.replace({ name: "Login" });
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
<style lang="scss" scoped>
.el-header ::v-deep {
  // background: url("../assets/image/home/top_bg.png");
  // background-size: cover;
  background-color: rgba(255, 255, 255, 0.8);
  color: #3B3D4A;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  img {
    cursor: pointer;
  }
}

.aside-iscollapse ::v-deep {
  width: 200px !important;
  color: #fff;
  text-align: left !important;
  background-color: #3B3D4A;
  z-index: 1;
  .el-menu-item.is-active {
    background: rgba(255, 255, 255, 0.8) !important;
    color: #3B3D4A;
    text-align: center !important;
  }
  .el-menu-item.is-active:hover {
    background: rgba(255, 255, 255, 1) !important;
    color: #3B3D4A;
    text-align: center !important;
  }
  .el-submenu.is-active .el-submenu__title {
    background: rgba(3, 19, 33, 0.3)
  }
  .el-submenu__title:hover {
    background-color: rgba(3, 19, 33, 0.3) !important;
  }
  .el-menu-item:hover {
    background-color: rgba(3, 19, 33, 0.3) !important;
  }
  .el-menu-item {
    font-size: 14px;
    text-align: center;
    font-weight: 500;
    color: whitesmoke;
  }
  .el-menu {
    background: rgba(255, 255, 255, 0) !important;
  }
  .el-submenu__title i {
    color: white !important;
  }
  .el-submenu__title {
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: #fff;
  }
  .el-icon-arrow-down:before {
    content: "\e791";
  }
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
  }
  .el-menu-item-group__title {
    color: #fff !important;
  }
}

.aside-notcollapse ::v-deep {
  width: 3rem !important;
  overflow-x: hidden;
  color: #fff;
  text-align: left !important;
  background-color: #3B3D4A;
  z-index: 1;
  .el-menu-item.is-active {
    background: rgba(255, 255, 255, 0.8) !important;
    color: #3B3D4A;
    text-align: center !important;
  }
  .el-menu-item.is-active:hover {
    background: rgba(255, 255, 255, 1) !important;
    color: #3B3D4A;
    text-align: center !important;
  }
  .el-submenu.is-active .el-submenu__title {
    background: rgba(3, 19, 33, 0.3)
  }
  .el-submenu__title:hover {
    background-color: rgba(3, 19, 33, 0.3) !important;
  }
  .el-menu-item:hover {
    background-color: rgba(3, 19, 33, 0.3) !important;
  }
  .el-menu-item {
    font-size: 14px;
    text-align: center;
    font-weight: 500;
    color: whitesmoke;
  }
  .el-menu {
    background: rgba(255, 255, 255, 0) !important;
  }
  .el-submenu__title i {
    color: white !important;
  }
  .el-submenu__title {
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    color: #fff;
  }
  .el-icon-arrow-down:before {
    content: "\e791";
  }
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
  }
  .el-menu-item-group__title {
    color: #fff !important;
  }
}

.el-main {
  background: #fff;
  border-top: 20px solid rgba(151, 151, 151, 0.3);
  border-right: 15px solid rgba(151, 151, 151, 0.3);
  border-bottom: 20px solid rgba(151, 151, 151, 0.3);
  border-left: 15px solid rgba(151, 151, 151, 0.3);
  color: #333;
}

.rightHeader {
  .imgCls {
    width: 14px;
    height: 15px;
    margin-right: 10px;
  }
}
</style>
