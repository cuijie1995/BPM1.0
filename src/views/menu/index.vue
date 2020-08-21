<template>
  <div class="menu">
    <div class="menu_header">
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'层级码'"
        v-model="listQuery.HierarchicalCode"
      />
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'菜单名称'"
        v-model="listQuery.NodeName"
      />
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'菜单类型'"
        v-model="listQuery.MenuType"
      />

      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>
      <el-button type="primary" @click="addMenu">
        <i class="el-icon-plus"></i>添加
      </el-button>

      <el-button type="success" @click="power">权限配置</el-button>
    </div>
    <div class="menu_item">
      <el-table
        :data="menuList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>

        <el-table-column :label="'菜单名称'" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.nodeName}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'菜单路径'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.menuPath}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'层级码'" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.hierarchicalCode }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'菜单类型'" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.menuType}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="'操作'"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="listQuery.MaxResultCount"
        @pagination="getList"
      />
    </div>

    <CreateMenu :addMenuForm="addMenuForm" :dialogMenu="dialogMenu" :listMenu="listMenu"></CreateMenu>
    <UpdateMenu :menuForm="menuForm" :dialogMenuUpdate="dialogMenuUpdate" :listMenu="listMenu"></UpdateMenu>
    <MenuExuter :dialogTypeExecutor="dialogTypeExecutor" :rowId="rowId"></MenuExuter>
  </div>
</template>

<script>
import { getAllMenu, DeleteMenu, getByIdMenu } from "../../api/menu";
import pagination from "@/components/Pagination/index";
import CreateMenu from "./create";
import UpdateMenu from "./update";
import MenuExuter from "./menuExuter";

export default {
  name: "Menu",
  components: { pagination, CreateMenu, UpdateMenu, MenuExuter },
  data() {
    return {
      menuList: [],
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        HierarchicalCode: "",
        NodeName: "",
        MenuType: ""
      },
      listLoading: false,
      menuForm: {
        rootId: "",
        parentId: "",
        hierarchicalCode: "",
        nodeName: "",
        menuPath: "",
        menuIcon: "",
        menuType: "",
        isAuthorityControl: ""
      },
      addMenuForm: {
        rootId: "",
        parentId: "",
        hierarchicalCode: "",
        nodeName: "",
        menuPath: "",
        menuIcon: "",
        menuType: "",
        isAuthorityControl: ""
      },
      listMenu: [],
      dialogMenu: {
        show: false,
        title: "",
        option: ""
      },
      dialogMenuUpdate: {
        show: false,
        title: "",
        option: ""
      },
      rowId: "",
      rowList: [],
      dialogTypeExecutor: {
        show: false,
        title: "",
        option: ""
      }
    };
  },
  mounted() {
    this.getList();
  },

  methods: {
    handleSelectionChange(val) {
      this.rowList = val;
    },
    power() {
      if (this.rowList.length == 1) {
        this.dialogTypeExecutor = {
          show: true,
          title: "选择权限",
          option: ""
        };

        this.rowId = this.rowList[0].id;
      } else if (this.rowList.length == 0) {
        this.$message.error("请选中一个菜单");
      } else {
        this.$message.error("只能选中一个菜单");
      }
    },
    getList(value) {
      if (value) {
        this.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      getAllMenu(this.listQuery)
        .then(res => {
          //   console.log(res);
          this.menuList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    },
    addMenu() {
      this.dialogMenu = {
        show: true,
        title: "添加菜单",
        option: "create"
      };
      getAllMenu({ MaxResultCount: 30 })
        .then(res => {
          this.listMenu = res.result.items;
        })
        .catch();

      var obj = {
        id: "00000000-0000-0000-0000-000000000000",
        nodeName: "根菜单"
      };
      this.listMenu.unshift(obj);
    },

    handleUpdate(row) {
      this.dialogMenuUpdate = {
        show: true,
        title: "编辑菜单",
        option: "update"
      };
      getAllMenu({ MaxResultCount: 30 })
        .then(res => {
          this.listMenu = res.result.items;
        })
        .catch();

      var obj = {
        id: "00000000-0000-0000-0000-000000000000",
        nodeName: "根菜单"
      };
      this.listMenu.unshift(obj);

      getByIdMenu({ Id: row.id }).then(res => {
        this.menuForm = res.result;
        this.menuForm.parentId = this.menuForm.parentId.split(",");
      });
    },
    deleteRow(row) {
      DeleteMenu({ Id: row.id }).then(res => {
        this.getList();
      });
    },
    search() {
      getAllMenu(this.listQuery)
        .then(res => {
          this.menuList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    }
  }
};
</script>
<style scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.menu_header {
  text-align: right;
  padding: 10px;
}
.menu_header .el-input {
  margin-left: 10px;
}
</style>

<style>
.menu_item .el-table td,
.menu_item .el-table th {
  padding: 5px 0 !important;
}
</style>