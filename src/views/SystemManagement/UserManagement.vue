<template>
  <div class="managementCls">
    <div class="header">
      <el-input style="width: 15rem;" v-model="username" placeholder="请输入用户名"></el-input>
      <el-button type="primary" icon="el-icon-search"  @click="getUserData1"></el-button>
    </div>
    <div class="header-btn" v-if="is_super_globel==='0'">
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="openInsertUser">新增</el-button>
      <el-button type="primary" size="medium" icon="el-icon-delete" @click="opendeleteMoreUser">删除</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" @cell-mouse-enter="setUser">
        <el-table-column
      type="selection"
      width="55">
      </el-table-column>
        <el-table-column width="80" label="序号" sortable type="index">
        </el-table-column>
        <el-table-column prop="userno" label="用户ID" sortable>
        </el-table-column>
        <el-table-column prop="username" label="用户名" sortable>
        </el-table-column>
        <el-table-column prop="likename" sortable label="昵称">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" sortable>
        </el-table-column>
        <el-table-column prop="state" label="状态" sortable>
          <!-- <template slot-scope="scope">
            <el-button v-if="scope.row.state===0" type="primary" size="mini">激活</el-button>
            <el-button v-else size="mini">未激活</el-button>
          </template> -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" active-value="0" inactive-value="1" active-text="已激活" inactive-text="未激活" @change="updateIsState">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="issuper" sortable label="超级用户" v-if="is_super_globel==='0'">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.issuper" active-value="0" inactive-value="1" active-text="是" inactive-text="否" @change="updateIsSuper">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间" sortable>
        </el-table-column>
        <el-table-column prop="lasttime" label="最后修改时间" sortable>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditUser(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="opendeleteUser(scope.row)"></el-button>
            <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser"></el-button> -->
            <!-- <el-button type="danger" icon="el-icon-delete" size="mini" @click="editUser"></el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagediv">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="修改用户"
      :visible.sync="edit_dialogVisible"
      width="40%"
      :modal-append-to-body="false"
    >
      <el-form label-position="right" label-width="80px" :model="user_form">
        <el-form-item label="用户ID">
          <el-input v-model="user_form.userno"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="user_form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="user_form.likename"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input  show-password v-model="user_form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user_form.email"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="edit_dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      title="新增用户"
      :visible.sync="insert_dialogVisible"
      width="40%"
      :modal-append-to-body="false"
    >
      <el-form label-position="right" label-width="110px" :model="user_form">
        <el-form-item label="用户ID">
          <el-input v-model="user_form.userno"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="user_form.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="user_form.likename"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user_form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input  show-password v-model="user_form.password"></el-input>
        </el-form-item>
        <el-form-item label="是否为超级用户" style="display: flex;">
          <el-switch
            style="margin-left: -120px"
            v-model="user_form.issuper"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="insert_dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="insertUser">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delete_dialogVisible"
      width="30%"
      :modal-append-to-body="false"
    >
      <span>确定要删除用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delete_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteMoreUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delete_dialogVisible1"
      width="30%"
      :modal-append-to-body="false"
    >
      <span>确定要删除用户 {{user_form.username}} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delete_dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getUserInfo,
    deleteUserInfo,
    editUserInfo,
    InsertUserInfo,
    deleteUserById
  } from "../../utils/request";
import dateUtil from "../../utils/dateUtil";
import { sessionClear,sessionGet, sessionSet } from "../../utils/auth";
  export default {
    name: "UserManagement",
    data() {
      return {
        username: '',
        tableData: [],
        multipleSelection: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        is_super_state: false,
        current_select_user: {},
        edit_dialogVisible: false,
        insert_dialogVisible: false,
        delete_dialogVisible: false,
        delete_dialogVisible1: false,
        user_form: {
          userno: '',
          username: '',
          likename: '',
          email: '',
        },
        is_super_globel: ''
      };
    },
    computed: {},
    mounted() {
      this.getUserData();
      this.is_super_globel = sessionGet("issuper")
    },
    methods: {
      getUserData() {
        var params = {
          name: this.username,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        getUserInfo(params).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data;
            this.tableData.forEach((item) => {
              item.createtime = dateUtil.formatDateYmdhms(new Date(item.createtime));
              item.lasttime = dateUtil.formatDateYmdhms(new Date(item.lasttime));
            })
            if(this.is_super_globel==='1') {
              var name = sessionGet("userName")
              this.tableData =this.tableData.filter((item) => {
                if(item.username === name) {
                  return item
                }      
              })
            }
            this.total = res.total;
          }
        })
      },
      getUserData1() {
        this.pageNo =1;
        this.getUserData();
      },
      openInsertUser() {
        this.user_form = {
              userno: '',
              username: '',
              likename: '',
              email: ''
            }
        this.insert_dialogVisible =true;
      },
      insertUser() {
        if(this.user_form.issuper){
          this.user_form.issuper = "0"
        } else {
          this.user_form.issuper = "1"
        }
        InsertUserInfo(this.user_form).then((res) => {
          if(res.code===200) {
            this.$message.success('新增成功')
            this.insert_dialogVisible =false;
            this.getUserData();

          }
        })
      },
      setUser(row) {
        this.user_form = row;
      },
      updateIsState(val) {
        var that = this
        this.user_form.state = val
        setTimeout(()=> {
          that.editUser();
        },1000)
      },
      updateIsSuper(val) {
        var that = this
        this.user_form.issuper = val
        setTimeout(()=> {
          that.editUser();
        },1000)
      },
      openEditUser(row) {
        this.user_form = row;
        this.edit_dialogVisible =true;
      },
      editUser() {
        editUserInfo(this.user_form).then((res) => {
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.edit_dialogVisible =false;
            this.user_form = {
              userno: '',
              username: '',
              likename: '',
              email: ''
            }
            this.getUserData();
          } else {
            this.$message.error('修改失败')
          }
        })
      },
      opendeleteUser(row) {
        this.delete_dialogVisible1 = true
        this.user_form = row;
      },
      deleteUser() {
        deleteUserInfo(this.user_form).then((res) => {
          if(res.code===200) {
            this.$message.success('删除成功')
            this.getUserData();
            this.delete_dialogVisible1 =false
          }
        })
      },
      opendeleteMoreUser() {
        this.delete_dialogVisible = true;
      },
      deleteMoreUser() {
        var arr = []
        this.multipleSelection.forEach(element => {
          arr.push(element.id)
        });
        deleteUserById({ids: arr}).then((res) => {
          if(res.code===200) {
            this.$message.success('删除成功')
            this.getUserData();
            this.delete_dialogVisible = false;
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getUserData();
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.getUserData();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
  };
</script>

<style scoped lang="scss">
  .managementCls ::v-deep {
    width: 100%;
    height: 100%;

    .header {
      display: flex;
      align-items: center;
      height: 4rem;

      .el-input__inner {
        border-radius: 0
      }
    }
    .header-btn {
      display: flex;
    }
    .table {
      height: 50rem;
    }

    .pagediv {
      height: 5rem;
      display: flex;
    }
  }
</style>