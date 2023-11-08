<template>
  <el-main>
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="payWaterMonth" label="缴费月份"></el-table-column>
      <el-table-column prop="waterrNum" label="表显"></el-table-column>
      <el-table-column prop="payWaterMoney" label="缴费金额"></el-table-column>
      <el-table-column prop="payWaterStatus" label="缴费状态">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.payWaterStatus == '0'"
            type="danger"
            size="small"
            >未缴费</el-tag
          >
          <el-tag
            v-if="scope.row.payWaterStatus == '1'"
            type="success"
            size="small"
            >已缴费</el-tag
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
import {getMyWaterFeeApi} from "@/api/myFeeList";
import {getUserId} from "@/utils/auth";

export default {
  data() {
    return {
      tableList: [],

      tableHeight: 0,

      parms: {
        currentPage: 1,
        pageSize: 10,
        userId: getUserId(),
        total: 0,
      },
    };
  },

  created() {
    this.getList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180;
    });
  },

  methods: {
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getList();
    },

    currentChange(val) {
      this.parms.currentPage = val;
      this.getList();
    },

    async getList() {
      let res = await getMyWaterFeeApi(this.parms);
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
