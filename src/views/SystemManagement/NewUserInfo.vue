<template>
  <el-row class="planCls">
    <el-row class="heads">
      <el-page-header
        @back="cancelHandle"
        :content="$t('lang.userManage.userInfo')"
      >
      </el-page-header>
    </el-row>
    <el-row class="form_div" :style="{ height: scrollerHeight }">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="$t('lang.userManage.userName') + ':'"
          prop="userName"
        >
          <el-input
            v-model="form.userName"
            :disabled="title === $t('lang.common.look')"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('lang.userManage.loginName') + ':'"
          prop="mainUserId"
        >
          <el-input
            v-model="form.loginName"
            :disabled="title === $t('lang.common.look') || title === $t('lang.common.edit')"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="title !== $t('lang.common.look')"
          :label="$t('lang.userManage.userPass') + ':'"
          prop="password"
        >
          <el-input
            type="password"
            v-model="form.password"
            autocomplete="off"
            :disabled="title === $t('lang.common.look')"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="title === $t('lang.common.look')"
          :label="$t('lang.userManage.userPass') + ':'"
          prop="password"
        >
          <el-input
            v-model="form.password"
            autocomplete="off"
            :disabled="title === $t('lang.common.look')"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.userManage.phone') + ':'" prop="phone">
          <el-input
            v-model="form.phone"
            :disabled="title === $t('lang.common.look')"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.userManage.orgName') + ':'" prop="orgName">
          <el-input
            v-model="form.orgName"
            :disabled="title === $t('lang.common.look')"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('lang.userManage.deptName') + ':'"
          prop="deptName"
        >
          <el-input
            v-model="form.deptName"
            :disabled="title === $t('lang.common.look')"
            class="inputWt"
          ></el-input>
          <!-- <el-select
            v-model="form.deptName"
            placeholder="请选择部门"
            style="width: 100%"
            :disabled="title === '查看'"
            class="inputWt"
          >
            <el-option
              v-for="item in form.depts"
              :key="item.value"
              :label="item.orgName"
              :value="item.orgId"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item :label="$t('lang.userManage.role') + ':'" prop="role">
          <el-select
            v-model="form.role"
            placeholder="请选择角色"
            style="width: 100%"
            @change="roleChangeHandle"
            :disabled="title === $t('lang.common.look')"
            class="inputWt"
          >
            <el-option
              v-for="item in form.roles"
              :key="item.value"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row class="btnSave">
          <el-form-item>
            <el-button
              v-show="title === $t('lang.common.newAdd')"
              class="btnClsing"
              @click="saveDataHandle('form')"
              >{{ $t("lang.common.ok") }}</el-button
            >
            <el-button
              v-show="title === $t('lang.common.edit')"
              class="btnClsing"
              @click="upDataDataHandle('form')"
              >{{ $t("lang.common.change") }}</el-button
            >
            <el-button
              class="btnCancel"
              v-show="title !== $t('lang.common.look')"
              @click="cancelHandle"
              >{{ $t("lang.common.cancel") }}</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
import {
  getRoleInfo,
  getDepartmentInfo,
  addUserInfo,
  updateUserInfo,
} from "../../utils/request";
import * as validate from "../../utils/validate";
const validEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!validate.isEmail(value)) {
    callback(new Error("请输入正确的邮箱!"));
  } else {
    callback();
  }
};
export default {
  name: "NewUserInfo",
  props: {
    rowData: Object,
    title: String,
  },
  data() {
    return {
      form: {
        userName: "",
        loginName: "",
        password: "",
        phone: "",
        orgName: "",
        deptName: "",
        depts: [],
        dept: "",
        role: "",
        roles: [],
      },
      disabled: false,
      roleIdList: [],
      data: [],
      value: [],
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        loginName: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "change" }],
        deptName: [{ required: true, message: "请选择部门", trigger: "change" }],
        orgName: [{ required: true, message: "请选择单位", trigger: "change" }],
      },
    };
  },
  computed: {
    scrollerHeight: function () {
      return window.innerHeight - 190 + "px";
    },
  },
  mounted() {
    //
    this.fillValueHandle();
    // this.getDepartmentInfoData();
    this.getRoleInfoData(); //查询角色
  },
  methods: {
    fillValueHandle() {
      if (this.rowData !== null && this.title !== this.$t('lang.common.newAdd')) {
        if (this.title === this.$t('lang.common.look')) {
          this.disabled = true;
        }
        if (this.rowData.roleList.length > 0) {
          this.form.role = this.rowData.roleList[0].roleId;
        }
        this.form.userName = this.rowData.userName;
        this.form.loginName = this.rowData.loginName;
        this.form.password = this.Rsa.decrypt(this.rowData.password)
          ? this.Rsa.decrypt(this.rowData.password)
          : this.rowData.password;
        // this.form.password = this.rowData.password;
        this.form.phone = this.rowData.phone;
        this.form.deptName = this.rowData.deptName;
        this.form.orgName = this.rowData.orgName;
        // this.form.dept = parseInt(this.rowData.orgId);
      }
    },
    getDepartmentInfoData: function () {
      let that = this;
      getDepartmentInfo()
        .then((response) => {
          if (response["code"] === 0) {
            that.form.depts = response["data"];
          } else {
            that.$message.warning("获取用户信息失败！");
          }
        })
        .catch(() => {
          this.$message.warning("获取用户信息失败！");
        });
    },
    getRoleInfoData: function () {
      //查询所有角色
      let that = this;
      let params = {
        pageNo: 0,
        pageSize: -1,
      };
      getRoleInfo(params)
        .then((response) => {
          if (response["code"] === 0) {
            that.form.roles = response["data"]["records"];
          } else {
            that.$message.warning("获取用户信息失败！");
          }
        })
        .catch(() => {
          this.$message.warning("获取用户信息失败！");
        });
    },
    roleChangeHandle(val) {
      this.roleIdList = [];
      this.roleIdList.push(val);
    },
    saveDataHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let params = {
            userName: this.form.userName,
            loginName: this.form.loginName,
            password: this.form.password,
            phone: this.form.phone,
            deptName: this.form.deptName,
            orgName: this.form.orgName,
            roleIdList: this.roleIdList,
            createUserId: sessionStorage.getItem("id"),
            createTime: this.getNowFormatDate(),
          };
          addUserInfo(params)
            .then((response) => {
              if (response["code"] === 0) {
                this.ifShow = 1;
                this.$emit("update:changeShow", this.ifShow);
                this.$emit("getUserInfoData");
                that.$message.success("新增用户成功！");
              } else {
                that.$message.warning("新增用户失败！");
              }
            })
            .catch(() => {
              this.$message.warning("新增用户失败！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    upDataDataHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let params = {
            userId: this.rowData.userId,
            userName: this.form.userName,
            loginName: this.form.loginName,
            password: this.form.password,
            phone: this.form.phone,
            deptName: this.form.deptName,
            orgName: this.form.orgName,
            roleIdList: this.roleIdList,
            createUserId: sessionStorage.getItem("id"),
            createTime: this.getNowFormatDate(),
          };
          updateUserInfo(params)
            .then((response) => {
              if (response["code"] === 0) {
                this.ifShow = 1;
                this.$emit("update:changeShow", this.ifShow);
                this.$emit("getUserInfoData");
                that.$message.success("修改用户信息成功！");
              } else {
                that.$message.warning("修改用户信息失败！");
              }
            })
            .catch(() => {
              this.$message.warning("修改用户信息失败！");
            });
        }
      });
    },
    cancelHandle() {
      this.ifShow = 1;
      this.$emit("update:changeShow", this.ifShow);
    },
    getNowFormatDate() {
      var date = new Date(); //获取当前时间
      var month = date.getMonth() + 1; //月份处理
      var day = date.getDate();
      month = month < 10 ? "0" + month : month; //月份为1-9月,在其前面加0
      day = day < 10 ? "0" + day : day; //日期为1-9号,在其前面加了0
      var s1 = "-"; //定义年月日分隔符-
      var s2 = ":"; //定义时分秒分隔符:
      //拼接年月日,时分秒
      var currDate =
        date.getFullYear() +
        s1 +
        month +
        s1 +
        day +
        " " +
        date.getHours() +
        s2 +
        date.getMinutes() +
        s2 +
        date.getSeconds();
      return currDate;
    },
  },
};
</script>

<style scoped>
.heads {
  height: 50px;
  background: #ffffff;
  padding-left: 22px;
}
.planCls ::v-deep.el-page-header {
  font-size: 14px;
  font-weight: 400;
  color: #45b2e0;
  padding: 10px;
}
.planCls ::v-deep.el-page-header__content {
  font-size: 16px;
  font-weight: 400;
  color: #505255;
}
.form_div {
  margin: 18px 20px;
  background: #ffffff;
  display: flex;
  justify-content: center;
}
.demo-ruleForm {
  padding-top: 25px;
}
.btnClsing {
  width: 92px;
  background: #45b2e0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
}
.btnCancel {
  width: 92px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #505255;
}
.inputWt {
  width: 360px !important;
}
.btnSave {
  text-align: center;
  margin-top: 10px;
  padding-bottom: 48px;
}
</style>
