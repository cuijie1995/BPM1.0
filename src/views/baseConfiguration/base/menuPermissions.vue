<template>
  <div class="menu">
    <div class="menu_permission">
      <el-dialog
        :title="dialogMenu.title"
        :visible.sync="dialogMenu.show"
        :close-on-click-modal="false"
      >
        <div class="menu_header">
          <el-input
            size="mini"
            style="width: 180px;"
            class="filter-item"
            :placeholder="'层级码'"
            v-model="listQuery.HierarchicalCode"
          />
          <el-input
            size="mini"
            style="width: 180px;"
            class="filter-item"
            :placeholder="'菜单名称'"
            v-model="listQuery.NodeName"
          />
          <el-input
            size="mini"
            style="width: 180px;"
            class="filter-item"
            :placeholder="'菜单类型'"
            v-model="listQuery.MenuType"
          />

          <el-button type="primary" @click="search">
            <i class="el-icon-search"></i>查找
          </el-button>
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
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="page"
            :limit.sync="listQuery.MaxResultCount"
            @pagination="getList"
          />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogMenu.show = false">取 消</el-button>
          <el-button type="primary" @click="submitMenuPermission()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  CreateOrUpdateMenu,
  GetSubmenus,
  getAllMenu,
  CreateMenuOrganizeJurisdiction,
  CreateMenuPostJurisdiction,
  CreateMenuRoleJurisdiction,
  CreateMenuUserJurisdiction
} from "../../../api/menu";

import pagination from "@/components/Pagination/index";

export default {
  name: "MenuCreate",
  props: {
    dialogMenu: Object,
    userListId: String,
    menuNum: String
  },
  components: { pagination },
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
      menuSelection: [],
      menuId: ""
    };
  },

  mounted() {},

  methods: {
    handleSelectionChange(val) {
      this.menuSelection = val;
    },
    getList(value) {
      //   console.log(this.menuNum);
      if (value) {
        this.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      getAllMenu(this.listQuery)
        .then(res => {
          this.menuList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    },
    search() {
      getAllMenu(this.listQuery)
        .then(res => {
          this.menuList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    },
    submitMenuPermission() {
      if (this.menuSelection.length == 1) {
        this.menuId = this.menuSelection[0].id;

        if (this.menuNum == "1") {
          CreateMenuUserJurisdiction({
            authorizedId: this.userListId,
            jurisdictionId: this.menuId
          }).then(res => {
            console.log(res);
          });
        }
        if (this.menuNum == "2") {
          CreateMenuRoleJurisdiction({
            authorizedId: this.userListId,
            jurisdictionId: this.menuId
          }).then(res => {
            console.log(res);
          });
        }
        if (this.menuNum == "3") {
          CreateMenuPostJurisdiction({
            authorizedId: this.userListId,
            jurisdictionId: this.menuId
          }).then(res => {
            console.log(res);
          });
        }
        if (this.menuNum == "4") {
          CreateMenuOrganizeJurisdiction({
            authorizedId: this.userListId,
            jurisdictionId: this.menuId
          }).then(res => {
            console.log(res);
          });
        }
      } else if (this.menuSelection.length == 0) {
        this.$message.error("请选择一个菜单");
      } else {
        this.$message.error("只能选择一个菜单");
      }
    }
  }
};
</script>
<style>
</style>
<style>
.menu_permission .el-dialog {
  width: 60%;
  margin-top: 2vh !important;
}
.menu_permission .el-dialog__body {
  padding: 10px 20px;
}
.menu_permission .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.menu_permission .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}

.menu_permission .el-dialog__headerbtn {
  top: 0 !important;
}
</style>
<style scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
</style>

<style  scoped>
.menu_header {
  text-align: right;
  margin-bottom: 10px;
  padding: 10px 0;
  background: #ffffff;
}
</style>
<style>
.menu_permission .el-table td,
.menu_permission .el-table th {
  padding: 1px 0 !important;
}
.menu_permission .menu_header .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.menu_permission .menu_header .el-input {
  margin-right: 15px;
}
</style>