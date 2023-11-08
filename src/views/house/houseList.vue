<template>
  <el-main>
    <!-- 搜索部分 -->
    <el-form
      :model="parms"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="栋数名称">
        <el-input
          placeholder="请输入栋数名称"
          v-model="parms.buildName"
        ></el-input>
      </el-form-item>

      <el-form-item label="单元名称">
        <el-input
          placeholder="请输入单元名称"
          v-model="parms.unitName"
        ></el-input>
      </el-form-item>

      <el-form-item label="房屋编号">
        <el-input
          placeholder="请输入房屋编号"
          v-model="parms.houseNum"
        ></el-input>
      </el-form-item>

      <el-form-item label="使用状态">
        <el-select placeholder="请选择使用状态" v-model="parms.status">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-if="hasPerm('sys:houseList:add')"
          @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="name" label="栋数名称"></el-table-column>
      <el-table-column prop="unitName" label="单元名称"></el-table-column>
      <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
      <el-table-column prop="houseArea" label="使用面积"></el-table-column>
      <el-table-column prop="status" label="使用状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="danger" size="small"
            >未使用</el-tag
          >
          <el-tag v-if="scope.row.status == '1'" type="success" size="small"
            >已使用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            v-if="hasPerm('sys:houseList:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            v-if="hasPerm('sys:houseList:delete')"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页部分 -->
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
          <el-form-item prop="buildvalue" label="所属栋数">
            <el-select v-model="addModel.buildvalue" @change="selectBuild">
              <el-option
                v-for="item in buildList"
                :key="item.buildId"
                :label="item.name"
                :value="item.buildId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="unitId" label="所属单元">
            <el-select v-model="addModel.unitId">
              <el-option
                v-for="item in unitList"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="houseNum" label="房屋编号">
            <el-input
              v-model="addModel.houseNum"
              placeholder="请输入房屋编号"
              size="small"
            ></el-input>
          </el-form-item>

          <el-form-item
            style="margin-left: 15px"
            prop="houseArea"
            label="使用面积"
          >
            <el-input
              v-model="addModel.houseArea"
              placeholder="请输入使用面积"
              size="small"
            ></el-input>
          </el-form-item>

          <el-form-item label="使用状态" prop="status" size="small">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'0'">未使用</el-radio>
              <el-radio :label="'1'">已使用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getBuildApi, getListApi, getUnitListByIdApi,} from "@/api/houseList";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },

  data() {
    return {
      rules: {
        buildvalue: [
          {
            trigger: "change",
            required: "true",
            message: "请选择所属栋数",
          },
        ],
        unitId: [
          {
            trigger: "change",
            required: "true",
            message: "请选择所属单元",
          },
        ],
        houseNum: [
          {
            trigger: "change",
            required: "true",
            message: "请填写房屋编号",
          },
        ],
        houseArea: [
          {
            trigger: "change",
            required: "true",
            message: "请填写使用面积",
          },
        ],
        status: [
          {
            trigger: "change",
            required: "true",
            message: "请选择使用状态",
          },
        ],
      },

      //表格数据
      tableList: [],

      tableHeight: 0,

      //栋数列表
      buildList: [],

      //单元列表
      unitList: [],

      //弹框属性
      addDialog: {
        title: "",
        height: 200,
        width: 610,
        visible: false,
      },

      //新增弹窗内数据
      addModel: {
        editType: "",
        houseId: "",
        unitId: "",
        houseNum: "",
        houseArea: "",
        status: "",
        buildvalue: "",
      },

      //使用状态
      options: [
        {
          value: "0",
          label: "未使用",
        },
        {
          value: "1",
          label: "已使用",
        },
      ],

      parms: {
        buildName: "",
        status: "",
        unitName: "",
        houseNum: "",
        currentPage: 1,
        pageSize: 10,
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
      this.tableHeight = window.innerHeight - 270;
    });
  },

  methods: {
    //选择栋数触发事件
    selectBuild(val) {
      this.addModel.unitId = "";
      //根据栋数Id查询单元
      this.getUnitListById(val);
      console.log(val);
    },
    // 搜索栏部分
    searchBtn() {
      this.getList();
    },

    resetBtn() {
      this.parms.buildName = "";
      this.parms.unitName = "";
      this.parms.status = "";
      this.parms.houseNum = "";
      this.parms.currentPage = 1;
      this.getList();
    },
    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增房屋";
      this.addDialog.visible = true;
    },

    //操作栏部分
    editBtn(row) {
      //根据栋数Id查询单元列表
      this.getUnitListById(row.buildId);
      this.$resetForm("addForm", this.addModel);
      this.addDialog.title = "编辑房屋";
      this.addDialog.visible = true;
      this.$objCoppy(row, this.addModel);
      this.addModel.editType = "1";
      console.log(row);
      //栋数回显
      this.addModel.buildvalue = row.name;
    },

    async deleteBtn(row) {
      const confirm = await this.$myconfirm("确认删除该数据吗？");
      if (confirm) {
        let res = await deleteApi({ houseId: row.houseId });
        if (res && res.code == 200) {
          this.getList();
          this.$message.success(row.msg);
        }
      }
    },

    //分页部分
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getList();
    },

    currentChange(val) {
      this.parms.currentPage = val;
      this.getList();
    },

    //弹框按钮事件
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

    async getList() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        console.log(res);
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },

    async getBuildList() {
      let res = await getBuildApi();
      console.log("返回栋数");
      console.log(res);
      if (res && res.code == 200) {
        this.buildList = res.data;
      }
    },

    async getUnitListById(buildId) {
      let res = await getUnitListByIdApi({ buildId: buildId });
      console.log(res);
      if (res && res.code == 200) {
        this.unitList = res.data;
      }
    },
  },
};
</script>

<style>
</style>
