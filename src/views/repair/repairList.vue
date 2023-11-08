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
      <el-table-column label="工单号" prop="orderNum"></el-table-column>
      <el-table-column label="报修内容" prop="repairContent"></el-table-column>
      <el-table-column label="报修地址" prop="repairAddress"></el-table-column>
      <el-table-column label="联系方式" prop="phone"></el-table-column>
      <el-table-column label="维修人员" prop="dispatchName"></el-table-column>
      <el-table-column label="处理状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '3'" type="success" size="small"
            >已处理</el-tag
          >
          <el-tag v-if="scope.row.status == '2'" type="warning" size="small"
            >待确认</el-tag
          >
          <el-tag v-if="scope.row.status == '1'" size="small"
            >已派工</el-tag
          >
          <el-tag v-if="scope.row.status == '0'" type="danger" size="small"
            >未处理</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column width="270px" align="center" label="操作">
        <template slot-scope="scope">

          <el-button
            type="primary"
            icon="el-icon-position"
            size="small"
            v-if="(scope.row.status == '0' || scope.row.status == '1') && hasPerm('sys:repairList:dispatch')"
            @click="dispatchBtn(scope.row.repairId)"
            >派工</el-button
          >

          <el-button
            type="success"
            icon="el-icon-circle-check"
            size="small"
            v-if="scope.row.status == '1' && hasPerm('sys:repairList:do')"
            @click="doBtn(scope.row)"
            >处理</el-button
          >

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:myRepair:delete')"
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

    <!-- 派工单 -->
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
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
          <el-form-item prop="dispatchUserId" label="派工人员">
            <el-select v-model="addModel.dispatchUserId">
              <el-option
                v-for="item in sysUserList"
                :key="item.userId"
                :label="item.loginName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="remark" label="备注">
            <el-input v-model="addModel.remark" type="textarea" :rows="3" width:200px></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {deleteApi, dispatchApi, editApi, getList} from "@/api/repair";
import {getSysUserListApi} from "@/api/user";
import {getUserId} from "@/utils/auth";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      //表格数据
      tableList: [],

      sysUserList: [],

      tableHeight: 0,

      rules: {
        dispatchUserId: [
          {
            trigger: "change",
            required: true,
            message: "请选择派工人员",
          },
        ],
      },

      parms: {
        currentPage: 1,
        pageSize: 10,
        userId: "",
        repairContent: "",
        total: 0,
      },

      //弹框属性
      addDialog: {
        title: "",
        height: 200,
        width: 610,
        visible: false,
      },

      //新增编辑弹窗数据
      addModel: {
        dispatchUserId: "",
        remark:"",
        repairId:"",
        userId:"",
      },
    };
  },

  created() {
    this.getList();
    this.getSysUserList();
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

    //表格操作栏
    async deleteBtn(row) {
      const confirm = await this.$myconfirm("确定删除该数据吗?");
      if (confirm) {
        let res = await deleteApi({ repairId: row.repairId });
        if (res && res.code == 200) {
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    async doBtn(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确定处理该报修吗?");
      if (confirm) {
        let parm = {
          repairId: row.repairId,
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
      let res = await getList(this.parms);
      console.log(res);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },

    //弹框事件
    onClose() {
      this.addDialog.visible = false;
    },

    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          this.addModel.userId = getUserId();
          let res = await dispatchApi(this.addModel);
          if (res && res.code == 200) {
            this.getList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },

    //获取员工列表
    async getSysUserList(){
      let res = await getSysUserListApi();
      if(res && res.code == 200){
        this.sysUserList = res.data;
      }
    },

    dispatchBtn(repairId) {
      this.$resetForm("addForm", this.addModel);
      this.addDialog.title = "派工";
      this.addDialog.visible = true;
      this.addModel.repairId = repairId;
    },


  },
};
</script>

<style>
</style>
