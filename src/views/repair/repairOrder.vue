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
        <el-form-item label="报修内容">
          <el-input v-model="parms.repairContent"></el-input>
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
        <el-table-column label="工单号" prop="dispatchNum"></el-table-column>
        <el-table-column label="报修内容" prop="repairContent"></el-table-column>
        <el-table-column label="报修地址" prop="repairAddress"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="报修时间" prop="commitTime"></el-table-column>
        <el-table-column label="派工人员" prop="operator"></el-table-column>
        <el-table-column label="派工时间" prop="dispatchTime"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="处理状态" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '2'" type="warning" size="small"
              >已完成</el-tag
            >
            <el-tag v-if="scope.row.status == '1'" size="small"
              >已处理</el-tag
            >
            <el-tag v-if="scope.row.status == '0'" type="danger" size="small"
              >未处理</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column width="100px" align="center" label="操作">
        <template slot-scope="scope">

          <el-button
            type="success"
            icon="el-icon-circle-check"
            size="small"
            v-if="scope.row.status == '0' && hasPerm('sys:repairOrder:do')"
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
        :current-page.sync="parms.currentPage"
        :page-sizes="[10, 20, 40, 80, 100]"
        :page-size="parms.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="parms.total"
        background
      >
      </el-pagination>
    </el-main>
  </template>

  <script>
  import {editApi} from "@/api/repair";
  import {getUserId} from "@/utils/auth";
  import SysDialog from "@/components/system/SysDialog.vue";
  import {getOrderListApi} from "@/api/repairOrder";

  export default {
    components: { SysDialog },
    data() {
      return {
        //表格数据
        tableList: [],

        sysUserList: [],

        tableHeight: 0,

        parms: {
          currentPage: 1,
          pageSize: 10,
          userId: "",
          repairContent: "",
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
      //搜索框
      searchBtn() {
        this.getList();
      },

      resetBtn() {
        this.parms.repairContent = "";
        this.getList();
      },

      async doBtn(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确定处理该报修吗?");
      if (confirm) {
        let parm = {
          repairId: row.orderSource,
          status: "2",
        };
        let res = await editApi(parm);
        if(res && res.code == 200){
          this.getList();
          this.$message.success("处理报修成功");
        }
      }
    },

      //分页操作
      sizeChange(val) {
        this.parms.pageSize = val;
        this.getList();
      },

      currentChange(val) {
        this.parms.currentPage = val;
        this.getList();
      },

      async getList() {
        this.parms.userId = getUserId();
        let res = await getOrderListApi(this.parms);
        console.log(res);
        if (res && res.code == 200) {
          this.tableList = res.data.records;
          this.parms.total = res.data.total;
        }
      },

    },
  };
  </script>

  <style>
  </style>
