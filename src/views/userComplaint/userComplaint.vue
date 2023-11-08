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
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:userComplaintList:delete')"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >

          <el-button
            type="success"
            icon="el-icon-circle-check"
            size="small"
            v-if="scope.row.status == '0' && hasPerm('sys:userComplaintList:do')"
            @click="doBtn(scope.row)"
            >处理</el-button
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
  </el-main>
</template>

<script>
import {deleteApi, editApi, getListApi} from "@/api/userComplaint";

export default {
  data() {
    return {
      //表格数据
      tableList: [],

      tableHeight: 0,

      parm: {
        currentPage: 1,
        pageSize: 10,
        title: "",
        complaintContent: "",
        total: 0,
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

    //表格操作
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

    async doBtn(row) {
      let parm = {
        complaintId: row.complaintId,
        status:'1',
      };
      const confirm = await this.$myconfirm("确定处理该投诉吗?");
      if (confirm) {
        let res = await editApi(parm);
        if (res && res.code == 200) {
          this.getList();
          this.$message.success("投诉处理成功");
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

    async getList() {
      let res = await getListApi(this.parm);
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
