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
        <el-input v-model="parms.loginName"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="parms.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn"
          >重置</el-button
        >
        <el-button type="primary" icon="el-icon-plus" v-if="hasPerm('sys:liveUser:add')" @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 数据表 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="loginName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex == '0'" type="success" size="normal"
            >男</el-tag
          >
          <el-tag v-if="scope.row.sex == '1'" type="danger" size="normal"
            >女</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        width="127px"
        label="联系方式"
      ></el-table-column>
      <el-table-column prop="name" label="栋数"></el-table-column>
      <el-table-column prop="unitName" label="单元"></el-table-column>
      <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
      <el-table-column prop="houseArea" label="使用面积"></el-table-column>
      <el-table-column prop="parkName" label="车位"></el-table-column>
      <el-table-column width="470" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" v-if="hasPerm('sys:liveUser:edit')" @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button type="primary" size="small" v-if="hasPerm('sys:liveUser:assignHome')" @click="assignHouse(scope.row)"
            >分配房屋</el-button
          >
          <el-button type="success" size="small" v-if="hasPerm('sys:liveUser:assignCar')" @click="assignPark(scope.row)"
            >分配车位</el-button
          >
          <el-button type="danger" size="small" v-if="hasPerm('sys:liveUser:returnHome')" @click="leaveHouse(scope.row)"
            >退房</el-button
          >
          <el-button type="warning" size="small" v-if="hasPerm('sys:liveUser:returnCar')" @click="leavePark(scope.row)"
            >退车位</el-button
          >
          <el-button type="danger" size="small" v-if="hasPerm('sys:liveUser:delete')" @click="deleteBtn(scope.row)"
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
          <el-form-item prop="loginName" label="姓名">
            <el-input v-model="addModel.loginName"></el-input>
          </el-form-item>

          <el-form-item prop="sex" label="性别">
            <el-radio-group v-model="addModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="phone" label="联系方式">
            <el-input v-model="addModel.phone"></el-input>
          </el-form-item>

          <el-form-item prop="roleId" label="角色">
            <el-select v-model="addModel.roleId">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="username" label="账号">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>

          <el-form-item
            v-if="addModel.editType != 1"
            prop="password"
            label="密码"
          >
            <el-input type="password" v-model="addModel.password"></el-input>
          </el-form-item>

          <el-form-item prop="status" label="状态">
            <el-radio-group v-model="addModel.status">
              <el-radio :label="'0'">启用</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </sys-dialog>

    <!-- 分配房屋 -->
    <sys-dialog
      :title="assignHouseDialog.title"
      :height="assignHouseDialog.height"
      :width="assignHouseDialog.width"
      :visible="assignHouseDialog.visible"
      @onClose="assignHouseClose"
      @onConfirm="assignHouseConfirm"
    >
      <template slot="content">
        <el-main style="padding: 0px">
          <!-- 搜索区域 -->
          <el-form
            :model="houseParms"
            ref="assignHoseForm"
            label-width="70px"
            :inline="true"
            size="small"
          >
            <el-form-item label="栋数名称">
              <el-input
                placeholder="请输入栋数名称"
                v-model="houseParms.buildName"
              ></el-input>
            </el-form-item>

            <el-form-item label="单元名称">
              <el-input
                placeholder="请输入单元名称"
                v-model="houseParms.unitName"
              ></el-input>
            </el-form-item>

            <el-form-item label="房屋编号">
              <el-input
                placeholder="请输入房屋编号"
                v-model="houseParms.houseNum"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                icon="el-icon-search"
                size="small"
                @click="assignHouseSearchBtn"
                >搜索</el-button
              >
              <el-button
                icon="el-icon-close"
                size="small"
                @click="assignHouseResetBtn"
                >重置</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 表格 -->
          <el-table :data="houseList" :height="assignTableHeight" border stripe>
            <el-table-column width="50" align="center" label="选择">
              <template slot-scope="scope">
                <el-radio
                  v-model="assignHouseParm.houseId"
                  :label="scope.row.houseId"
                  @change="getCurrentRow(scope.row)"
                >
                  {{ "" }}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="栋数名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="unitName"
              label="单元名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="houseNum"
              label="房屋编号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="houseArea"
              label="使用面积"
            ></el-table-column>
            <el-table-column align="center" prop="status" label="分配状态">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.status == '0'"
                  type="danger"
                  size="small"
                  >未分配</el-tag
                >
                <el-tag
                  v-if="scope.row.status == '1'"
                  type="success"
                  size="small"
                  >已分配</el-tag
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            @size-change="assignHouseSizeChange"
            @current-change="assignHouseCurrentChange"
            :current-page.sync="houseParms.currentPage"
            :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="houseParms.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="houseParms.total"
            background
          >
          </el-pagination>
        </el-main>
      </template>
    </sys-dialog>

    <!-- 分配车位 -->
    <sys-dialog
      :title="parkDialog.title"
      :width="parkDialog.width"
      :height="parkDialog.height"
      :visible="parkDialog.visible"
      @onClose="parkOnClose"
      @onConfirm="parkOnConfirm"
    >
      <template slot="content">
        <el-main style="padding: 0px">
          <!-- 搜索区域 -->
          <el-form
            :model="parkParms"
            label-width="80px"
            :inline="true"
            size="small"
          >
            <el-form-item label="车位名称">
              <el-input
                placeholder="请输入车位名称"
                v-model="parkParms.parkName"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="parkSearchBtn"
                >查询</el-button
              >
              <el-button
                icon="el-icon-close"
                style="color: #ff7670"
                @click="parkResetBtn"
                >重置</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 表格 -->
          <el-table
            :data="parkList"
            :height="parkListTableHeight"
            border
            stripe
          >
            <el-table-column width="50" align="center" label="选择">
              <template slot-scope="scope">
                <el-radio
                  v-model="assignParkParm.parkId"
                  :label="scope.row.parkId"
                  @change="getAssignParkId(scope.row)"
                >
                  {{ "" }}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop="parkName"
              align="center"
              label="车位名称"
            ></el-table-column>
            <el-table-column prop="parkType" align="center" label="车位类型">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.parkType == '0'"
                  type="danger"
                  size="small"
                  >地上</el-tag
                >
                <el-tag
                  v-if="scope.row.parkType == '1'"
                  type="success"
                  size="small"
                  >地下</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="parkStatus" align="center" label="使用状态">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.parkStatus == '0'"
                  type="danger"
                  size="small"
                  >未使用</el-tag
                >
                <el-tag
                  v-if="scope.row.parkStatus == '1'"
                  type="success"
                  size="small"
                  >已使用</el-tag
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页部分 -->
          <el-pagination
            @size-change="assignParkSizeChange"
            @current-change="assignParkCurrentChange"
            :current-page.sync="parkParms.currentPage"
            :page-sizes="[10, 20, 40, 80, 100]"
            :page-size="parkParms.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="parkParms.total"
            background
          >
          </el-pagination>
        </el-main>
      </template>
    </sys-dialog>
  </el-main>
</template>

<script>
import {
  addApi,
  assignParkSavaApi,
  assignSavaApi,
  deleteApi,
  editApi,
  getHouseListApi,
  getListApi,
  getParkListApi,
  getRoleListApi,
  getUserById,
  returnHouseApi,
  returnParkApi
} from "@/api/liveUser";

import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: { SysDialog },
  data() {
    return {
      rules: {
        loginName: [
          {
            trigger: "change",
            required: true,
            message: "请填写姓名",
          },
        ],
        sex: [
          {
            trigger: "change",
            required: true,
            message: "请选择性别",
          },
        ],
        phone: [
          {
            trigger: "change",
            required: true,
            message: "请填写联系方式",
          },
          {
            pattern:/^1[3|5|7|8|9]\d{9}$/,
            message:"请输入正确的手机号信息",
            trigger:"change"
          }
        ],
        username: [
          {
            trigger: "change",
            required: true,
            message: "请填写账号",
          },
        ],
        password: [
          {
            trigger: "change",
            required: true,
            message: "请填写密码",
          },
        ],
        status: [
          {
            trigger: "change",
            required: true,
            message: "请选择用户状态",
          },
        ],
        roleId: [
          {
            trigger: "change",
            required: true,
            message: "请选择用户角色",
          },
        ],
      },

      //角色列表
      roleList: [],

      //业主列表
      tableList: [],

      //房屋列表
      houseList: [],

      //车位列表
      parkList: [],

      tableHeight: 0,

      assignTableHeight: 0,

      parkListTableHeight: 0,

      //获取房屋列表
      houseParms: {
        buildName: "",
        status: "0",
        unitName: "",
        houseNum: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },

      assignHouseParm: {
        houseId: "",
        userId: "",
      },

      //分配房屋弹框
      assignHouseDialog: {
        title: "",
        height: 400,
        width: 980,
        visible: false,
      },

      //弹框参数
      addDialog: {
        title: "",
        height: 220,
        width: 610,
        visible: false,
      },

      //车位查询参数列表
      parkParms: {
        currentPage: 1,
        pageSize: 10,
        parkName: "",
        parkStatus: "0",
        parkType: "",
        total: 0,
      },

      //车位数据域
      assignParkParm: {
        parkId: "",
        userId: "",
      },

      // 车位弹框属性
      parkDialog: {
        title: "",
        height: 400,
        width: 900,
        visible: false,
      },

      //弹框绑定数据域
      addModel: {
        userId: "",
        username: "",
        phone: "",
        sex: "",
        loginName: "",
        password: "",
        status: "",
        roleId: "",
        editType: "",
      },

      parms: {
        loginName: "",
        phone: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },

  created() {
    this.getRoleList();
    this.getList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
      this.assignTableHeight = window.innerHeight - 340;
      this.parkListTableHeight = window.innerHeight - 340;
    });
  },

  methods: {
    //搜索区域
    searchBtn() {
      this.getList();
    },

    resetBtn() {
      this.parms.loginName = "";
      this.parms.phone = "";
      this.getList();
    },

    addBtn() {
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      this.addDialog.title = "新增业主";
      this.addDialog.visible = true;
    },

    //分配房屋事件
    assignHouseClose() {
      this.assignHouseDialog.visible = false;
    },
    async assignHouseConfirm() {
      if (!this.assignHouseParm.houseId) {
        this.$message.warning("请选择要分配的房屋");
        return;
      }
      let res = await assignSavaApi(this.assignHouseParm);
      if (res && res.code == 200) {
        this.getList();
        this.assignHouseDialog.visible = false;
        this.$message.success(res.msg);
      }
    },
    //房屋选择事件
    getCurrentRow(row) {
      console.log(row);
      this.assignHouseParm.houseId = row.houseId;
      console.log(this.assignHouseParm);
    },

    //分配房屋列表搜索
    assignHouseSearchBtn() {
      this.getAssignHouseList();
    },

    //分配房屋列表重置
    assignHouseResetBtn() {
      this.houseParms.buildName = "";
      this.houseParms.unitName = "";
      this.houseParms.houseNum = "";
      this.getAssignHouseList();
    },

    //分配房屋页面分页操作
    assignHouseSizeChange(val) {
      this.houseParms.pageSize = val;
      this.getAssignHouseList();
    },
    assignHouseCurrentChange(val) {
      this.houseParms.currentPage = val;
      this.getAssignHouseList();
    },

    //表格操作
    async editBtn(row) {
      this.$resetForm("addForm", this.addModel);
      let res = await getUserById({ userId: row.userId });
      if (res && res.code == 200) {
        console.log(res);
        if (res.data) {
          this.$objCoppy(res.data, this.addModel);
        }
      }
      this.addModel.editType = "1";
      this.addDialog.title = "编辑业主";
      this.addDialog.visible = true;
      console.log(this.addModel);
    },

    async deleteBtn(row) {
      console.log(row);
      if(row.liveStatue){
        this.$message.warning("该业主未退车位，不能删除！");
        return;
      }
      if(row.useStatus){
        this.$message.warning("该业主未退房，不能删除！");
        return;
      }
      const confirm = await this.$myconfirm('确定删除该业主吗？');
      if(confirm){
        let res = await deleteApi({userId:row.userId});
        if(res && res.code == 200){
          this.getList();
          this.$message.success(res.msg);
        }
      }

    },

    //分配房屋
    async assignHouse(row) {
      if (row.houseNum) {
        this.$message.warning("已经分配房屋，不能重复分配！");
        return;
      }
      this.houseParms.buildName = "";
      this.houseParms.unitName = "";
      this.houseParms.houseNum = "";
      this.assignHouseParm.houseId = "";
      this.assignHouseParm.userId = "";
      this.getAssignHouseList();
      //弹框属性设置
      this.assignHouseDialog.title = "为【" + row.userName + "】分配房屋";
      this.assignHouseDialog.visible = true;
      this.assignHouseParm.userId = row.userId;
    },

    //获取未使用的房屋列表
    async getAssignHouseList() {
      let res = await getHouseListApi(this.houseParms);
      if (res && res.code == 200) {
        console.log(res);
        this.houseList = res.data.records;
        this.houseParms.total = res.data.total;
      }
    },

    ////////////////////////////////////////// 分配车位部分 //////////////////////////////////////////

    //分配车位搜索框
    parkSearchBtn() {
      this.getAssignParkList();
    },
    parkResetBtn() {
      this.parkParms.parkName = "";
      this.getAssignParkList();
    },

    //分配车位弹窗操作
    parkOnClose() {
      this.parkDialog.visible = false;
    },
    async parkOnConfirm() {
      if (!this.assignParkParm.parkId) {
        this.$message.warning("请选择车位");
        return;
      }

      let res = await assignParkSavaApi(this.assignParkParm);
      if (res && res.code == 200) {
        this.parkDialog.visible = false;
        this.getList();
        this.$message.success(res.msg);
      }
    },

    //分配车位"选择"点击事件
    getAssignParkId(row) {
      this.assignParkParm.parkId = row.parkId;
      console.log(this.assignParkParm);
    },

    //分页
    assignParkSizeChange(val) {
      this.parkParms.pageSize = val;
      this.getAssignParkList();
    },

    assignParkCurrentChange(val) {
      this.parkParms.currentPage = val;
      this.getAssignParkList();
    },

    //分配车位
    async assignPark(row) {
      console.log(row);
      if (row.parkName) {
        this.$message.warning("已分配车位，不能重复分配");
        return;
      }
      this.assignParkParm.parkId = "";
      this.parkParms.parkName = "";
      this.assignParkParm.userId = row.userId;
      this.getAssignParkList();
      this.parkDialog.title = "为【" + row.loginName + "】分配车位";
      this.parkDialog.visible = true;
    },

    //获取车位列表
    async getAssignParkList() {
      let res = await getParkListApi(this.parkParms);
      if (res && res.code == 200) {
        console.log(res);
        this.parkList = res.data.records;
        this.parkParms.total = res.data.total;
      }
    },

    //退房
    async leaveHouse(row) {
      console.log(row);
      if(!row.useStatus){
        this.$message.warning("该业主暂时无可退房屋！");
        return;
      }
      let confirm = await this.$myconfirm("确定退房吗？");
      if(confirm){
        let res = await returnHouseApi({
          userId:row.userId,
          houseId:row.houseId
        })

        if(res && res.code == 200){
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    //退车位
    async leavePark(row) {
      console.log(row);
      if(!row.liveStatue){
        this.$message.warning("该业主暂时无可退车位！");
        return;
      }
      let confirm = await this.$myconfirm("确定退车位吗？");
      if(confirm){
        let res = await returnParkApi({
          userId:row.userId,
          parkId:row.parkId
        })

        if(res && res.code == 200){
          this.getList();
          this.$message.success(res.msg);
        }
      }
    },

    //分页
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getList();
    },

    currentChange(val) {
      this.parms.currentPage = val;
      this.getList();
    },

    //弹框
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
            this.$message.success(res.msg);
            this.getList();
            this.addDialog.visible = false;
          }
        }
      });
    },

    //获取角色列表
    async getRoleList() {
      let res = await getRoleListApi();
      if (res && res.code == 200) {
        console.log(res);
        this.roleList = res.data;
      }
    },

    async getList() {
      let res = await getListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
        console.log(res);
      }
    },
  },
};
</script>

<style>
</style>
