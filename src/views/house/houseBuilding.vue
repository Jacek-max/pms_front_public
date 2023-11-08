<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form
      :model="parm"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="栋数名称">
        <el-input placeholder="请输入栋数名称" v-model="parm.name"></el-input>
      </el-form-item>
      <el-form-item label="栋数类型">
        <el-select
          v-model="parm.type"
          placeholder="请选择栋数类型"
          clearable
          filterable
        >
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
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button
          style="color: #ff7670"
          icon="el-icon-close"
          @click="cancelBtn"
          >重置</el-button
        >
        <el-button
          icon="el-icon-plus"
          type="primary"
          v-if="hasPerm('sys:houseBuilding:add')"
          @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格列表 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="name" label="栋数名称"></el-table-column>
      <el-table-column prop="orderNum" label="序号"></el-table-column>
      <el-table-column prop="type" label="栋数类型">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.type == '0'" size="small"
            >普通房</el-tag
          >
          <el-tag type="danger" v-if="scope.row.type == '1'" size="small"
            >电梯房</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            v-if="hasPerm('sys:houseBuilding:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            v-if="hasPerm('sys:houseBuilding:delete')"
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
      :current-page.sync="parm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="parm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parm.total"
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
          ref="addRef"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item label="栋数名称" prop="name">
            <el-input v-model="addModel.name"></el-input>
          </el-form-item>

          <el-form-item label="栋数类型" prop="type">
            <el-select v-model="addModel.type">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="栋数序号">
            <el-input type="number" v-model="addModel.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getListApi} from "@/api/building";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      rules: {
        name: [
          {
            trigger: "change",
            required: true,
            message: "请填写栋数名称",
          },
        ],
        type: [
          {
            trigger: "change",
            required: true,
            message: "请选择栋数类型",
          },
        ],
      },
      tableHeight: 0,
      tableList: [],

      //   新增弹窗
      addDialog: {
        title: "",
        height: 200,
        width: 610,
        visible: false,
      },

      //新增编辑表单数据域
      addModel: {
        buildId: "",
        editType: "",
        type: "",
        name: "",
        orderNum: "",
      },

      options: [
        {
          value: "0",
          label: "普通房",
        },
        {
          value: "1",
          label: "电梯房",
        },
      ],
      parm: {
        name: "",
        type: "",
        pageSize: 10,
        currentPage: 1,
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
    //   分页部分
    sizeChange(val) {},

    currentChange(val) {},

    // 弹窗按钮
    onClose() {
      this.addDialog.visible = false;
    },

    onConfirm() {
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addApi(this.addModel);
          } else {
            res = await editApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.addDialog.visible = false;
            this.getList();
            this.$message.success(res.msg);
          }
        }
      });
    },

    //操作部分
    editBtn(row) {
      this.$resetForm("addRef", this.addModel);
      this.addModel.editType = "1";
      this.addDialog.title = "编辑栋数";
      this.addDialog.visible = true;
      this.$objCoppy(row, this.addModel);
    },

    async deleteBtn(row) {
      const confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deleteApi({ buildId: row.buildId });
        if (res && res.code == 200) {
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    searchBtn() {
      console.log(this.parm);
      this.getList();
    },

    cancelBtn() {
      this.parm.name = "";
      this.parm.type = "";
      this.getList();
    },

    // 新增按钮
    addBtn() {
      this.$resetForm("addRef", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增栋数";
      this.addDialog.visible = true;
    },

    async getList() {
      let res = await getListApi(this.parm);
      console.log(res);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parm.total = res.data.total;
      }
    },
  },
};
</script>

<style>
</style>
