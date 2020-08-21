<template>
  <div class="flex-column">
    <div class="person_header">
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'关键字'"
        v-model="listQuery.Keyword"
      ></el-input>
      <el-select v-model="listQuery.IsActive" placeholder="是否激活" style="width: 150px;">
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>

      <el-button type="primary" @click="addPersonnel">
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
          :row-key="getByID"
          :header-cell-style="{'background-color':'azure'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55" :reserve-selection="true"></el-table-column>

          <el-table-column align="center" :label="'账号'">
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'用户名'">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'公司'">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.organize}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'部门'">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.department}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'简称'" width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.surname}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'是否激活'">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.isActive | filterActive}}</span>
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

    <AddPersonnel :dialogPersonnel="dialogPersonnel" :personnelForm="personnelForm"></AddPersonnel>
    <UpdatePersonnel
      :dialogUpdatePersonnel="dialogUpdatePersonnel"
      :personnelForm="personnelForm"
      :orgName="orgName"
      :postName="postName"
      ref="perChild"
    ></UpdatePersonnel>

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
import AddPersonnel from "./create";
import UpdatePersonnel from "./update";
import MenuPermissions from "../menuPermissions";
import { getAllUser, deleteUser, getDetailUser } from "../../../../api/user";
import { getByIdPost } from "../../../../api/post";
import { getDetailOrganize } from "../../../../api/organization";

export default {
  name: "forms",
  components: {
    Pagination,
    AddPersonnel,
    UpdatePersonnel,
    MenuPermissions
  },
  filters: {
    filterActive(str) {
      switch (str) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    }
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
        Keyword: "",
        IsActive: ""
      },
      listLoading: false,
      // 人员
      dialogPersonnel: {
        show: false,
        title: "",
        option: "create"
      },
      dialogUpdatePersonnel: {
        show: false,
        title: "",
        option: "create"
      },
      personnelForm: {
        userName: "",
        name: "",
        surname: "",
        emailAddress: "",
        isActive: true,
        roleNames: [],
        password: "",
        organizeId: "",
        departmentId: "",
        postId: "",
        organizesId: ""
      },
      orgName: [],
      postName: "",
      dialogMenu: {
        show: false,
        title: "",
        option: "create"
      },
      userListId: "",
      menuNum: "1"
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
        this.$message.error("请选中一个用户");
      } else {
        this.$message.error("只能选中一个用户");
      }
    },
    getByID(row) {
      return row.id;
    },
    getList(value) {
      if (value) {
        this.listQuery.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      let token = localStorage.getItem("Token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      getAllUser(this.listQuery)
        .then(res => {
          this.list = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch(err => {});
    },
    // 单个删除
    deleteRow(index, row) {
      deleteUser({ Id: row.id }).then(res => {
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

    //   console.log(arr);
    //   this.$axios
    //     .delete(
    //       this.url1 +
    //         "/api/services/app/Menu/DeleteBatch?input=" +
    //         JSON.stringify(arr)
    //     )
    //     .then(res => {
    //       console.log(res);
    //       this.getList();
    //     });
    // },
    // 添加人员
    addPersonnel() {
      this.dialogPersonnel = {
        show: true,
        title: "新增人员",
        option: "create"
      };
      this.personnelForm = {
        userName: "",
        name: "",
        surname: "",
        emailAddress: "",
        isActive: true,
        roleNames: [],
        password: "",
        organizeId: "",
        departmentId: "",
        postId: ""
      };
    },
    // 编辑表单
    updateDynamic(index, row) {
      this.dialogUpdatePersonnel = {
        show: true,
        title: "编辑人员",
        option: "update"
      };

      getDetailUser({ Id: row.id }).then(res => {
        this.personnelForm = res.result;
        this.orgName = this.personnelForm.organizeId.split(",");
      });

      this.$refs.perChild.getRoleList();
    },
    search() {
      getAllUser(this.listQuery)
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

.person_header {
  text-align: right;
  margin-bottom: 10px;
  padding: 10px 0;
  background: #ffffff;
}
</style>
<style>
.flex-column .el-table td,
.flex-column .el-table th {
  padding: 6px 0;
}
.person_header .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.person_header .el-input {
  margin-right: 15px;
}
</style>