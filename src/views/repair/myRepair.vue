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
        <el-button icon="el-icon-plus" type="primary" v-if="hasPerm('sys:myRepair:add')" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column label="工单号" prop="orderNum"></el-table-column>
      <el-table-column label="报修内容" prop="repairContent"></el-table-column>
      <el-table-column label="报修地址" prop="repairAddress"></el-table-column>
      <el-table-column label="联系方式" prop="phone"></el-table-column>
      <el-table-column label="派工单号" prop="dispatchNum"></el-table-column>
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
      <el-table-column width="200px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="scope.row.status == '0' && hasPerm('sys:myRepair:edit')"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >

          <el-button
            type="primary"
            icon="el-icon-circle-check"
            size="small"
            v-if="scope.row.status == '2' && hasPerm('sys:repairList:confirm')"
            @click="doOkBtn(scope.row)"
            >确认</el-button
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
          :inline="false"
          size="small"
        >
          <el-form-item prop="repairContent" label="维修内容">
            <el-input
              type="textarea"
              v-model="addModel.repairContent"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repairAddress" label="维修地点">
            <el-input v-model="addModel.repairAddress"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="联系电话">
            <el-input v-model="addModel.phone"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addApi, deleteApi, editApi, getMyListApi} from "@/api/repair";
import {getUserId} from "@/utils/auth";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      //表格数据
      tableList: [],

      tableHeight: 0,

      rules: {
        repairContent: [
          {
            trigger: "change",
            required: true,
            message: "请填写维修内容",
          },
        ],
        repairAddress: [
          {
            trigger: "change",
            required: true,
            message: "请填写维修地址",
          },
        ],
        phone: [
          {
            trigger: "change",
            required: true,
            message: "请填写联系电话",
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

      //表单数据域
      addModel: {
        repairId: "",
        userId: "",
        phone: "",
        repairAddress: "",
        repairContent: "",
        editType: "",
      },
    };
  },

  created() {
    this.getMyList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },

  methods: {
    //搜索框
    searchBtn() {
      this.getMyList();
    },

    resetBtn() {
      this.parms.repairContent = "";
      this.getMyList();
    },

    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增报修单";
      this.addDialog.visible = true;
    },

    //表格操作栏
    editBtn(row) {
      if (row.status == "3") {
        this.$message.warning("维修已处理完成,无法编辑!");
        return;
      }else if(row.status == "2"){
        this.$message.warning("维修员已处理，请确认");
        return;
      }else if(row.status == "1"){
        this.$message.warning("系统已派工，无法编辑");
      }
      this.$resetForm("addForm", this.addModel);
      this.$objCoppy(row, this.addModel);
      this.addDialog.title = "编辑报修单";
      this.addDialog.visible = true;
      this.addModel.editType = "1";
    },

    async deleteBtn(row) {
      if (row.status != "3") {
        this.$message.warning("维修单未完结，无法删除");
        return;
      }
      const confirm = await this.$myconfirm("确定删除该数据吗?");
      if (confirm) {
        let res = await deleteApi({ repairId: row.repairId });
        if (res && res.code == 200) {
          this.getMyList();
          this.$message.success(res.msg);
        }
      }
    },

    async doOkBtn(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确定报修已处理?");
      if (confirm) {
        let parm = {
          repairId: row.repairId,
          status: "3",
        };
        let res = await editApi(parm);
        if(res && res.code == 200){
          this.getMyList();
          this.$message.success("报修确认成功");
        }
      }
    },

    //分页操作
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getMyList();
    },

    currentChange(val) {
      this.parms.currentPage = val;
      this.getMyList();
    },

    //弹框事件
    onClose() {
      this.addDialog.visible = false;
    },

    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          this.addModel.userId = getUserId();
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addApi(this.addModel);
          } else {
            res = await editApi(this.addModel);
          }

          if (res && res.code == 200) {
            this.getMyList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },

    async getMyList() {
      this.parms.userId = getUserId();
      let res = await getMyListApi(this.parms);
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
