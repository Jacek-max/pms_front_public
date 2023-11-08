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
      <el-form-item label="车位名称">
        <el-input
          placeholder="请输入车位名称"
          v-model="parms.parkName"
        ></el-input>
      </el-form-item>

      <el-form-item label="车位类型">
        <el-select placeholder="请选择车位类型" v-model="parms.parkType">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="使用状态">
        <el-select placeholder="请选择使用状态" v-model="parms.parkStatus">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button
          icon="el-icon-plus"
          type="primary"
          v-if="hasPerm('sys:parkList:add')"
          @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格列表 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="parkName" label="车位名称"></el-table-column>
      <el-table-column prop="parkType" label="车位类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parkType == '0'" type="danger" size="small"
            >地上</el-tag
          >
          <el-tag v-if="scope.row.parkType == '1'" type="success" size="small"
            >地下</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="parkStatus" label="使用状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parkStatus == '0'" type="danger" size="small"
            >未使用</el-tag
          >
          <el-tag v-if="scope.row.parkStatus == '1'" type="success" size="small"
            >已使用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="parkNum" label="车位序号"></el-table-column>

      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:parkList:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:parkList:delete')"
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

    <!-- 新增编辑弹框 -->
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
          <el-form-item prop="parkName" label="车位名称">
            <el-input v-model="addModel.parkName"></el-input>
          </el-form-item>

          <el-form-item prop="parkType" label="车位类型">
            <el-select v-model="addModel.parkType">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="parkStatus" label="使用状态">
            <el-select v-model="addModel.parkStatus">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="车位序号">
            <el-input v-model="addModel.parkNum"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getListApi} from "@/api/parkList";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      //表单验证
      rules: {
        parkName: [
          {
            trigger: "change",
            required: true,
            message: "请填写车位名称",
          },
        ],
        parkType: [
          {
            trigger: "change",
            required: true,
            message: "请选择车位类型",
          },
        ],
        parkStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择使用状态",
          },
        ],
      },

      //表格数据
      tableList: [],

      tableHeight: 0,

      //添加数据的表单
      addModel: {
        editType: "",
        parkId: "",
        parkName: "",
        parkType: "",
        parkStatus: "",
        parkNum: "",
      },

      //弹框属性
      addDialog: {
        title: "",
        height: 150,
        width: 610,
        visible: false,
      },

      parms: {
        currentPage: 1,
        pageSize: 10,
        parkName: "",
        parkStatus: "",
        parkType: "",
        total: 0,
      },

      typeOptions: [
        {
          value: "0",
          label: "地上",
        },
        {
          value: "1",
          label: "地下",
        },
      ],

      statusOptions: [
        {
          value: "0",
          label: "未使用",
        },
        {
          value: "1",
          label: "已使用",
        },
      ],
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
    // 搜索区域
    searchBtn() {
      this.getList();
    },
    resetBtn() {
      this.parms.parkName = "";
      this.parms.parkStatus = "";
      this.parms.parkType = "";
      this.getList();
    },
    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增车位";
      this.addDialog.visible = true;
    },

    //操作栏
    editBtn(row) {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "1";
      this.addDialog.title = "编辑车位";
      this.addDialog.visible = true;
      this.$objCoppy(row, this.addModel);
    },
    async deleteBtn(row) {
      const confirm = await this.$myconfirm("确定删除该数据吗？");
      if (confirm) {
        let res = await deleteApi({ parkId: row.parkId });
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          this.getList();
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

    //弹框事件
    onClose() {
      //关闭
      this.addDialog.visible = false;
    },

    onConfirm() {
      //确认
      this.$refs.addForm.validate(async (valid) => {
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

    async getList() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        console.log(res);
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style>
</style>
