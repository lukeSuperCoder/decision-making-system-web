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
        <el-form-item label="菜单树:" prop="name" class="treeCls">
          <el-tree
            ref="tree"
            check-strictly
            v-if="showTree"
            :data="menuList"
            show-checkbox
            node-key="menuId"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps"
            :default-expand-all="true"
          >
          </el-tree>
        </el-form-item>
        <el-row class="btnSave">
          <el-form-item>
            <el-button
              class="btnClsing"
              size="small"
              v-show="title === '新建'"
              @click="saveDataHandle('form')"
              >确定</el-button
            >
            <el-button
              class="btnClsing"
              size="small"
              v-show="title === '编辑'"
              @click="upDataDataHandle"
              >修改</el-button
            >
            <el-button
              class="btnCancel"
              size="small"
              v-show="title !== '查看'"
              @click="cancelHandle"
              >取消</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
//import x from ''
import { getMenuTree, roleHasMenu,updateAndDelMenu } from "../../utils/request";
import { extractTree } from "../../utils/common";
export default {
  name: "RightsManagement",
  props: {
    rowData: Object,
    title: String,
    type: String,
  },
  components: {},
  data() {
    return {
      operateType: "",
      form: {
        name: "",
      },
      rules: {},
      menuList: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: "childrenList",
        label: "menuName",
      },
      showTree: false,
      ifShow: 0,
      tempData: null,
      expandTree: [],
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
    saveDataHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let checkedKeys = this.$refs.tree.getCheckedKeys();
          let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
          checkedKeys = checkedKeys.concat(halfCheckedKeys);
          let needAdd = [],
            needDel = [];
          checkedKeys.forEach((item) => {
            if (this.defaultCheckedKeys.indexOf(item) === -1) {
              needAdd.push(item);
            }
          });
          this.defaultCheckedKeys.forEach((item) => {
            if (checkedKeys.indexOf(item) === -1) {
              needDel.push(item);
            }
          });
          let params = {
            needAddMenuList: needAdd,
            needDelMenuList: needDel,
            roleId: this.tempData["roleId"],
          };
          updateAndDelMenu(params).then((response) => {
            if (response["code"] === 0) {
              this.ifShow = 1;
              this.$emit("update:changeShow", this.ifShow);
              this.$message.success("权限编辑成功！");
            } else {
              this.$message.warning("权限编辑失败！");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    upDataDataHandle() {},
    getMenuList: async function () {
      const { code, data } = await getMenuTree();
      if (code === 0 && data) {
        this.menuList = data;
        this.expandTree = extractTree(data, "childrenList");
        roleHasMenu({ roleId: this.tempData.roleId }).then(
          (response) => {
            let checkedKeys = response["data"];
            checkedKeys.forEach((item) => {
              this.defaultCheckedKeys.push(item["menuId"]);
            });
            this.showTree = true;
          }
        );
      }
    },
  },
  mounted() {
    this.operateType = this.type;
    this.tempData = this.rowData;
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
.treeCls {
  height: 500px;
  overflow-y: scroll;
}
::v-deep .el-tree {
  border: 1px solid #45b2e0;
  margin-top: 30px;
}
</style>