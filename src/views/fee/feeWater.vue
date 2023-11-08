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
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button icon="el-icon-plus" type="primary" v-if="hasPerm('sys:feeWater:add')" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="loginName" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <el-table-column prop="name" label="栋数"></el-table-column>
      <el-table-column prop="unitName" label="单元"></el-table-column>
      <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
      <el-table-column prop="payWaterMonth" label="所属月份"></el-table-column>
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

      <el-table-column width="260" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:feeWater:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:feeWater:delete')"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-money"
            size="small"
            v-if="scope.row.payWaterStatus == '0' && ('sys:feeWater:pay')"
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
            <el-select v-model="addModel.unitId" @change="unitSelect">
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

          <el-form-item prop="payWaterMonth" label="所属月份">
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              v-model="addModel.payWaterMonth"
              type="month"
              placeholder="选择月份"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="payWaterMoney" label="缴费金额">
            <el-input v-model="addModel.payWaterMoney" size="small"></el-input>
          </el-form-item>

          <el-form-item style="margin-left: 15px" prop="waterrNum" label="表显">
            <el-input v-model="addModel.waterrNum" size="small"></el-input>
          </el-form-item>

          <el-form-item prop="payWaterStatus" label="缴费状态">
            <el-radio-group v-model="addModel.payWaterStatus">
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
import {getBuildApi, getUnitListByIdApi} from "@/api/houseList";
import {addApi, deleteApi, editApi, getHouseByUnitIdApi, getListApi, payApi} from "@/api/feeWater";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      //表格参数
      tableList: [],

      tableHeight: 0,

      //栋数列表
      buildList: [],

      //单元列表
      unitList: [],

      //房屋列表
      houseList: [],

      //表单验证规则
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
        payWaterMonth: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属月份",
          },
        ],
        payWaterMoney: [
          {
            trigger: "change",
            required: true,
            message: "请填写缴费金额",
          },
        ],
        waterrNum: [
          {
            trigger: "change",
            required: true,
            message: "请填写表显",
          },
        ],
        payWaterStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择缴费状态",
          },
        ],
      },

      //弹窗属性
      addDialog: {
        title: "",
        height: 240,
        width: 620,
        visible: false,
      },

      //新增弹框数据域
      addModel: {
        houseId: "",
        unitId: "",
        buildId: "",
        editType: "",
        waterId: "",
        payWaterMonth: "",
        payWaterMoney: "",
        waterrNum: "",
        payWaterStatus: "",
      },

      parms: {
        currentPage: 1,
        pageSize: 10,
        userName: "",
        houseNum: "",
        total: 0,
      },
    };
  },

  created() {
    this.getList();
    this.getBuildList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },

  methods: {
    //搜索框按钮事件
    searchBtn() {
      this.getList();
    },

    resetBtn() {
      this.parms.userName = '';
      this.parms.houseNum = '';
      this.getList();
    },

    addBtn() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增水费缴费单";
      this.addDialog.visible = true;
    },

    //表格操作栏事件
    editBtn(row) {
      console.log(row);
      if(row.payWaterStatus == '1'){
        this.$message.warning("缴费单已完成缴费，不能编辑！");
        return;
      }
      this.getUnitListById(row.buildId);
      this.getHouseByUnitId(row.unitId);
      this.$resetForm("addForm", this.addModel);
      this.addDialog.title = '编辑水费缴费单';
      this.addDialog.visible = true;
      //把编辑的数据复制到addmodel中
      this.$objCoppy(row,this.addModel);
      this.addModel.editType = "1";
    },

    async deleteBtn(row) {
      console.log(row);
      if(row.payWaterStatus == '1'){
        this.$message.warning("缴费单已完成缴费，不能删除！");
        return;
      }
      let confirm = await this.$myconfirm("确定删除该数据吗？");
      if(confirm){
        let res = await deleteApi({waterId:row.waterId});
        if(res && res.code == 200){
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    async payBtn(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确定缴费吗？");
      if(confirm){
        let res = await payApi({waterId:row.waterId});
        if(res && res.code == 200){
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    //分页
    sizeChange(val) {
      this.parms.pageSize = val;
    },

    currentChange(val) {
      this.parms.currentPage = val;
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
          }else{
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

    //获取表格列表
    async getList() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        console.log(res);
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },

    //获取栋数、单元列表
    async getBuildList() {
      let res = await getBuildApi();
      if (res && res.code == 200) {
        this.buildList = res.data;
      }
    },

    //根据栋数Id查询单元列表
    async getUnitListById(val) {
      let res = await getUnitListByIdApi({ buildId: val });
      // console.log("单元");
      // console.log(res);
      if (res && res.code == 200) {
        this.unitList = res.data;
      }
    },

    //栋数点击事件
    selectBuild(val) {
      this.addModel.unitId = "";
      this.addModel.houseId = "";
      console.log(val);
      this.getUnitListById(val);
    },

    //单元Id查询房屋列表
    async getHouseByUnitId(val) {
      let res = await getHouseByUnitIdApi({ unitId: val });
      // console.log("房屋");
      // console.log(res);
      if (res && res.code == 200) {
        this.houseList = res.data;
      }
    },

    //单元点击事件
    async unitSelect(val) {
      this.addModel.houseId = "";
      this.getHouseByUnitId(val);
    },
  },
};
</script>

<style>
</style>
