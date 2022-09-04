<template>
  <div class="managementCls">
    <el-row v-show="showNewAdd === 1">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item :label="$t('lang.userManage.userName')+':'">
          <el-input v-model="formInline.userName" :placeholder="$t('lang.userManage.userName')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.userManage.createTime')+':'">
          <el-date-picker
            v-model="formInline.selectTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            :range-separator="$t('lang.common.to')"
            :start-placeholder="$t('lang.common.startTime')"
            :end-placeholder="$t('lang.common.endTime')"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserInfoData">{{$t('lang.common.query')}}</el-button>
        </el-form-item>
      </el-form>
      <el-row style="height: 35px; width: 100%; margin: 10px 0">
        <i class="el-icon-tickets" style="position: absolute; left: 22px;margin-top: 20px;">&nbsp;数据列表</i>
        <el-button
          v-permission="'userManage::newuser'"
          style="position: absolute; right: 22px"
          class="btnCls"
          @click="AddUserHandle"
          >{{ $t("lang.userManage.newUser") }}</el-button
        >
      </el-row>
      <div class="eltable">
        <el-table
          class="tableCls"
          :header-cell-class-name="thCls"
          :cell-class-name="tdCls"
          :data="tableData"
          :row-class-name="tableRowClassName"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            width="120"
            align="center"
            :label="$t('lang.common.index')"
          >
          </el-table-column>
          <el-table-column
            prop="userName"
            show-overflow-tooltip
            :label="$t('lang.userManage.userName')"
          >
          </el-table-column>
          <el-table-column
            prop="loginName"
            show-overflow-tooltip
            :label="$t('lang.userManage.loginName')"
          >
          </el-table-column>
          <el-table-column
            prop="password"
            show-overflow-tooltip
            :formatter="passWordFormatter"
            :label="$t('lang.userManage.userPass')"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            show-overflow-tooltip
            :label="$t('lang.userManage.phone')"
          >
          </el-table-column>
          <el-table-column
            prop="orgName"
            show-overflow-tooltip
            :label="$t('lang.userManage.orgName')"
          >
          </el-table-column>
          <el-table-column
            prop="deptName"
            show-overflow-tooltip
            :label="$t('lang.userManage.deptName')"
          >
          </el-table-column>
          <el-table-column
            prop="roleNames"
            show-overflow-tooltip
            :label="$t('lang.userManage.sysRole')"
          >
          </el-table-column>
          <el-table-column :label="$t('lang.common.operate')">
            <template slot-scope="scope">
              <el-button
                v-permission="'userManage::newuser'"
                type="text"
                class="fixeds"
                @click="handleClick(scope.row, 'look')"
                size="small"
                >{{ $t("lang.common.look") }}</el-button
              >
              <el-button
                v-permission="'userManage::edit'"
                type="text"
                class="fixeds"
                size="small"
                @click="handleClick(scope.row, 'edit')"
                >{{ $t("lang.common.edit") }}</el-button
              >
              <el-button
                v-permission="'userManage::delete'"
                type="text"
                class="fixeds"
                size="small"
                @click="handleClick(scope.row, 'delete')"
                >{{ $t("lang.common.delete") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-row style="text-align: center; margin-top: 15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next,sizes, jumper"
          background
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-row>
    <el-row v-if="showNewAdd === 2" :style="{ height: '100%' }">
      <new-user-info
        :rowData="rowData"
        :title="title"
        :changeShow.sync="showNewAdd"
        @getUserInfoData="getUserInfoData"
      ></new-user-info>
    </el-row>
  </div>
</template>

<script>
import { getUserInfo, deleteUserInfo } from "../../utils/request";
import NewUserInfo from "./NewUserInfo.vue";
import dateUtil from "../../utils/dateUtil";
export default {
  name: "UserManagement",
  components: { NewUserInfo },
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 3,
      showNewAdd: 1,
      rowData: null,
      title: "",
      formInline: {
        selectTime: "",
        userName:''
      },
      
      pickerOptions: {
          shortcuts: [{
            text: this.$t('lang.common.nearWeek'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: this.$t('lang.common.nearMonth'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: this.$t('lang.common.nearThMoth'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    };
  },
  computed: {},
  mounted() {
    this.getUserInfoData();
  },
  methods: {
    getUserInfoData: function () {
      let that = this;
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      if (this.formInline.selectTime) {
        params['startTime'] = dateUtil.formatDateYmdhms(new Date(this.formInline.selectTime[0]));
        params['endTime'] = dateUtil.formatDateYmdhms(new Date(this.formInline.selectTime[1]));
      }
      if (this.formInline.userName) {
        params['userName'] = this.formInline.userName;
      }
      getUserInfo(params)
        .then((response) => {
          if (response["code"] === 0) {
            let data = response["data"]["records"];
            data.forEach((item) => {
              if (item.roleList.length > 0) {
                item.roleNames = item.roleList[0].roleName;
                item.roleId = item.roleList[0].roleId;
              }
            });
            this.tableData = data;
            that.total = response["data"]["total"];
          } else {
            that.$message.warning("获取用户信息失败！");
          }
        })
        .catch(() => {
          this.$message.warning("获取用户信息失败！");
        });
    },
    passWordFormatter(row) {
      // if (this.Rsa.decrypt(row.password)) {
      //   return this.Rsa.decrypt(row.password);
      // } else {
        return row.password;
      // }
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
      this.pageSize = val;
      // 重新请求接口数据
      this.getUserInfoData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNo = val;
      // 请求当前页接口数据
      this.getUserInfoData();
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
      }
      if (type === "edit") {
        // 编辑
        this.title = this.$t('lang.common.edit');
        this.rowData = data;
        this.showNewAdd = 2;
      }
      if (type === "delete") {
        // 删除
        let params = {
          userId: data.userId,
        };
        this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
          confirmButtonText: this.$t('lang.common.ok'),
          cancelButtonText: this.$t('lang.common.cancel'),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        })
          .then(() => {
            deleteUserInfo(params)
              .then((response) => {
                if (response["code"] === 0) {
                  this.getUserInfoData();
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                } else {
                  this.$message.warning("删除用户信息失败！");
                }
              })
              .catch(() => {
                this.$message.warning("删除用户信息失败！");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    }
  },
};
</script>

<style scoped lang="scss">
.fixeds {
  height: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #42a4ef;
}
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
.managementCls ::v-deep {
  .el-table td,
  .el-table th {
    padding: 0;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    width: 30px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #e7e9ee;
    border-radius: 4px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #409eff;
  }
  .el-pagination__jump {
    font-size: 16px;
    font-weight: 500;
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
  .el-table th > .cell {
    min-width: 70px;
  }
  .tdCls {
    height: 50px !important;
    border-bottom: 1px solid rgba(130, 184, 247, 1) !important;
    font-size: 16px;
    font-weight: 500;
    color: #555d72;
  }
}
</style>
