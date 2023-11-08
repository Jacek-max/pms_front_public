<template>
  <el-main>
    <el-form
      :model="parms"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="姓名">
        <el-input v-model="parms.loginName"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="parms.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="selectBtn">查询</el-button>
        <el-button
          icon="el-icon-delete"
          style="color: #ff7670"
          @click="resetBtn"
          >重置</el-button
        >
        <el-button type="primary"  v-if="hasPerm('sys:user:add')"  icon="el-icon-plus" @click="addUser"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :data="tableList"
      size="small"
      :height="tableHeight"
      empty-text="暂无数据"
      border
      stripe
    >
      <el-table-column
        align="center"
        prop="loginName"
        label="姓名"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="手机号码"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="idCard"
        label="身份证号"
      ></el-table-column>
      <el-table-column align="center" prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex == '1'" size="normal">男</el-tag>
          <el-tag v-if="scope.row.sex == '0'" size="success">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="是否离职">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            active-text="是"
            inactive-text="否"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isUsed" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUsed"
            :active-value="'0'"
            :inactive-value="'1'"
            active-text="是"
            inactive-text="否"
            @change="changeUsed(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" width="290" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:user:edit')"
            @click="editUser(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="success"
            icon="el-icon-pie-chart"
            size="small"
            v-if="hasPerm('sys:user:assignRole')"
            @click="assignRole(scope.row)"
            >分配角色</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:user:delete')"
            @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="parms.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="parms.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parms.total"
      background
    >
    </el-pagination>

    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      :width="dialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="loginName" label="姓名：">
            <el-input v-model="addModel.loginName"></el-input>
          </el-form-item>
          <el-form-item style="width: 264px" prop="sex" label="性别：">
            <el-radio-group v-model="addModel.sex">
              <el-radio :label="'1'">男</el-radio>
              <el-radio :label="'0'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="phone" label="手机号：">
            <el-input v-model="addModel.phone"></el-input>
          </el-form-item>
          <el-form-item prop="idCard" label="身份证：">
            <el-input v-model="addModel.idCard"></el-input>
          </el-form-item>
          <el-form-item label="账号：">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item style="width: 264px" prop="status" label="离职：">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width: 264px" prop="isUsed" label="启用：">
            <el-radio-group v-model="addModel.isUsed">
              <el-radio :label="'0'">是</el-radio>
              <el-radio :label="'1'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

    <!-- 分配权限弹框 -->
    <sys-dialog
      :title="roleDialog.title"
      :width="roleDialog.width"
      :height="roleDialog.height"
      :visible="roleDialog.visible"
      @onClose="roleClose"
      @onConfirm="roleConfirm"
    >
      <template slot="content">
        <el-table :data="roleList" :height="roleHeight" border stripe>
          <el-table-column width="50" align="center" label="选择">
            <template slot-scope="scope">
              <el-radio
                v-model="radio"
                :label="scope.row.roleId"
                @change="getCurrentRow(scope.row)"
              >
                {{ "" }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="remark" label="角色备注"> </el-table-column>
        </el-table>
        <el-pagination
          @size-change="roleSizeChange"
          @current-change="roleCurrentChange"
          :current-page.sync="roleParm.currentPage"
          :page-sizes="[10, 20, 40, 80, 100]"
          :page-size="roleParm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="roleParm.total"
          background
        >
        </el-pagination>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addUserApi, assignSaveApi, deleteUserApi, editUserApi, getRoleByUserIdApi, getUserListApi,} from "@/api/user";
import SysDialog from "@/components/system/SysDialog.vue";
import {getRoleListApi} from "@/api/role";

export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      //存储角色列表的数据
      roleList: [],

      roleHeight: 0,

      //分配角色保存参数
      assignParm: {
        roleId: "",
        userId: "",
      },

      radio: "",

      //角色列表分页参数
      roleParm: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },

      addModel: {
        userId: "",
        type: "",
        username: "",
        sex: "",
        phone: "",
        idCard: "",
        loginName: "",
        password: "",
        status: "",
        isUsed: "",
      },
      rules: {
        loginName: [
          {
            required: true,
            trigger: "change",
            message: "请填写姓名",
          },
        ],
        sex: [
          {
            required: true,
            trigger: "change",
            message: "请选择性别",
          },
        ],
        phone: [
          {
            required: true,
            trigger: "change",
            message: "请填写手机号码",
          },
          {
            pattern:/^1[3|5|7|8|9]\d{9}$/,
            message:"请输入正确的手机号信息",
            trigger:"change"
          }
        ],
        idCard: [
          {
            required: true,
            trigger: "change",
            message: "请填写身份证号",
          },
        ],
        status: [
          {
            required: true,
            trigger: "change",
            message: "请选择在职状态",
          },
        ],
        isUsed: [
          {
            required: true,
            trigger: "change",
            message: "请选择账号状态",
          },
        ],
      },
      dialog: {
        title: "",
        visible: false,
        height: 240,
        width: 610,
      },

      roleDialog: {
        title: "",
        visible: false,
        height: 400,
        width: 800,
      },

      tableHeight: 0,
      parms: {
        loginName: "",
        phone: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      tableList: [],
    };
  },

  created() {
    this.getUserList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },
  methods: {
    //单选按钮控制
    getCurrentRow(row) {
      this.assignParm.roleId = row.roleId;
    },
    //角色列表页容量改变
    roleSizeChange(val) {
      this.roleParm.pageSize = val;
      this.getRoleList();
    },

    roleCurrentChange(val) {
      this.roleParm.currentPage = val;
      this.getRoleList();
    },

    async getRoleList() {
      let res = await getRoleListApi(this.roleParm);
      if (res && res.code == 200) {
        console.log(res);
        this.roleList = res.data.records;
        this.roleParm.total = res.data.total;
      }
    },

    //分配角色
    async assignRole(row) {
      this.radio = "";
      this.assignParm.userId = row.userId;
      this.roleDialog.title = "为【" + row.loginName + "】分配角色";
      this.roleDialog.visible = true;

      //获取角色列表
      this.getRoleList();

      this.$nextTick(() => {
        this.roleHeight = window.innerHeight - 300;
      });
      let roleRes = await getRoleByUserIdApi({ userId: row.userId });
      if (roleRes && roleRes.code == 200) {
        console.log(roleRes);
        if (roleRes.data) {
          this.radio = roleRes.data.roleId;
          this.assignParm.roleId = roleRes.data.roleId;
        }
      }
    },

    roleClose() {
      this.roleDialog.visible = false;
    },

    async roleConfirm() {
      console.log(this.assignParm);
      let res = await assignSaveApi(this.assignParm);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.roleDialog.visible = false;
      }
    },

    //重置
    resetBtn() {
      this.parms.loginName = "";
      this.parms.phone = "";
      this.getUserList();
    },
    //搜索事件
    selectBtn() {
      this.getUserList();
    },

    onClose() {
      this.dialog.visible = false;
    },

    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.type == "0") {
            res = await addUserApi(this.addModel);
          } else {
            res = await editUserApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getUserList();
            this.dialog.visible = false;
            this.$message.success(res.msg);
          }
        }
      });
    },

    addUser() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.type = "0";
      this.dialog.title = "新增员工";
      this.dialog.visible = true;
    },

    editUser(row) {
      this.$resetForm("addForm", this.addModel);
      this.addModel.type = "1";
      this.$objCoppy(row, this.addModel);
      this.dialog.title = "编辑员工";
      this.dialog.visible = true;
      console.log(row);
    },

    async deleteUser(row) {
      console.log(row);
      let confrim = await this.$myconfirm("确认删除该员工吗？");
      if (confrim) {
        let res = await deleteUserApi({ userId: row.userId });
        if (res && res.code == 200) {
          this.getUserList();
          this.$message.success(res.msg);
        }
      }
    },

    async changeStatus(row) {
      console.log(row);
      let parm = {
        userId: row.userId,
        status: row.status,
      };

      let res = await editUserApi(parm);
      if (res && res.code == 200) {
        this.getUserList();
        this.$message.success(res.msg);
      }
    },

    async changeUsed(row) {
      console.log(row);
      let parm = {
        userId: row.userId,
        isUsed: row.isUsed,
      };

      let res = await editUserApi(parm);
      if (res && res.code == 200) {
        this.getUserList();
        this.$message.success(res.msg);
      }
    },

    async getUserList() {
      let res = await getUserListApi(this.parms);
      if (res.code == 200) {
        console.log(res);
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },

    sizeChange(val) {
      console.log(val);
      this.parms.pageSize = val;
      this.getUserList();
    },

    currentChange(val) {
      this.parms.currentPage = val;
      this.getUserList();
    },
  },
};
</script>

<style lang="scss" scoped>
// eslint-disable-next-line eol-last
</style>
