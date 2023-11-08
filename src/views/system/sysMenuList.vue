<template>
  <el-main>
    <el-form size="small">
      <el-form-item>
        <el-button type="primary" v-if="hasPerm('sys:menu:add')" icon="el-icon-plus" @click="addMenu"
        >新增
        </el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :height="tableHeight"
      :data="tableLise"
      row-key="menuId"
      :tree-props="{ children: 'children' }"
      border
      stripe
      default-expand-all
    >
      <el-table-column prop="menuLabel" label="菜单名称"></el-table-column>
      <el-table-column prop="type" label="菜单类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == '0'">目录</el-tag>
          <el-tag type="success" v-if="scope.row.type == '1'">菜单</el-tag>
          <el-tag type="danger" v-if="scope.row.type == '2'">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="路由名称"></el-table-column>
      <el-table-column prop="path" label="路由地址"></el-table-column>
      <el-table-column prop="url" label="组件路径"></el-table-column>
      <el-table-column prop="menuCode" label="权限字段"></el-table-column>
      <el-table-column align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            v-if="hasPerm('sys:menu:edit')"
            @click="editMenu(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="hasPerm('sys:menu:delete')"
            @click="deleteMenu(scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <sys-dialog
      :title="dialog.title"
      :width="dialog.width"
      :height="dialog.height"
      :visible="dialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          style="margin-left: 40px"
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="normal"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item prop="type" label="菜单类型">
                <el-radio-group v-model="addModel.type" size="small">
                  <el-radio :label="'0'">目录</el-radio>
                  <el-radio :label="'1'">菜单</el-radio>
                  <el-radio :label="'2'">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="parentName" label="上级菜单">
            <el-input
              @click.native="selectParen"
              v-model="addModel.parentName"
              placeholder="请选择上级菜单"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="menuLabel" label="菜单名称">
            <el-input
              v-model="addModel.menuLabel"
              placeholder="请填写菜单名称"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="菜单图标">
            <el-input
              v-model="addModel.icon"
              placeholder="请填写菜单图标"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            prop="name"
            v-if="addModel.type == '1'"
            label="路由名称"
          >
            <el-input
              v-model="addModel.name"
              placeholder="请填写路由名称"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            prop="path"
            v-if="addModel.type != '2'"
            label="路由地址"
          >
            <el-input
              v-model="addModel.path"
              placeholder="请填写路由地址"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="url" v-if="addModel.type == '1'" label="组件路径">
            <el-input
              v-model="addModel.url"
              placeholder="请填写组件路径"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="menuCode" label="权限字段">
            <el-input
              v-model="addModel.menuCode"
              placeholder="请填写权限字段"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="权限备注">
            <el-input
              v-model="addModel.remark"
              placeholder="请填写权限备注"
              size="small"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="权限序号">
            <el-input
              v-model="addModel.orderNum"
              placeholder="请填写权限序号"
              size="small"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

    <sys-dialog
      :title="parentDialog.title"
      :width="parentDialog.width"
      :height="parentDialog.height"
      :visible="parentDialog.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parentList"
          node-key="menuId"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="false"
          :highlight-current="true"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="nodeSelect"
        >
          <div slot-scope="{ node, data }">
            <span v-if="data.children.length == 0">
              <i style="margin-right: 3px" class="el-icon-document"></i>
            </span>

            <span v-else @click.stop="openBtn(data)">
              <i
                v-if="data.open"
                style="margin-right: 3px"
                class="iconfont icon-jia"
              ></i>
              <i
                style="margin-right: 3px"
                v-else
                class="iconfont icon-jian"
              ></i>
            </span>

            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import {addMenuApi, deleteMenuApi, editMenuApi, getMenuListApi, getParentTreeApi,} from "@/api/menu";
import SysDialog from "@/components/system/SysDialog.vue";

export default {
  components: {
    SysDialog,
  },

  data() {
    return {
      parentList: [],

      selectNode: {
        menuId: "",
        menuLabel: "",
      },

      tableHeight: 0,
      defaultProps: {
        children: "children",
        label: "menuLabel",
      },

      rules: {
        type: [
          {
            required: true,
            trigger: "change",
            message: "请选择菜单类型",
          },
        ],
        parentName: [
          {
            required: true,
            trigger: "change",
            message: "请选择上级菜单",
          },
        ],
        menuLabel: [
          {
            required: true,
            trigger: "change",
            message: "请填写菜单名称",
          },
        ],
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由名称",
          },
        ],
        path: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由地址",
          },
        ],
        url: [
          {
            required: true,
            trigger: "change",
            message: "请填写组件路径",
          },
        ],
        menuCode: [
          {
            required: true,
            trigger: "change",
            message: "请填写权限字段",
          },
        ],
      },

      dialog: {
        title: "",
        width: 660,
        height: 380,
        visible: false,
      },

      parentDialog: {
        title: "选择上级部门",
        width: 300,
        height: 450,
        visible: false,
      },

      addModel: {
        editType: "",
        menuId: "",
        parentId: "",
        menuLabel: "",
        menuCode: "",
        name: "",
        path: "",
        url: "",
        type: "",
        icon: "",
        remark: "",
        parentName: "",
        orderNum: "",
        sort: ""
      },

      tableLise: [],
    };
  },

  created() {
    this.getMenuList();
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180;
    });
  },

  methods: {
    editMenu(row) {
      this.$resetForm("addForm", this.addModel);
      this.$objCoppy(row, this.addModel);
      this.addModel.editType = "1";
      this.dialog.title = "编辑菜单";
      this.dialog.visible = true;
    },

    async deleteMenu(row) {
      let confirm = await this.$myconfirm("确认删除该数据吗？");
      if (confirm) {
        let res = await deleteMenuApi({menuId: row.menuId});
      }
      if (res && res.code == 200) {
        this.getMenuList();
        this.$message.success(res.msg);
      }
    },

    openBtn(data) {
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.menuId].expanded = !data.open;
    },

    nodeSelect(node) {
      console.log(node);
      this.selectNode.menuId = node.menuId;
      this.selectNode.menuLabel = node.menuLabel;
    },

    onParentClose() {
      this.parentDialog.visible = false;
    },

    //上级部门确认事件
    onParentConfirm() {
      this.addModel.parentId = this.selectNode.menuId;
      this.addModel.parentName = this.selectNode.menuLabel;
      console.log(this.addModel);
      this.parentDialog.visible = false;
    },

    //选择上级部分点击事件
    async selectParen() {
      let res = await getParentTreeApi();
      if (res && res.code) {
        console.log(res);
        this.parentList = res.data;
      }
      this.parentDialog.visible = true;
    },

    addMenu() {
      this.$resetForm("addForm", this.addModel);
      this.dialog.title = "新增菜单";
      this.addModel.editType = "0";
      this.dialog.visible = true;
    },

    async getMenuList() {
      let res = await getMenuListApi();
      if (res && res.code == 200) {
        this.tableLise = res.data;
      }
      console.log(res);
    },

    onClose() {
      this.dialog.visible = false;
    },

    //新增编辑
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addMenuApi(this.addModel);
          } else {
            res = await editMenuApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getMenuList();
            this.dialog.visible = false;
            this.$message.success(res.msg);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }

  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }

  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .tree :first-child .el-tree-node:before {
    border-left: none;
  }

  // 竖线
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }

  //横线
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }

  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }

  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }

  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}

//去掉最上级的before  after 即是去电最上层的连接线
::v-deep .el-tree > div {
  &::before {
    display: none;
  }

  &::after {
    display: none;
  }
}
</style>
