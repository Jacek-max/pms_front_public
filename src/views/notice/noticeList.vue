<template>
  <el-main>
    <!-- 搜索框 -->
    <el-form
      :model="parms"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="公告标题">
        <el-input v-model="parms.title"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button icon="el-icon-plus" type="primary" v-if="hasPerm('sys:noticeList:add')" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column label="公告标题" prop="title"></el-table-column>
      <el-table-column label="公告内容" prop="noticeContent"></el-table-column>
      <el-table-column label="时间" prop="createTime"></el-table-column>
      <el-table-column width="300px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:noticeList:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >

          <el-button type="success" icon="el-icon-top" size="small" v-if="scope.row.isTop == '0' && hasPerm('sys:noticeList:top')" @click="isTopBtn(scope.row.noticeId)">置顶</el-button>
          <el-button type="warning" icon="el-icon-bottom" size="small" v-if="scope.row.isTop == '1' && hasPerm('sys:noticeList:top')" @click="isTopBtn(scope.row.noticeId)">取消置顶</el-button>

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:noticeList:delete')"
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
      :current-page.sync="parms.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="parms.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parms.total"
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
          <el-form-item prop="title" label="公告标题">
            <el-input v-model="addModel.title"></el-input>
          </el-form-item>
          <el-form-item prop="noticeContent" label="公告内容">
            <el-input
              type="textarea"
              v-model="addModel.noticeContent"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getListApi, isTopApi} from "@/api/notice";
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
            message: "请填写公告标题",
          },
        ],
        noticeContent: [
          {
            trigger: "change",
            required: true,
            message: "请填写公告内容",
          },
        ],
      },

      parms: {
        currentPage: 1,
        pageSize: 10,
        title: "",
        total: 0,
      },

      //设置弹框属性
      addDialog: {
        title: "",
        height: 180,
        width: 610,
        visible: false,
      },

      //弹框绑定数据域
      addModel: {
        noticeId: "",
        userId: "",
        title: "",
        noticeContent: "",
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
    //搜索
    searchBtn() {
      this.getList();
    },

    resetBtn() {
      this.parms.title = "";
      this.getList();
    },

    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增公告";
      this.addDialog.visible = true;
    },

    //操作
    editBtn(row) {
      this.$resetForm("addForm", this.addModel);
      this.$objCoppy(row, this.addModel);
      this.addModel.editType = "1";
      this.addDialog.title = "编辑公告";
      this.addDialog.visible = true;
    },

    async deleteBtn(row) {
      let confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deleteApi({ noticeId: row.noticeId });
        if (res && res.code == 200) {
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    async isTopBtn(noticeId){
        let res = await isTopApi({noticeId:noticeId});
        if(res && res.code == 200){
          this.getList();
          this.$message.success(res.msg);
        }
    },

    //分页事件
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getList();
    },

    currentChange(val) {
      this.parms.currentPage = val;
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
          if (this.addModel.editType == "0") {
            res = await addApi(this.addModel);
          } else {
            res = await editApi(this.addModel);
          }

          if (res && res.code) {
            this.getList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },

    async getList() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        console.log(res);
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style>
</style>
