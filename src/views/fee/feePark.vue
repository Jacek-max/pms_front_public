<template>
  <el-main>
    <!-- 搜索区域 -->
    <el-form
      :model="parms"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="姓名">
        <el-input v-model="parms.userName"></el-input>
      </el-form-item>
      <el-form-item label="车位名称">
        <el-input v-model="parms.parkName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button type="primary" icon="el-icon-plus" v-if="hasPerm('sys:feePark:add')" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column label="姓名" prop="loginName"></el-table-column>
      <el-table-column label="联系方式" prop="phone"></el-table-column>
      <el-table-column label="车位" prop="parkName"></el-table-column>
      <el-table-column label="车位类型" prop="parkType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parkType == '0'" type="danger" size="small"
            >地上</el-tag
          >
          <el-tag v-if="scope.row.parkType == '1'" type="success" size="small"
            >地下</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="所属月份" prop="payParkMonth"></el-table-column>
      <el-table-column label="缴费金额" prop="payParkMoney"></el-table-column>
      <el-table-column label="缴费状态" prop="payParkStatus">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.payParkStatus == '0'"
            type="danger"
            size="small"
            >未缴费</el-tag
          >
          <el-tag
            v-if="scope.row.payParkStatus == '1'"
            type="success"
            size="small"
            >已缴费</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column width="260" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:feePark:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:feePark:delete')"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-money"
            size="small"
            v-if="scope.row.payParkStatus == '0' && hasPerm('sys:feePark:pay')"
            @click="payBtn(scope.row)"
            >缴费</el-button
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

    <!-- 新增弹框 -->
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
          :inline="true"
          size="small"
        >
          <el-form-item prop="parkId" label="车位">
            <el-select v-model="addModel.parkId" clearable filterable>
              <el-option
                v-for="item in parkList"
                :key="item.parkId"
                :label="item.parkName"
                :value="item.parkId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="payParkMonth" label="所属月份">
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              v-model="addModel.payParkMonth"
              type="month"
              placeholder="选择月份"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="payParkMoney" label="缴费金额">
            <el-input v-model="addModel.payParkMoney" size="small"></el-input>
          </el-form-item>

          <el-form-item
            prop="payParkStatus"
            style="margin-left: 15px"
            label="缴费状态"
          >
            <el-radio-group v-model="addModel.payParkStatus">
              <el-radio :label="'0'">未缴费</el-radio>
              <el-radio :label="'1'">已缴费</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getListApi, getListNoPageApi, payApi,} from "@/api/feePark";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      //表格数据
      tableList: [],

      parkList: [],

      tableHeight: 0,

      rules: {
        parkId: [
          {
            trigger: "change",
            required: true,
            message: "请选择车位",
          },
        ],

        payParkMonth: [
          {
            trigger: "change",
            required: true,
            message: "请选择缴费月份",
          },
        ],

        payParkMoney: [
          {
            trigger: "change",
            required: true,
            message: "请填写缴费金额",
          },
        ],

        payParkStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择缴费状态",
          },
        ],
      },

      //列表查询参数
      parms: {
        currentPage: 1,
        pageSize: 10,
        userName: "",
        parkName: "",
        total: 0,
      },

      //弹框属性设置
      addDialog: {
        title: "",
        width: 620,
        height: 180,
        visible: false,
      },

      //弹框绑定数据域
      addModel: {
        editType: "",
        parkId: "",
        parkFeeId: "",
        payParkMonth: "",
        payParkMoney: "",
        payParkStatus: "",
      },
    };
  },

  created() {
    this.getList();
    this.getListNoPage();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },

  methods: {
    // 搜索区域绑定事件
    searchBtn() {
      this.getList();
    },

    resetBtn() {
      this.parms.userName = "";
      this.parms.parkName = "";
      this.getList();
    },

    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增停车位缴费单";
      this.addDialog.visible = true;
    },

    //表格操作
    editBtn(row) {
      console.log(row);
      if(row.payParkStatus == '1'){
        this.$message.warning("缴费单已完成缴费，不能编辑！");
        return;
      }
      this.$resetForm("addForm", this.addModel);
      this.addDialog.title = "编辑停车位缴费单";
      this.addDialog.visible = true;
      this.$objCoppy(row, this.addModel);
      this.addModel.editType = "1";
    },

    async deleteBtn(row) {
      console.log(row);
      if(row.payParkStatus == '1'){
        this.$message.warning("缴费单已完成缴费，不能删除！");
        return;
      }
      let confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deleteApi({ parkFeeId: row.parkFeeId });
        if (res && res.code == 200) {
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    async payBtn(row) {
      let confirm = await this.$myconfirm("确定缴费吗？");
      if (confirm) {
        let res = await payApi({ parkFeeId: row.parkFeeId });
        if (res && res.code == 200) {
          this.getList();
          this.$message.success(res.msg);
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

    //弹框事件
    onClose() {
      this.addDialog.visible = false;
    },

    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
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

    //查询列表
    async getList() {
      let res = await getListApi(this.parms);
      console.log(res);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },

    //获取车辆列表
    async getListNoPage() {
      let res = await getListNoPageApi();
      if (res && res.code == 200) {
        console.log("车位列表");
        console.log(res);
        this.parkList = res.data;
      }
    },
  },
};
</script>

<style>
</style>
