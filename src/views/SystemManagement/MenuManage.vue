<!-- 组件说明 -->
<template>
  <div class="managementCls">
    <el-row v-show="showNewAdd === 1">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item :label="$t('lang.menuManage.menuName')+':'">
          <el-input v-model="formInline.menuName" :placeholder="$t('lang.menuManage.menuName')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('lang.menuManage.sysName')+':'">
          <el-input v-model="formInline.sysName" :placeholder="$t('lang.menuManage.sysName')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">{{$t('lang.common.query')}}</el-button>
        </el-form-item>
      </el-form>
      <el-row style="height: 35px; width: 100%; margin: 10px 0">
        <i class="el-icon-tickets" style="position: absolute; left: 22px;margin-top: 20px;">&nbsp;数据列表</i>
        <el-button
          style="position: absolute; right: 22px"
          class="btnCls"
          @click="AddMenuHandle"
          >{{ $t("lang.menuManage.newMenu") }}</el-button
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
            prop="sysName"
            show-overflow-tooltip
            :label="$t('lang.menuManage.sysName')"
          >
          </el-table-column>
          <el-table-column
            prop="menuName"
            show-overflow-tooltip
            :label="$t('lang.menuManage.menuName')"
          >
          </el-table-column>
          <el-table-column
            prop="menuCode"
            show-overflow-tooltip
            :label="$t('lang.menuManage.menuCode')"
          >
          </el-table-column>
          <el-table-column
            prop="menuUrl"
            show-overflow-tooltip
            :label="$t('lang.menuManage.menuUrl')"
          >
          </el-table-column>
          <el-table-column
            prop="orderNum"
            show-overflow-tooltip
            :label="$t('lang.menuManage.orderNum')"
          >
          </el-table-column>
          <el-table-column
            prop="parentMenuId"
            show-overflow-tooltip
            :label="$t('lang.menuManage.parentMenuId')"
          >
          </el-table-column>
          <el-table-column
            prop="notes"
            show-overflow-tooltip
            :label="$t('lang.menuManage.notes')"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            show-overflow-tooltip
            :label="$t('lang.menuManage.type')"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">目录</span>
            <span v-if="scope.row.type === 2">菜单</span>
            <span v-if="scope.row.type === 3">按钮</span>
          </template>
          </el-table-column>
          <el-table-column :label="$t('lang.common.operate')">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="fixeds "
                @click="handleClick(scope.row, 'look')"
                size="small"
                >{{ $t("lang.common.look") }}</el-button
              >
              <el-button
                type="text"
                class="fixeds editBtnCls"
                size="small"
                @click="handleClick(scope.row, 'edit')"
                >{{ $t("lang.common.edit") }}</el-button
              >
              <el-button
                type="text"
                class="fixeds deleteBtnCls"
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
      <new-menu-info
      :type="type"
        :rowData="rowData"
        :title="title"
        :changeShow.sync="showNewAdd"
        @getMenuList="getMenuList"></new-menu-info>
    </el-row>
  </div>
</template>

<script>
//import x from ''
import { getMenuTree,deleteMenu } from "../../utils/request";
import NewMenuInfo from './NewMenuInfo.vue';
import { extractTree } from "../../utils/common";
export default {
  name: "MenuManage",
  components: {NewMenuInfo},
  data() 
    {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 3,
      showNewAdd: 1,
      rowData: null,
      title: "",
      formInline: {
        menuName:'',
        sysName:'',
      },
      type: "details",
    };
  },
  mounted() {
    this.getMenuList();
  },
  computed: {},
  methods: {
    getMenuList: async function () {
      const { code, data } = await getMenuTree(); 
      if (code === 0 && data) {
        let tempData = extractTree(data,'childrenList');
        if (this.formInline.menuName) {
          tempData = tempData.filter(item => item.menuName === this.formInline.menuName);
        }
        if (this.formInline.sysName) {
          tempData = tempData.filter(item => item.sysName === this.formInline.sysName);
        }
        tempData.sort((a,b) => {
          return a.parentMenuId - b.parentMenuId;
        });
        this.tableData = tempData;
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
    AddMenuHandle() {
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
          menuId: data.menuId,
        };
        this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
          confirmButtonText: this.$t('lang.common.ok'),
          cancelButtonText: this.$t('lang.common.cancel'),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        })
          .then(() => {
            deleteMenu(params)
              .then((response) => {
                if (response["code"] === 0) {
                  this.getMenuList();
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                } else {
                  this.$message.warning("删除菜单信息失败！");
                }
              })
              .catch(() => {
                this.$message.warning("删除菜单信息失败！");
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
  },
  destroyed() {}, //生命周期 - 销毁完成
};
</script>

<style lang='scss' scoped>
//@import url()
.fixeds {
  height: 15px;
  font-size: 16px;
  font-weight: 500;
  // color: #42a4ef;
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