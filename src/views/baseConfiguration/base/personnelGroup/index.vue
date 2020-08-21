<template>
  <div class="flex-column">
    <div class="filter-container">
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'关键字'"
        v-model="listQuery.Keyword"
      ></el-input>
      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>
      <el-button type="primary" @click="addPersonnelGroup">
        <i class="el-icon-plus"></i>添加
      </el-button>

      <el-button type="success" @click="configureMenu">
        <i class="el-icon-edit"></i>配置权限
      </el-button>
    </div>

    <div class="app-container flex-item">
      <div class="bg-white" style="height: 100%;">
        <el-table
          :data="list"
          v-loading="listLoading"
          border
          style="width: 100%;"
          :header-cell-style="{'background-color':'azure'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>

          <el-table-column align="center" :label="'组名'">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'简称'">
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.displayName}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'通用名'">
            <template slot-scope="scope">
              <span>{{scope.row.normalizedName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="'描述'">
            <template slot-scope="scope">
              <span>{{scope.row.description}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'操作'" width="160">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="updateDynamic(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
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
    </div>

    <AddPersonnelGroup
      :dialogPersonnelGroup="dialogPersonnelGroup"
      :personnelGroupForm="personnelGroupForm"
    ></AddPersonnelGroup>
    <UpdatePersonnelGroup
      :dialogUpdatePersonnelGroup="dialogUpdatePersonnelGroup"
      :personnelGroupForm="personnelGroupForm"
    ></UpdatePersonnelGroup>

    <MenuPermissions
      :dialogMenu="dialogMenu"
      ref="childMenu"
      :userListId="userListId"
      :menuNum="menuNum"
    ></MenuPermissions>
  </div>
</template>

<script>
import axios from "axios";
import Pagination from "@/components/Pagination/index";
import AddPersonnelGroup from "./create";
import UpdatePersonnelGroup from "./update";
import MenuPermissions from "../menuPermissions";
import {
  getAllRole,
  deleteRole,
  getDetailRole,
  deleteBatchRole
} from "../../../../api/role";

export default {
  name: "forms",
  components: {
    Pagination,
    AddPersonnelGroup,
    UpdatePersonnelGroup,
    MenuPermissions
  },
  data() {
    return {
      multipleSelection: [],
      list: [],
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        Keyword: ""
      },
      listLoading: false,
      // 人员组
      dialogPersonnelGroup: {
        show: false,
        title: "",
        option: "create"
      },
      dialogUpdatePersonnelGroup: {
        show: false,
        title: "",
        option: "update"
      },
      personnelGroupForm: {
        name: "",
        displayName: "",
        normalizedName: "",
        description: "",
        grantedPermissions: [""]
      },
      dialogMenu: {
        show: false,
        title: "",
        option: "create"
      },
      userListId: "",
      menuNum: "2"
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    configureMenu() {
      console.log(this.multipleSelection);
      if (this.multipleSelection.length == 1) {
        this.dialogMenu = {
          show: true,
          title: "配置菜单权限",
          option: "create"
        };
        this.userListId = toString(this.multipleSelection[0].id);
        this.$refs.childMenu.getList();
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请选中一个用户组");
      } else {
        this.$message.error("只能选中一个用户组");
      }
    },
    getList(value) {
      if (value) {
        this.listQuery.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      let token = localStorage.getItem("Token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      getAllRole(this.listQuery)
        .then(res => {
          this.list = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch(err => {});
    },
    // 单个删除
    deleteRow(index, row) {
      deleteRole({ Id: row.id }).then(res => {
        this.getList();
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // // 批量删除
    // BatchDelete() {
    //   let arr = [];
    //   for (let i = 0; i < this.multipleSelection.length; i++) {
    //     arr.push(this.multipleSelection[i].id);
    //   }
    //   deleteBatchRole({ input: JSON.stringify(arr) }).then(res => {
    //     this.getList();
    //   });
    // },
    // 添加人员
    addPersonnelGroup() {
      this.dialogPersonnelGroup = {
        show: true,
        title: "新增人员组",
        option: "create"
      };
      this.personnelGroupForm = {
        name: "",
        displayName: "",
        normalizedName: "",
        description: "",
        grantedPermissions: [""]
      };
    },
    // 编辑表单
    updateDynamic(index, row) {
      this.dialogUpdatePersonnelGroup = {
        show: true,
        title: "编辑人员组",
        option: "update"
      };

      getDetailRole({ Id: row.id })
        .then(res => {
          this.personnelGroupForm = res.result;
        })
        .catch(() => {});
    },
    search() {
      getAllRole(this.listQuery)
        .then(res => {
          this.list = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch(err => {});
    }
  }
};
</script>
<style  scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.flex-column,
.app-container.flex-item {
  height: calc(100% - 65px);
}

.filter-container {
  text-align: right;
  margin-bottom: 10px;
  padding: 10px 0;
  background: #ffffff;
}
.preview_data {
  padding: 5px;
}
/* span.preview_dynamicName{
  margin-right: 10px;
} */
</style>
<style>
.flex-column .el-table td,
.flex-column .el-table th {
  padding: 6px 0;
}

.preview_model .el-dialog--center .el-dialog__body {
  padding: 0 25px 25px 30px !important;
}
.preview_model .el-dialog__wrapper {
  margin-top: 100px;
}
</style>