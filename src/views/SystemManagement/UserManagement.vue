<template>
  <div class="managementCls">

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
  
}
</style>
