<!-- 组件说明 -->
<template>
  <div class="planCls">
    <el-row class="heads">
      <el-page-header
        @back="cancelHandle"
        :content="$t('lang.menuManage.menuInfo')"
      >
      </el-page-header>
    </el-row>
    <el-row class="form_div" :style="{ height: scrollerHeight }">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('lang.menuManage.sysName')+':'" prop="sysName">
          <el-input
            v-model="form.sysName"
            class="inputWt"
            :disabled="title === $t('lang.common.look')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.menuManage.menuName')+':'" prop="menuName">
          <el-input
            v-model="form.menuName"
            class="inputWt"
            :disabled="title === $t('lang.common.look')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.menuManage.menuCode')+':'">
          <el-input
            v-model="form.menuCode"
            class="inputWt"
            :disabled="title === $t('lang.common.look')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.menuManage.type')+':'">
          <el-select
            v-model="form.type"
            class="inputWt"
            value=""
            :disabled="title === $t('lang.common.look')"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lang.menuManage.parentMenuId')+':'">
          <el-select
            v-model="form.parentMenuId"
            class="inputWt"
            value=""
            :disabled="title === $t('lang.common.look')"
          >
            <el-option
              v-for="item in menuList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lang.menuManage.menuUrl')+':'">
          <el-input
            v-model="form.menuUrl"
            :disabled="title === $t('lang.common.look')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.menuManage.orderNum')+':'">
          <el-input
            v-model="form.orderNum"
            :disabled="title === $t('lang.common.look')"
          ></el-input>
        </el-form-item>
         <el-form-item :label="$t('lang.menuManage.notes')+':'" prop="notes">
          <el-input
            v-model="form.notes"
            class="inputWt"
            :disabled="title === $t('lang.common.look')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.roleManage.creatName')+':'">
          <el-input v-model="form.createUserName" disabled></el-input>
          <!-- {{ form.createUserName }} -->
        </el-form-item>
        <el-row class="btnSave">
          <el-form-item>
            <el-button
              class="btnClsing"
              size="small"
              v-show="title === $t('lang.common.newAdd')"
              @click="saveDataHandle('form')"
              >{{$t('lang.common.ok')}}</el-button
            >
            <el-button
              class="btnClsing"
              size="small"
              v-show="title === $t('lang.common.edit')"
              @click="upDataDataHandle('form')"
              >{{$t('lang.common.change')}}</el-button
            >
            <el-button
              class="btnCancel"
              size="small"
              v-show="title !== $t('lang.common.look')"
              @click="cancelHandle"
              >{{$t('lang.common.cancel')}}</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import dateUtil from "../../utils/dateUtil";
//import x from ''
import { getMenuTree, addMenu, updateMenu } from "../../utils/request";
import { extractTree } from "../../utils/common";
export default {
  name: "NewMenuInfo",
  props: {
    rowData: Object,
    title: String,
    type: String,
  },
  components: {},
  data() {
    return {
      form: {
        sysName: "",
        menuName: "",
        menuCode: "",
        type: "",
        createUserName: "",
        menuUrl: "",
        orderNum: "",
        notes: "",
        parentMenuId: "",
      },
      typeList: [
        {
          label: "目录",
          value: 1,
        },
        {
          label: "菜单",
          value: 2,
        },
        {
          label: "按钮",
          value: 3,
        },
      ],
      menuList: [],
      rules: {
        sysName: [
          { required: true, message: "请输入系统名称", trigger: "blur" },
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
        menuUrl: [
          { required: true, message: "请输入菜单路径", trigger: "blur" },
        ],
      },
      operateType: "",
    };
  },
  computed: {
    scrollerHeight: function () {
      return window.innerHeight - 120 + "px";
    },
  },
  methods: {
    cancelHandle() {
      this.ifShow = 1;
      this.$emit("update:changeShow", this.ifShow);
    },
    fillValueHandle() {
      if (this.rowData !== null && this.title !== this.$t('lang.common.newAdd')) {
        if (this.title === this.$t('lang.common.look')) {
          this.disabled = true;
        }
        this.form.sysName = this.rowData.sysName;
        this.form.menuName = this.rowData.menuName;
        this.form.notes = this.rowData.notes;
        this.form.menuCode = this.rowData.menuCode;
        this.form.type = this.rowData.type;
        this.form.menuUrl = this.rowData.menuUrl;
        this.form.orderNum = this.rowData.orderNum;
        this.form.createUserName = this.rowData.createUserName;
        this.form.parentMenuId = this.rowData.parentMenuId;
      }
    },
    getMenuList: async function () {
      const { code, data } = await getMenuTree();
        if (code === 0 && data) {
        let resData = extractTree(data,'childrenList')
        resData.forEach((item) => {
          this.menuList.push({
            label: item.menuName,
            value: item.menuId,
          });
        });
      }
    },
    saveDataHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.form;
          params["createBy"] = sessionStorage.getItem("userId");
          params["createTime"] = dateUtil.formatDateYmdhms(new Date());
          if (!params["parentMenuId"]) {
            params["parentMenuId"] = "0";
          }
          addMenu(params).then((response) => {
            if (response["code"] === 0) {
              this.ifShow = 1;
              this.$emit("update:changeShow", this.ifShow);
              this.$emit("getMenuList");
              this.$message.success("新增菜单成功！");
            } else {
              this.$message.warning("新增菜单失败！");
            }
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
          let params = this.form;
          params["updateBy"] = sessionStorage.getItem("userId");
            params["updateTime"] = dateUtil.formatDateYmdhms(new Date());
            params['menuId'] = this.rowData.menuId;
          updateMenu(params).then((response) => {
            if (response["code"] === 0) {
              this.ifShow = 1;
              this.$emit("update:changeShow", this.ifShow);
              this.$emit("getMenuList");
              this.$message.success("更新菜单成功！");
            } else {
              this.$message.warning("更新菜单失败！");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    this.operateType = this.type;
    this.fillValueHandle();
    this.form.createUserName = sessionStorage.getItem("userName");
    this.getMenuList();
  },
  destroyed() {}, //生命周期 - 销毁完成
};
</script>

<style lang='scss' scoped>
//@import url()
.planCls {
  width: 100%;
  height: 100%;
}
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
  /*width: 1680px;*/
  /*height: 100%;*/
  background: #ffffff;
  display: flex;
  /*align-items: center;*/
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