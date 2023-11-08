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
      <el-form-item label="姓名">
        <el-input v-model="parms.userName"></el-input>
      </el-form-item>
      <el-form-item label="房屋编号">
        <el-input v-model="parms.houseNum"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button icon="el-icon-plus" type="primary" v-if="hasPerm('sys:feePower:add')" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="powerList" :height="tableHeight" border stripe>
      <el-table-column prop="loginName" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <el-table-column prop="name" label="栋数"></el-table-column>
      <el-table-column prop="unitName" label="单元"></el-table-column>
      <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
      <el-table-column prop="payPowerMonth" label="所属月份"></el-table-column>
      <el-table-column prop="powerNum" label="表显"></el-table-column>
      <el-table-column prop="payPowerMoney" label="缴费金额"></el-table-column>
      <el-table-column prop="payPowerStatus" label="缴费状态">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.payPowerStatus == '0'"
            type="danger"
            size="small"
            >未缴费</el-tag
          >
          <el-tag
            v-if="scope.row.payPowerStatus == '1'"
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
            v-if="hasPerm('sys:feePower:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:feePower:delete')"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-money"
            size="small"
            v-if="scope.row.payPowerStatus == '0' && hasPerm('sys:feePower:pay')"
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
          :inline="true"
          size="small"
        >
          <el-form-item prop="buildId" label="栋数">
            <el-select v-model="addModel.buildId" @change="selectBuild">
              <el-option
                v-for="item in buildList"
                :key="item.buildId"
                :label="item.name"
                :value="item.buildId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="unitId" label="单元">
            <el-select v-model="addModel.unitId" @change="selectUnit">
              <el-option
                v-for="item in unitList"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="houseId" label="房屋编号">
            <el-select v-model="addModel.houseId">
              <el-option
                v-for="item in houseList"
                :key="item.houseId"
                :label="item.houseNum"
                :value="item.houseId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="payPowerMonth" label="所属月份">
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              v-model="addModel.payPowerMonth"
              type="month"
              placeholder="选择月份"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="payPowerMoney" label="缴费金额">
            <el-input v-model="addModel.payPowerMoney" size="small"></el-input>
          </el-form-item>

          <el-form-item style="margin-left: 15px" prop="powerNum" label="表显">
            <el-input v-model="addModel.powerNum" size="small"></el-input>
          </el-form-item>

          <el-form-item prop="payPowerStatus" label="缴费状态">
            <el-radio-group v-model="addModel.payPowerStatus">
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
import SysDialog from "@/components/system/SysDialog.vue";
import {getBuildApi, getUnitListByIdApi} from "@/api/houseList";
import {addPowerApi, deletePowerApi, editPowerApi, getHouseByUnitIdApi, getListApi, payPowerApi,} from "@/api/feePower";

export default {
  components: { SysDialog },
  data() {
    return {
      buildList: [],

      unitList: [],

      houseList: [],

      powerList: [],

      tableHeight: 0,

      rules: {
        buildId: [
          {
            trigger: "change",
            required: true,
            message: "请选择栋数",
          },
        ],
        unitId: [
          {
            trigger: "change",
            required: true,
            message: "请选择单元",
          },
        ],
        houseId: [
          {
            trigger: "change",
            required: true,
            message: "请选择房屋编号",
          },
        ],
        payPowerMonth: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属月份",
          },
        ],
        payPowerMoney: [
          {
            trigger: "change",
            required: true,
            message: "请填写缴费金额",
          },
        ],
        powerNum: [
          {
            trigger: "change",
            required: true,
            message: "请填写表显",
          },
        ],
        payPowerStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择缴费状态",
          },
        ],
      },

      //搜索参数
      parms: {
        userName: "",
        houseNum: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },

      //弹框属性
      addDialog: {
        title: "",
        width: 620,
        height: 240,
        visible: false,
      },

      //弹窗数据域
      addModel: {
        houseId: "",
        unitId: "",
        buildId: "",
        editType: "",
        powerId: "",
        payPowerMonth: "",
        payPowerMoney: "",
        powerNum: "",
        payPowerStatus: "",
      },
    };
  },

  created() {
    this.getBuildList();
    this.getList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },

  methods: {
    //搜索区域
    searchBtn() {
      this.getList();
    },
    resetBtn() {
      (this.parms.userName = ""), (this.parms.houseNum = ""), this.getList();
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

    //表格操作
    editBtn(row) {
      if(row.payPowerStatus == '1'){
        this.$message.warning("缴费单已完成缴费，不能编辑！");
        return;
      }
      this.getUnitList(row.buildId);
      //查询房屋列表
      this.getHouseByUnitId(row.unitId);
      console.log(row);
      this.$resetForm("addForm", this.addModel);
      this.addDialog.title = "编辑电费缴费单";
      this.addDialog.visible = true;
      this.$objCoppy(row, this.addModel);
      this.addModel.editType = "1";
    },

    async deleteBtn(row) {
      console.log(row);
      if(row.payPowerStatus == '1'){
        this.$message.warning("缴费单已完成缴费，不能删除！");
        return;
      }
      const confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deletePowerApi({ powerId: row.powerId });
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          this.getList();
        }
      }
    },

    async payBtn(row) {
      const confirm = await this.$myconfirm("确定缴费吗？");
      if (confirm) {
        let parm = {
          powerId: row.powerId,
          payPowerStatus: "1",
        };
        let res = await payPowerApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          this.getList();
        }
      }
    },

    //弹框button事件
    onClose() {
      this.addDialog.visible = false;
    },
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addPowerApi(this.addModel);
          } else {
            res = await editPowerApi(this.addModel);
          }

          if (res && res.code == 200) {
            this.getList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },

    //栋数选择
    selectBuild(val) {
      console.log(val);
      this.addModel.unitId = "";
      this.addModel.houseId = "";
      this.getUnitList(val);
    },

    //单元选择事件
    selectUnit(val) {
      this.addModel.houseId = '';
      console.log(val);
      this.getHouseByUnitId(val);
    },

    //搜索区操作事件
    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增电费缴费单";
      this.addDialog.visible = true;
    },

    //获取栋数、单元
    async getBuildList() {
      let res = await getBuildApi();
      console.log(res);
      this.buildList = res.data;
    },

     //根据栋数id获取单元列表
    async getUnitList(buildId) {
      let res = await getUnitListByIdApi({ buildId: buildId });
      console.log(res);
      if (res && res.data) {
        this.unitList = res.data;
      }
    },
    //根据单元id获取房屋列表
    async getHouseByUnitId(val) {
      let res = await getHouseByUnitIdApi({ unitId: val });
      if (res && res.code == 200) {
        console.log(res);
        this.houseList = res.data;
      }
    },

    async getList() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        // console.log("列表");
        // console.log(res);
        this.powerList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style>
</style>
