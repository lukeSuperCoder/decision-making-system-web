<template>
  <div class="managementCls">
    <el-row v-show="showNewAdd === 1">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item :label="$t('lang.roleManage.roleNme')+':'">
          <el-input v-model="formInline.roleName" :placeholder="$t('lang.roleManage.roleNme')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.roleManage.roleStatus')+':'">
          <el-select v-model="formInline.status" :placeholder="$t('lang.roleManage.roleStatus')">
            <el-option :label="$t('lang.common.all')" :value="0"></el-option>
            <el-option :label="$t('lang.roleManage.effective')" :value="1"></el-option>
            <el-option :label="$t('lang.common.delete')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lang.roleManage.ifDefault')+':'">
          <el-select v-model="formInline.roleDefault" :placeholder="$t('lang.roleManage.ifDefault')">
            <el-option :label="$t('lang.common.all')" :value="-1"></el-option>
            <el-option :label="$t('lang.roleManage.unDefault')" :value="0"></el-option>
            <el-option :label="$t('lang.roleManage.default')" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleInfoData">{{$t('lang.common.query')}}</el-button>
        </el-form-item>
      </el-form>
      <div style="height: 35px; width: 100%; margin: 10px 0">
      <i class="el-icon-tickets" style="position: absolute; left: 22px;margin-top: 20px;">&nbsp;数据列表</i>
        <el-button
          style="position: absolute; right: 22px"
          class="btnCls"
          @click="AddUserHandle"
          >{{$t('lang.roleManage.newRole')}}</el-button
        >
      </div>
      <el-row class="eltable">
        <base-table
          class="tableCls"
          :index="true"
          :total="total"
          :select="false"
          :showPage="true"
          :table-list="tableData"
          :header="header"
          :height="700"
          :pageNo="pageNo"
          :pageSize="pageSize"
          :row-class-name="tableRowClassName"
          :header-row-class-name="thCls"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @selectionChange="selectionChangeHandle"
        ></base-table>
      </el-row>
    </el-row>
    <el-row v-if="showNewAdd === 2" :style="{ height: '100%' }">
      <new-role-info
        :type="type"
        :rowData="rowData"
        :title="title"
        :changeShow.sync="showNewAdd"
        @getRoleInfoData="getRoleInfoData"
      ></new-role-info>
    </el-row>
    <el-row v-if="showNewAdd === 3" :style="{ height: '100%' }">
      <rights-management
        :type="type"
        :rowData="rowData"
        :title="title"
        :changeShow.sync="showNewAdd"
      ></rights-management>
    </el-row>
  </div>
</template>

<script>
import { deleteRoleInfo, getRoleInfo } from "../../utils/request";
import NewRoleInfo from "./NewRoleInfo.vue";
import BaseTable from "../../components/BaseTable.vue";
import RightsManagement from "./RightsManagement.vue";
export default {
  name: "RoleManagement",
  components: { NewRoleInfo, BaseTable, RightsManagement },
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 3,
      showNewAdd: 1,
      rowData: null,
      title: "",
      type: "details",
      header: [],
      batchDeleteBaseIds: [],
      formInline: {
        roleName: '',
        status: 0,
        roleDefault:-1
      },
    };
  },
  computed: {},
  mounted() {
    this.getRoleInfoData();
  },
  methods: {
    initData: function () {
      this.header = [
        { prop: "roleName", label: this.$t('lang.roleManage.roleNme') },
        {
          prop: "roleDefault",
          label: this.$t('lang.roleManage.ifDefault'),
          render: (h,data) => {
            if (data.row.roleDefault === 0) {
              return <span>{ this.$t('lang.roleManage.unDefault')}</span>;
            } else {
              return <span>{ this.$t('lang.roleManage.default')}</span>;
            }
          },
        },
        {
          prop: "sysInit",
          label: this.$t('lang.roleManage.ifInit'),
          render: (h,data) => {
            if (data.row.sysInit === 0) {
              return <span>{ this.$t('lang.roleManage.unInit')}</span>;
            } else {
              return <span>{ this.$t('lang.roleManage.init')}</span>;
            }
          },
        },
        {
          prop: "status",
          label: this.$t('lang.roleManage.roleStatus'),
          render: (h,data) => {
            if (data.row.status === 1) {
              return <span>{ this.$t('lang.roleManage.effective')}</span>;
            } else {
              return <span>{ this.$t('lang.common.delete')}</span>;
            }
          },
        },
        { prop: "createUserName", label:  this.$t('lang.roleManage.creatName') },
        {
          prop: "roleId", label: this.$t('lang.userManage.roleManage'),
          render: (h,data) => {
            return (<div class="viewBtnCls" onClick={() => {
              this.roleManage(data.row)
             }}>权限管理</div>)
          }
        },
        {
          label: this.$t('lang.common.operate'),
          width: 300,
          align: "center",
          render: (h, data) => {
            return (
              <div style="display:flex;justify-content:center;gap:10px;">
                <div
                  class="viewBtnCls"
                  onClick={() => {
                    this.handleClick(data.row, "look");
                  }}
                >
                  { this.$t('lang.common.look')}
                </div>
                <div
                  class="editBtnCls"
                  onClick={() => {
                    this.handleClick(data.row, "edit");
                  }}
                >
                  { this.$t('lang.common.edit')}
                </div>
                <div
                  class="deleteBtnCls"
                  v-if="data.row.roleCode === 'sys_admin'"
                  onClick={() => {
                    this.handleClick(data.row, "delete");
                  }}
                >
                  { this.$t('lang.common.delete')}
                </div>
              </div>
            );
          },
        },
      ];
    },
    getRoleInfoData: async function () {
      let that = this;
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      if (this.formInline.roleName) {
        params['roleName'] = this.formInline.roleName;
      }
      if (this.formInline.status) {
        params['status'] = this.formInline.status;
      }
      if (this.formInline.roleDefault) {
        params['roleDefault'] = this.formInline.roleDefault;
      }
      const { code, data } = await getRoleInfo(params);
      if (code === 0) {
        that.tableData = data["records"];
        this.initData();
      } else {
        that.$message.warning("获取角色信息失败！");
      }
    },
    thCls() {
      return "thCls";
    },
    tdCls() {
      return "tdCls";
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 === 1) {
        return "success-row";
      }
      return "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      // 重新请求接口数据
      this.getRoleInfoData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // 请求当前页接口数据
      this.getRoleInfoData();
    },
    AddUserHandle() {
      this.title = "新建";
      this.showNewAdd = 2;
    },
    handleClick: function (data, type) {
      if (type === "look") {
        // 查看
        this.title = this.$t('lang.common.look');
        this.rowData = data;
        this.showNewAdd = 2;
        this.type = "details";
      }
      if (type === "edit") {
        // 编辑
        this.title = this.$t('lang.common.edit');
        this.rowData = data;
        this.showNewAdd = 2;
        this.type = "edit";
      }
      if (type === "delete") {
        // 删除
        let params = {
          roleId: data.roleId,
        };
        this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
          confirmButtonText: this.$t('lang.common.ok'),
          cancelButtonText: this.$t('lang.common.cancel'),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        })
          .then(() => {
            deleteRoleInfo(params)
              .then((response) => {
                if (response["code"] === 0) {
                  this.getRoleInfoData();
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                } else {
                  this.$message.warning("删除角色信息失败！");
                }
              })
              .catch(() => {
                this.$message.warning("删除角色信息失败！");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    selectionChangeHandle(val) {
      if (val.length > 0) {
        let ids = [];
        val.forEach((item) => {
          ids.push(item["id"]);
        });
        console.log("ids", ids);
        this.batchDeleteBaseIds = ids;
      }
    },
    roleManage(data) {
      this.showNewAdd = 3;
      this.title = "新建";
      this.rowData = data;
    }
  },
};
</script>

<style scoped lang="scss">
.btnCls {
  background: #45b2e0;
  border-radius: 4px;
  color: white;
}
.eltable {
  //margin-left: 22px;
  padding-left: 20px;
  padding-right: 20px;
  //width: 100%;
}
.eltable ::v-deep.el-table th > .cell {
  min-width: 70px;
}
.managementCls ::v-deep {
  .el-table td,
  .el-table th {
    padding: 0;
  }
  .el-table .warning-row {
    background: rgba(130, 184, 247, 0);
  }
  .el-table .success-row {
    background: rgba(130, 184, 247, 0.08);
  }
  .thCls {
    background: rgba(130, 184, 247, 0.35);
    border-top: 1px solid rgba(130, 184, 247, 1) !important;
    border-bottom: 1px solid rgba(130, 184, 247, 1) !important;
    color: #555d72;
    font-size: 16px;
    font-weight: 500;
    height: 50px;
  }
  .tableCls {
    border-bottom: 1px solid rgba(130, 184, 247, 1) !important;
  }
}
.fixeds {
  height: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #42a4ef;
}
</style>
