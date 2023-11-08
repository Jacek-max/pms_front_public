<template>
  <el-main>
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

      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button
          icon="el-icon-plus"
          type="primary"
          v-if="hasPerm('sys:houseUnit:add')"
          @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="name" label="栋数名称"></el-table-column>
      <el-table-column prop="unitName" label="单元名称"></el-table-column>
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:houseUnit:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:houseUnit:delete')"
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

    <!-- 新增或编辑弹框 -->
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
          <el-form-item prop="buildId" label="所属栋数">
            <el-select v-model="addModel.buildId">
              <el-option
                v-for="item in buildTableList"
                :key="item.buildId"
                :label="item.name"
                :value="item.buildId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="unitName" label="单元名称">
            <el-input v-model="addModel.unitName"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getListApi, unitListApi,} from "@/api/houseUnit";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      //表单验证
      rules: {
        buildId: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属栋数",
          },
        ],
        unitName: [
          {
            trigger: "change",
            required: true,
            message: "请填写单元名称",
          },
        ],
      },
      //列表数据
      tableList: [],

      //栋数列表
      buildTableList: [],

      //表格高度
      tableHeight: 0,

      //弹框属性
      addDialog: {
        title: "",
        height: 150,
        width: 610,
        visible: false,
      },

      //新增编辑弹窗数据
      addModel: {
        editType: "",
        unitId: "",
        buildId: "",
        unitName: "",
      },

      parms: {
        buildName: "",
        unitName: "",
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },

  created() {
    this.getList();
    this.getBuildList();
  },

  mounted() {
    this.$nextTick(() => (this.tableHeight = window.innerHeight - 220));
  },

  methods: {
    //获取栋数列表
    async getBuildList() {
      let res = await unitListApi();
      if (res && res.code == 200) {
        this.buildTableList = res.data;
      }
    },
    //搜索部分
    searchBtn() {
      this.getList();
    },

    resetBtn() {
      this.parms.buildNme = "";
      this.parms.unitName = "";
      this.getList();
    },

    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增单元";
      this.addDialog.visible = true;
    },

    //表单操作
    editBtn(row) {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "1";
      this.addDialog.title = "编辑单元";
      this.addDialog.visible = true;
      this.$objCoppy(row, this.addModel);
    },

    async deleteBtn(row) {
      const confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deleteApi({ unitId: row.unitId });
        if (res && res == 200) {
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    //分页部分
    sizeChange(val) {
      //页容量
      this.parms.pageSize = val;
      this.getList();
    },

    currentChange(val) {
      //页数
      this.parms.currentPage = val;
      this.getList();
    },

    //弹框事件
    onClose() {
      //弹框关闭
      this.addDialog.visible = false;
    },

    onConfirm() {
      //弹框确认
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

    //获取列表
    async getList() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
      console.log(res);
    },
  },
};
</script>

<style>
</style>
