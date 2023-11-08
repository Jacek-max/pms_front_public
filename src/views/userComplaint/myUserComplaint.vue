<template>
  <el-main>
    <!-- 搜索框 -->
    <el-form
      :model="parm"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="投诉标题">
        <el-input v-model="parm.title"></el-input>
      </el-form-item>

      <el-form-item label="投诉内容">
        <el-input v-model="parm.complaintContent"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button icon="el-icon-plus" type="primary" v-if="hasPerm('sys:userComplaintList:add')" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column label="投诉标题" prop="title"></el-table-column>
      <el-table-column
        label="投诉内容"
        prop="complaintContent"
      ></el-table-column>
      <el-table-column label="处理状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '1'" type="success" size="small"
            >已处理</el-tag
          >
          <el-tag v-if="scope.row.status == '0'" type="danger" size="small"
            >未处理</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:userComplaintList:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:userComplaintList:delete')"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="parm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="parm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parm.total"
      background
    >
    </el-pagination>

    <!-- 弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :width="addDialog.width"
      :height="addDialog.height"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <template slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item prop="title" label="投诉标题">
            <el-input v-model="addModel.title"></el-input>
          </el-form-item>
          <el-form-item prop="complaintContent" label="投诉内容">
            <el-input
              type="textarea"
              v-model="addModel.complaintContent"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getMyListApi} from "@/api/userComplaint";
import {getUserId} from "@/utils/auth";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      //表格数据
      tableList: [],

      tableHeight: 0,

      rules: {
        title: [
          {
            trigger: "change",
            required: true,
            message: "请填写投诉标题",
          },
        ],
        complaintContent: [
          {
            trigger: "change",
            required: true,
            message: "请填写投诉内容",
          },
        ],
      },

      parm: {
        currentPage: 1,
        pageSize: 10,
        title: "",
        complaintContent: "",
        total: 0,
        userId:'',
      },

      //   弹框属性
      addDialog: {
        title: "",
        height: 180,
        width: 610,
        visible: false,
      },

      //新增弹框绑定数据域
      addModel: {
        complaintId: "",
        userId: "",
        title: "",
        complaintContent: "",
        editType: "",
      },
    };
  },

  created() {
    this.getList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },

  methods: {
    //搜索区域事件
    searchBtn() {
      this.getList();
    },

    resetBtn() {
      this.parm.title = "";
      this.parm.complaintContent = "";
      this.getList();
    },

    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增投诉";
      this.addDialog.visible = true;
    },

    //表格操作
    editBtn(row) {
      if(row.status == '1'){
        this.$message.warning("投诉已处理完成,无法编辑!");
        return;
      }
      this.$resetForm("addForm", this.addModel);
      this.addDialog.title = "编辑投诉";
      this.$objCoppy(row, this.addModel);
      this.addDialog.visible = true;
      this.addModel.editType = "1";
    },

    async deleteBtn(row) {
      let parm = {
        complaintId: row.complaintId,
      };
      const confirm = await this.$myconfirm("确定删除该数据吗?");
      if (confirm) {
        let res = await deleteApi(parm);
        if (res && res.code == 200) {
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    //分页操作
    sizeChange(val) {
      this.parm.pageSize = val;
      this.getList();
    },

    currentChange(val) {
      this.parm.currentPage = val;
      this.getList();
    },

    //弹框事件
    onClose() {
      this.addDialog.visible = false;
    },

    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          this.addModel.userId = getUserId();
          // console.log(this.addModel.userId);
          if (this.addModel.editType == "0") {
            res = await addApi(this.addModel);
          } else {
            res = await editApi(this.addModel);
          }

          if (res && res.code == 200) {
            this.getList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },

    async getList() {
      this.parm.userId = getUserId();
      let res = await getMyListApi(this.parm);
      if (res && res.code == 200) {
        console.log(res);
        this.tableList = res.data.records;
        this.parm.total = res.data.total;
      }
    },
  },
};
</script>

<style>
</style>
