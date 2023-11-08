<template>
  <el-main>
    <el-form
      :model="parms"
      ref="selectForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="角色名称">
        <el-input v-model="parms.roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button
          icon="el-icon-delete"
          style="color: #ff7670"
          @click="resetBtn"
          >重置</el-button
        >
        <el-button type="primary" v-if="hasPerm('sys:menu:add')" icon="el-icon-plus" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="roleList" :height="tableHeight" size="small" border stripe>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column width="290" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:menu:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="success"
            icon="el-icon-pie-chart"
            size="small"
            v-if="hasPerm('sys:role:assignRole')"
            @click="assignRoleBtn(scope.row)"
            >分配权限</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:menu:delete')"
            @click="deleteBtn(scope.row)"
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
      :height="dialog.height"
      :width="dialog.width"
      :visible="dialog.visible"
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
          <el-form-item prop="roleName" label="角色名称">
            <el-input v-model="addModel.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

    <!-- 权限弹框 -->
    <sys-dialog
      :title="assignDialog.title"
      :width="assignDialog.width"
      :height="assignDialog.height"
      :visible="assignDialog.visible"
      @onClose="assignClose"
      @onConfirm="assignConfirm"
    >
      <template slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          node-key="menuId"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="true"
          default-expand-all
          :default-checked-keys="assignTreeChecked"
        ></el-tree>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addRoleApi, assignSaveApi, deleteRoleApi, editRoleApi, getAssignTreeApi, getRoleListApi,} from "@/api/role";
import SysDialog from "@/components/system/SysDialog.vue";
import {getUserId} from "@/utils/auth";

export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      roleId: "",
      assignTreeData: [],
      assignTreeChecked: [],
      defaultProps: {
        children: "children",
        label: "menuLabel",
      },
      //分配权限弹框
      assignDialog: {
        title: "",
        width: 300,
        height: 500,
        visible: false,
      },

      rules: {
        roleName: [
          {
            required: true,
            trigger: "change",
            message: "请填写角色名称",
          },
        ],
      },
      addModel: {
        type: "",
        roleId: "",
        roleName: "",
        remark: "",
      },
      dialog: {
        title: "",
        height: 150,
        width: 610,
        visible: false,
      },
      roleList: [],
      tableHeight: 0,
      parms: {
        pageSize: 10,
        currentPage: 1,
        roleName: "",
        total: 0,
      },
    };
  },

  created() {
    this.getRoleList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },

  methods: {
    editBtn(row) {
      this.$resetForm("addForm", this.addModel);
      this.addModel.type = "1";
      this.$objCoppy(row, this.addModel);
      this.dialog.visible = true;
      this.dialog.title = "编辑角色";
    },

    //分配权限按钮
    async assignRoleBtn(row) {
      this.assignTreeData = [];
      this.assignTreeChecked = [];
      this.roleId = row.roleId;
      //设置弹框属性
      this.assignDialog.title = "为【" + row.roleName + "】分配权限";
      this.assignDialog.visible = true;
      let parm = {
        userId: getUserId(),
        roleId: row.roleId,
      };
      let res = await getAssignTreeApi(parm);
      if (res && res.code == 200) {
        console.log(res);
        //赋值
        this.assignTreeData = res.data.listmenu;
        this.assignTreeChecked = res.data.checkList;
        if (this.assignTreeChecked.length > 0) {
          let newArr = [];
          this.assignTreeChecked.forEach((item) => {
            this.checked(item,this.assignTreeData,newArr)
          });
          this.assignTreeChecked = newArr;
        }
      }
    },

    checked(id, data, newArr) {
      data.forEach((item) => {
        if (item.menuId == id) {
          if (item.children && item.children.length == 0) {
            newArr.push(item.menuId);
          }
        } else {
          if (item.children && item.children.length != 0) {
            this.checked(id, item.children, newArr);
          }
        }
      });
    },

    assignClose() {
      this.assignDialog.visible = false;
    },

    async assignConfirm() {
      let ids = this.$refs.assignTree
        .getCheckedKeys()
        .concat(this.$refs.assignTree.getHalfCheckedKeys());
      console.log(ids);
      let parm = {
        roleId: this.roleId,
        list: ids,
      };
      let res = await assignSaveApi(parm);
      console.log(res);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.assignDialog.visible = false;
      }
    },

    async deleteBtn(row) {
      let confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deleteRoleApi({ roleId: row.roleId });
        if (res && res.code == 200) {
          this.getRoleList();
          this.$message.success(res.msg);
        }
      }
    },

    onClose() {
      this.dialog.visible = false;
    },

    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.type == "0") {
            res = await addRoleApi(this.addModel);
          } else {
            res = await editRoleApi(this.addModel);
          }

          if (res && res.code == 200) {
            this.getRoleList();
            this.$message.success(res.msg);
            this.dialog.visible = false;
          }
        }
      });
    },

    searchBtn() {
      this.getRoleList();
    },

    resetBtn() {
      this.parms.roleName = "";
      this.getRoleList();
    },

    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.type = "0";

      this.dialog.title = "新增角色";
      this.dialog.visible = true;
    },

    sizeChange(val) {
      this.parms.pageSize = val;
      this.getRoleList();
    },

    currentChange(val) {
      this.parms.currentPage = val;
      this.getRoleList();
    },

    async getRoleList() {
      let res = await getRoleListApi(this.parms);
      console.log(res);
      if (res && res.code == 200) {
        this.roleList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style>
</style>
