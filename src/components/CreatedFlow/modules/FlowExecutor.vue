<template>
  <div class="flow_executor">
    <el-dialog
      :title="dialogCus.title"
      :visible.sync="dialogCus.show"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div class="top">
        <el-row>
          <el-col :span="12">
            <el-input placeholder="岗位" v-model="listQuery.PostName"></el-input>
            <el-input placeholder="用户" v-model="listQuery.Keyword"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="searchPostOrUser">查询</el-button>
          </el-col>
          <el-col :span="8" v-if="sponsorName != ''">
            <span class="name">
              选中的执行人：
              <span class="name_list">{{sponsorName}}</span>
            </span>
          </el-col>
        </el-row>
      </div>
      <div class="content">
        <el-row>
          <el-col :span="6">
            <el-card shadow="never" class="body-small">
              <el-tree
                :props="props"
                ref="tree"
                lazy
                :load="loadNode"
                node-key="id"
                accordion
                show-checkbox
                @check-change="handleCheckChange"
              >
                >
                <span
                  class="tree-node"
                  slot-scope="{ node, data }"
                  :title="data.name"
                  style="display: block;width: 100%;"
                >
                  <span
                    @click="selectName(data.id,data.organizeParentId)"
                    style="display: block;width: 100%;"
                  >{{ data.name }}</span>
                </span>
              </el-tree>

              <el-button @click="getCheckedNodes" style="display: none;">通过 node 获取</el-button>
            </el-card>
          </el-col>
          <el-col :span="10">
            <div class="bg-post" style="height: 100%;">
              <el-table
                :data="postList.slice((currentPostPage-1)*pagePostsize,currentPostPage*pagePostsize)"
                v-loading="postLoading"
                ref="postTable"
                border
                fit
                highlight-current-row
                :row-key="getPostKeys"
                style="width: 100%"
                @selection-change="handlePostChange"
              >
                <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  align="center"
                  width="55"
                ></el-table-column>
                <el-table-column min-width="60px" :label="'岗位名称'" align="center">
                  <template slot-scope="scope">
                    <span class="link-type" @click="userByPostId(scope.row)">{{scope.row.postName}}</span>
                  </template>
                </el-table-column>
                <el-table-column min-width="60px" :label="'是否为主管'" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isResponsiblePost">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column class-name="status-col" :label="'描述'" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                @size-change="handleChangePost"
                @current-change="handleCurrentPost"
                :current-page="currentPostPage"
                :page-sizes="[3,5]"
                :page-size="pagePostsize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="postList.length"
              ></el-pagination>

              <el-table
                :data="userList.slice((currentUserPage-1)*pageUsersize,currentUserPage*pageUsersize)"
                v-loading="userLoading"
                ref="userTable"
                :row-key="getUserKeys"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="handleUserChange"
              >
                <el-table-column
                  type="selection"
                  align="center"
                  width="55"
                  :reserve-selection="true"
                ></el-table-column>

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

                <el-table-column align="center" :label="'简称'">
                  <template slot-scope="scope">
                    <span>{{scope.row.surname}}</span>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                @size-change="handleChangeUser"
                @current-change="handleCurrentUser"
                :current-page="currentUserPage"
                :page-sizes="[3,5]"
                :page-size="pageUsersize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="userList.length"
              ></el-pagination>
            </div>
          </el-col>

          <el-col :span="6">
            <el-card shadow="never" class="body-small">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label=" 用户组" name="first">
                  <el-table
                    :data="roleList"
                    v-loading="roleLoading"
                    ref="roleTable"
                    border
                    fit
                    :row-key="getRoleKeys"
                    highlight-current-row
                    @selection-change="handleRoleChange"
                  >
                    <el-table-column
                      type="selection"
                      align="center"
                      width="40"
                      :reserve-selection="true"
                    ></el-table-column>

                    <el-table-column min-width="60px" :label="'名称'" align="center">
                      <template slot-scope="scope">
                        <span class="link-type">{{scope.row.name}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="相对执行人" name="second" class="five">
                  <el-table
                    :data="enumDictionaryList"
                    v-loading="enumDictionaryLoading"
                    ref="relativeTable"
                    border
                    fit
                    highlight-current-row
                    :row-key="enumDictionaryID"
                    @selection-change="handleenumDictionaryChange"
                  >
                    <el-table-column
                      type="selection"
                      align="center"
                      width="40"
                      :reserve-selection="true"
                    ></el-table-column>

                    <el-table-column min-width="60px" :label="'名称'" align="center">
                      <template slot-scope="scope">
                        <span class="link-type">{{scope.row.text}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { getAllUser } from "../../../api/user";
import { getAllRole } from "../../../api/role";
import { GetUserByPostID, getAllPost } from "../../../api/post";
import {
  getAlltOrganizet,
  getPostsByOrganizeId
} from "../../../api/organization";
import { getRelativeExecutorEnum } from "../../../api/enumDictionary";
import Pagination from "@/components/Pagination/index";

let self;

export default {
  components: {
    Pagination
  },
  props: {
    dialogCus: Object,
    currentSelect: Object
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
  name: "FlowExecutor",
  data() {
    return {
      listQuery: {
        PostName: "",
        Keyword: ""
      },
      currentPostPage: 1, //初始页
      pagePostsize: 3, //    每页的数据
      currentUserPage: 1, //初始页
      pageUsersize: 3, //    每页的数据
      sponsor: {
        user: [],
        post: [],
        role: [],
        department: [],
        relative: []
      },
      sponsorName: "",
      userName: "",
      postName: "",
      roleName: "",
      departmentName: "",
      relativeName: "",
      props: {
        label: "name",
        children: "child",
        isLeaf: "leaf"
      },
      postLoading: false,
      userLoading: false,
      roleLoading: false,
      enumDictionaryLoading: false,
      activeName: "first",
      postList: [],
      userList: [],
      roleList: [],
      enumDictionaryList: []
    };
  },
  mounted() {
    self = this;

    self.getUser();
  },
  methods: {
    searchPostOrUser() {
      if (self.listQuery.PostName) {
        getAllPost(self.listQuery).then(res => {
          self.postList = res.result.items;
        });
      }
      if (self.listQuery.Keyword) {
        getAllUser(self.listQuery).then(res => {
          self.userList = res.result.items;
        });
      }
    },
    getCheckedNodes() {
      var data = self.$refs.tree.getCheckedNodes();

      self.sponsor.department = data.map(item => item.id);
      var department = [];
      department = data.map(item => item.name);
      self.departmentName = department.join("/");

      self.sponsorName =
        self.userName +
        "," +
        self.postName +
        "," +
        self.roleName +
        "," +
        self.departmentName +
        "," +
        self.relativeName;
    },
    handleCheckChange(data, checked, indeterminate) {
      self.getCheckedNodes();
    },
    loadNode(node, resolve) {
      self.orgNode = node;
      self.orgResolve = resolve;
      if (node.level === 0) {
        getAlltOrganizet()
          .then(res => {
            self.orgData = res.result.items;
            resolve(self.orgData);
          })
          .catch(err => {});
      } else {
        self.getTreeChild(node.data.id, resolve);
      }
    },
    getTreeChild(id, resolve) {
      localStorage.setItem("orgId", id);

      self.orgsId = id;
      getAlltOrganizet({ OrganizeParentId: id })
        .then(res => {
          self.orgData = res.result.items;
          resolve(self.orgData);
        })
        .catch(err => {});
    },
    selectName(id, organizeParentId) {
      self.selectId = id;
      self.organizeParentId = organizeParentId;
      if (id != 1) {
        self.getPost(id);
      }
    },
    // 根据部门获取获取岗位
    getPost(id) {
      self.postLoading = true;
      getPostsByOrganizeId({ Id: id })
        .then(res => {
          self.postList = res.result;
          self.postLoading = false;
        })
        .catch(err => {});
    },
    handlePostChange(val) {
      var str = val.pop();
      self.userByPostId(str);
      self.sponsor.post = self.$refs.postTable.store.states.selection.map(
        item => item.id
      );
      var post = [];
      post = self.$refs.postTable.store.states.selection.map(
        item => item.postName
      );
      self.postName = post.join("/");

      self.sponsorName =
        self.userName +
        "," +
        self.postName +
        "," +
        self.roleName +
        "," +
        self.departmentName +
        "," +
        self.relativeName;
    },
    // 根据岗位获取人
    userByPostId(row) {
      self.userLoading = true;
      if (row) {
        GetUserByPostID({ PostID: row.id })
          .then(res => {
            self.userList = res.result;
            self.userLoading = false;
          })
          .catch(err => {});
      } else {
        self.userLoading = false;

        self.userList = [];
      }
    },
    handleUserChange(val) {
      self.sponsor.user = self.$refs.userTable.store.states.selection.map(
        item => item.id
      );
      var user = [];
      user = self.$refs.userTable.store.states.selection.map(item => item.name);
      self.userName = user.join("/");
      self.sponsorName =
        self.userName +
        "," +
        self.postName +
        "," +
        self.roleName +
        "," +
        self.departmentName +
        "," +
        self.relativeName;
    },
    handleRoleChange(val) {
      self.sponsor.role = val.map(item => item.id);
      var role = [];
      role = val.map(item => item.name);

      self.roleName = role.join("/");
      self.sponsorName =
        self.userName +
        "," +
        self.postName +
        "," +
        self.roleName +
        "," +
        self.departmentName +
        "," +
        self.relativeName;
    },
    handleenumDictionaryChange(val) {
      self.sponsor.relative = val.map(item => item.keyId);
      var relative = [];
      relative = val.map(item => item.text);

      self.relativeName = relative.join("/");
      self.sponsorName =
        self.userName +
        "," +
        self.postName +
        "," +
        self.roleName +
        "," +
        self.departmentName +
        "," +
        self.relativeName;
    },
    confirm() {
      self.sponsorName =
        self.userName +
        "," +
        self.postName +
        "," +
        self.roleName +
        "," +
        self.departmentName +
        "," +
        self.relativeName;

      self.$emit("checkContent", self.sponsor, self.sponsorName);
      self.dialogCus.show = false;
    },
    cancel() {
      self.dialogCus.show = false;
    },
    handleClick(tab, event) {},
    getUser() {
      let token = localStorage.getItem("Token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      getAllRole().then(res => {
        self.roleList = res.result.items;
      });
      getRelativeExecutorEnum().then(res => {
        self.enumDictionaryList = res.result;
      });

      getAllPost().then(res => {
        self.postList = res.result.items;
      });
      getAllUser().then(res => {
        self.userList = res.result.items;
      });
    },
    handleChangePost(size) {
      self.pagePostsize = size; //每页下拉显示数据
    },
    handleCurrentPost(currentPage) {
      self.currentPostPage = currentPage; //点击第几页
    },
    handleChangeUser(size) {
      self.pageUsersize = size; //每页下拉显示数据
    },
    handleCurrentUser(currentPage) {
      self.currentUserPage = currentPage; //点击第几页
    },
    // 默人选中的用户组  相对执行人
    selectRole() {
      self.$nextTick(() => {
        self.roleList.forEach(row => {
          if (self.sponsor.role.indexOf(row.id) >= 0) {
            // 没有出现返回-1  出现大于等0
            self.$refs.roleTable.toggleRowSelection(row);
          }
        });
      });
    },
    selectRelative() {
      self.$nextTick(() => {
        self.enumDictionaryList.forEach(row => {
          if (self.sponsor.relative.indexOf(row.keyId) >= 0) {
            // 没有出现返回-1  出现大于等0
            self.$refs.relativeTable.toggleRowSelection(row);
          }
        });
      });
    },
    selectPost() {
      self.$nextTick(() => {
        self.postList.forEach(row => {
          if (self.sponsor.post.indexOf(row.id) >= 0) {
            // 没有出现返回-1  出现大于等0
            self.$refs.postTable.toggleRowSelection(row);
          }
        });
      });
    },
    selectUser() {
      self.$nextTick(() => {
        self.userList.forEach(row => {
          if (self.sponsor.user.indexOf(row.id) >= 0) {
            // 没有出现返回-1  出现大于等0
            self.$refs.userTable.toggleRowSelection(row);
          }
        });
      });
    },
    getPostKeys(row) {
      return row.id;
    },
    getUserKeys(row) {
      return row.id;
    },
    getRoleKeys(row) {
      return row.id;
    },
    enumDictionaryID(row) {
      return row.keyId;
    },
    sponsorData(data) {
      console.log(data)
    
      console.log(self.sponsor);
      self.selectRole();
      self.selectRelative();
      self.selectPost();
      self.selectUser();
    }
  },
  watch: {
    currentSelect: {
      handler: function(val) {
        // console.log(val);
        if (val.sponsor) {
          self.sponsor = val.sponsor;
          self.sponsorName = val.sponsorName;
        } else {
          if (
            self.$refs.postTable &&
            self.$refs.userTable &&
            self.$refs.roleTable &&
            self.$refs.relativeTable
          ) {
            self.$refs.postTable.store.states.selection = [];
            self.$refs.userTable.store.states.selection = [];
            self.$refs.roleTable.store.states.selection = [];
            self.$refs.relativeTable.store.states.selection = [];
          }

          self.sponsor = {
            user: [],
            post: [],
            role: [],
            department: [],
            relative: []
          };

          self.sponsorName = "";
          self.userName = "";
          self.postName = "";
          self.roleName = "";
          self.departmentName = "";
          self.relativeName = "";
        }
      },
      deep: true
    }
  }
};
</script>
<style  lang="scss">
.flow_executor {
  .el-dialog {
    height: 500px;
    width: 80%;
  }
  .el-dialog__header {
    padding: 10px 20px 10px;
  }
  .el-dialog__body {
    height: 370px;
    padding: 10px !important;
  }
  .el-dialog__footer {
    padding: 10px 60px 20px;
  }
  .el-dialog__footer .el-button {
    padding: 8px 15px;
  }

  .content {
    border-top: 1px solid #ebeef5;
    .el-row {
      height: 90%;
    }
    .el-col {
      height: 100%;
    }
    .el-col-10 {
      margin: 0 35px;
    }
  }
  .top {
    margin-bottom: 10px;
    .el-input {
      width: 40%;
      margin-right: 10%;
    }
  }
  span.name {
    font-size: 11px;
  }
  .name {
    .name_list {
      color: #67c23a;
    }
  }
}
</style>
<style lang="scss">
.flow_executor {
  .el-table td,
  .el-table th {
    padding: 5px 0;
  }
  .cell {
    font-size: 11px;
  }
  .bg-post .el-table__header-wrapper .cell {
    text-align: center;
  }
  span.tree-node {
    font-size: 12px;
  }
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #2f8dfb !important;
    color: white;
  }

  .el-card {
    // border: none;
    height: 100%;
  }
  .el-card__body {
    padding: 10px;
  }

  .el-tabs {
    padding-left: 15px;
    .el-tabs__content {
      padding: 20px 10px !important;
    }
  }

  .top {
    input.el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }

  .el-pagination {
    width: 100% !important;
    margin: 10px 0 20px 0;
  }
  span.el-pagination__sizes {
    width: 80px !important;
  }
  ul.el-pager {
    width: 100px;
  }
}
</style>