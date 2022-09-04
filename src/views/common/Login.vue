<template>
  <div class="main">
    <div class="site-wrapper site-page--login">
      <div class="site-content__wrapper">
        <div class="site-content">
          <div class="login-main">
            <div class="divPanel">
            </div>
            <div class="divPanel1">
              <!--<h3 class="login-title">登录</h3>-->
              <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="dataForm"
                @keyup.enter.native="dataFormSubmit2()"
                status-icon
              >
                <el-form-item prop="loginName">
                  <el-input
                    prefix-icon="el-icon-user"
                    v-model="dataForm.loginName"
                    placeholder="用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    prefix-icon="el-icon-lock"
                    v-model="dataForm.password"
                    type="password"
                     show-password
                    placeholder="密码"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    class="login-btn-submit"
                    type="primary"
                    @click="dataFormSubmit2"
                    >登录</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
            <slide-verify
              v-if="showVerify"
              ref="slideblock"
              class="verifyCls"
              title="点击刷新"
              @click="handleClick"
              @again="onAgain"
              @fulfilled="onFulfilled"
              @success="onSuccess"
              @fail="onFail"
              @refresh="onRefresh"
              :slider-text="text"
              :accuracy="accuracy"
            ></slide-verify>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sessionSet } from "../../utils/auth";
import { systemLogin } from "../../utils/request";
export default {
  name: "Login",
  data() {
    return {
      dataForm: {
        loginName: "",
        password: "",
      },
      dataRule: {
        loginName: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      videoSrc: require("../../assets/video/bg.mp4"),
      text: "向右滑动->",
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 1,
      showVerify: false,
    };
  },
  methods: {
    dataFormSubmit: async function () {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          // const { code, data,msg,error } = await systemLogin(this.dataForm);
          // if (code === 0) {
          //   //模拟设置token
          //   sessionSet("token", data['token']);
          //   sessionSet("userName", data['userName']);
          //   sessionSet("deptName", data['deptName']);
          //   sessionSet("roleList", JSON.stringify(data['roleList']));
          //   sessionSet("roleId", data['roleList'][0]['roleId']);
          //   sessionSet("userId", data['userId']);
          //   //处理登录相关逻辑
          //   this.$router.replace({ name: "Home" });
          // } else {
          //   this.$message.warning(msg?msg:error);
          // }
          this.$router.replace({ name: "Home" });
        }
      });
    },
    dataFormSubmit2: function () {
      // this.showVerify = !this.showVerify;
      this.dataFormSubmit();
    },
    forgotPassword: function () {
      this.$alert("请联系管理员", "提醒", {
        confirmButtonText: "确定",
        callback: (action) => {},
      });
    },
    onSuccess(times) {
      console.log("验证通过，耗时 " + times + "毫秒");
      this.showVerify = false;
      this.dataFormSubmit();
    },
    onFail() {
      console.log("验证不通过");
    },
    onRefresh() {
      console.log("点击了刷新小图标");
    },
    onFulfilled() {
      console.log("刷新成功啦！");
    },
    onAgain() {
      console.log("检测到非人为操作的哦！");
      // 刷新
      this.$refs.slideblock.reset();
    },
    handleClick() {
      this.$refs.slideblock.reset();
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  width: 100%;
  background: url('../../assets/image/img/loginbg.jpg') no-repeat;
  background-size: 100% 100%;
  .site-wrapper.site-page--login {
  // position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url("../../assets/image/login/login_bg.png") no-repeat;
  background-size: cover;
  overflow: hidden;
  font-family: Source Han Sans CN, serif;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
  }

  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }

  .site-content {
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-main ::v-deep {
    position: fixed;
    width: 1200px;
    height: 500px;
    margin-top: 400px;
    margin-left: 430px;
    background: url("../../assets/image/img/loginbar.png") round;
    background-size: cover;
    .el-form-item__content {
      line-height: 60px;
    }
    .el-icon-user:before,
    .el-icon-lock:before {
      font-size: 26px;
      padding-top: 5px;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 40px;
    }
    .el-input__prefix {
      padding-top: 5px;
    }
    .el-input input::-webkit-input-placeholder {
      font-size: 24px;
      font-family: Source Han Sans CN Normal, serif;
      font-weight: 400;
      color: #999;
    }
    .el-input__inner {
      height: 40px;
    }
    .el-input input::-ms-input-placeholder {
      font-size: 24px;
      font-family: Source Han Sans CN Normal, serif;
      font-weight: 400;
      color: #999;
    }
    display: flex;
    .divPanel {
      flex: 1;
      align-items: center;
      justify-content: center;
      display: flex;
      border-right: 1px dashed rgba(255, 255, 255, 0.15);
      .wcl {
        font-size: 40px;
        font-family: Source Han Sans CN Normal, serif;
        font-weight: 400;
        color: #333333;
        line-height: 48px;
      }
      .wcl1 {
        margin-top: 25px;
      }
    }
    .divPanel1 {
      flex: 1;
      align-items: center;
      justify-content: center;
      display: flex;
      // margin-left: 120px;
      .el-input {
        width: 300px;
      }
      .el-input__inner {
        border: 0 solid;
        border-bottom: 1px solid #ccc;
        background: rgba(255, 255, 255, 0.1);
        color: #333333;
      }
      .wcl {
        font-size: 32px;
        font-family: Source Han Sans CN, serif;
        font-weight: 400;
        color: #333333;
        line-height: 48px;
      }
      ::v-deep .el-form-item {
        margin-bottom: 10px;
      }
    }
    .verifyCls {
      z-index: 99;
      position: absolute;
      top: 20%;
      left: 55%;
    }
  }

  .login-title {
    font-size: 20px;
    width: 100%;
    text-align: center;
    letter-spacing: 30px;
    /*color: #3aabd4;*/
    margin: 40px 0;
  }

  .login-btn-submit {
    /*width: 150%;*/
    /*margin-top: 38px;*/
    background-color: rgba(51, 102, 102, 1);
    border: 1px solid rgba(51, 102, 102, 1);
    // height: 40px;
    width: 300px;
    font-family: Source Han Sans CN Normal, serif;
    font-size: 22px;
  }

  .sys-title {
    color: #ffffff;
    z-index: 1;
    position: fixed;
    top: 15%;
    text-align: center;
    font-family: Source Han Sans CN Medium, serif;
    /*left:3%;*/
  }

  .sys-title span {
    font-size: 48px;
    letter-spacing: 2px;
    color: azure;
    font-family: Source Han Sans CN Medium, serif;
    font-weight: 500;
    line-height: 28px;
  }
}
}

</style>
