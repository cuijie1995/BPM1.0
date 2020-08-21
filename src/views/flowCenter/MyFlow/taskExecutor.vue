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
          <el-col
            :span="8"
            v-if="name.user.length > 0 ||name.post.length > 0 || name.role.length > 0 ||  name.department.length > 0 || name.relative.length > 0"
          >
            <span class="name">
              选中的执行人：
              <span v-if="name.user.length > 0" class="name_list">{{name.user}},</span>
              <span v-if="name.post.length > 0" class="name_list">{{name.post}},</span>
              <span v-if="name.role.length > 0" class="name_list">{{name.role}},</span>
              <span v-if="name.department.length > 0" class="name_list">{{name.department}},</span>
              <span v-if="name.relative.length > 0" class="name_list">{{name.relative}}</span>
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
                :row-key="getRowKeys"
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
                    :row-key="rowByID"
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
                    :row-key="enumDictionaryID"
                    border
                    fit
                    highlight-current-row
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
        <el-button @click="dialogCus.show = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <div class="flow-success">
      <el-dialog
        :title="dialogTask.title"
        :visible.sync="dialogTask.show"
        :close-on-click-modal="false"
      >
        <div class="success">
          <span>请填写意见：</span>
          <el-input type="textarea" v-model="comments" style="margin-top: 15px;"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTask.show = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
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
import {
  getFlowData,
  FinishTask,
  BackToPreviousTask,
  AddFlowTask,
  TransferFlowTask,
  CirculateFlowTask,
  GetFlowTrackInfo
} from "../../../api/flowCenter";
import Pagination from "@/components/Pagination/index";

export default {
  components: {
    Pagination
  },
  props: {
    dialogCus: Object,
    currentSelect: Object,
    number: String
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
      dialogTask: {
        show: false,
        title: "",
        option: "create"
      },
      currentPostPage: 1, //初始页
      pagePostsize: 3, //    每页的数据
      // allList: [],
      currentUserPage: 1, //初始页
      pageUsersize: 3, //    每页的数据
      sponsor: {
        user: [],
        post: [],
        role: [],
        department: [],
        relative: []
      },
      name: {
        user: [],
        post: [],
        role: [],
        department: [],
        relative: []
      },

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
      enumDictionaryList: [],
      comments: ""
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    searchPostOrUser() {
      if (this.listQuery.PostName) {
        getAllPost(this.listQuery).then(res => {
          this.postList = res.result.items;
        });
      }
      if (this.listQuery.Keyword) {
        getAllUser(this.listQuery).then(res => {
          this.userList = res.result.items;
        });
      }
    },
    getCheckedNodes() {
      var data = this.$refs.tree.getCheckedNodes();

      this.sponsor.department = data.map(item => item.id);
      this.name.department = data.map(item => item.name);
      this.name.department = this.name.department.join("/");
    },
    handleCheckChange(data, checked, indeterminate) {
      this.getCheckedNodes();
    },
    loadNode(node, resolve) {
      this.orgNode = node;
      this.orgResolve = resolve;
      if (node.level === 0) {
        getAlltOrganizet()
          .then(res => {
            this.orgData = res.result.items;
            resolve(this.orgData);
          })
          .catch(err => {});
      } else {
        this.getTreeChild(node.data.id, resolve);
      }
    },
    getTreeChild(id, resolve) {
      localStorage.setItem("orgId", id);

      this.orgsId = id;
      getAlltOrganizet({ OrganizeParentId: id })
        .then(res => {
          this.orgData = res.result.items;
          resolve(this.orgData);
        })
        .catch(err => {});
    },
    selectName(id, organizeParentId) {
      this.selectId = id;
      this.organizeParentId = organizeParentId;
      if (id != 1) {
        this.getPost(id);
      }
    },
    // 根据部门获取获取岗位
    getPost(id) {
      this.postLoading = true;
      getPostsByOrganizeId({ Id: id })
        .then(res => {
          this.postList = res.result;
          this.postLoading = false;
        })
        .catch(err => {});
    },
    handlePostChange(val) {
      this.userByPostId(val);
      this.sponsor.post = this.$refs.postTable.store.states.selection.map(
        item => item.id
      );
      this.name.post = this.$refs.postTable.store.states.selection.map(
        item => item.postName
      );
      this.name.post = this.name.post.join("/");
    },
    // 根据岗位获取人
    userByPostId(row) {
      this.userLoading = true;
      GetUserByPostID({ PostID: row.id })
        .then(res => {
          this.userList = res.result;
          this.userLoading = false;
        })
        .catch(err => {});
    },
    handleUserChange(val) {
      this.sponsor.user = this.$refs.userTable.store.states.selection.map(
        item => item.id
      );
      this.name.user = this.$refs.userTable.store.states.selection.map(
        item => item.name
      );
      this.name.user = this.name.user.join("/");
    },
    handleRoleChange(val) {
      this.sponsor.role = val.map(item => item.id);
      this.name.role = val.map(item => item.name);

      this.name.role = this.name.role.join("/");
    },
    handleenumDictionaryChange(val) {
      this.sponsor.relative = val.map(item => item.keyId);
      this.name.relative = val.map(item => item.text);

      this.name.relative = this.name.relative.join("/");
    },
    handleClick(tab, event) {},
    getUser() {
      let token = localStorage.getItem("Token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      getAllRole().then(res => {
        this.roleList = res.result.items;
      });
      getRelativeExecutorEnum().then(res => {
        this.enumDictionaryList = res.result;
      });

      getAllPost().then(res => {
        this.postList = res.result.items;
      });
      getAllUser().then(res => {
        this.userList = res.result.items;
      });
    },
    handleChangePost(size) {
      this.pagePostsize = size; //每页下拉显示数据
    },
    handleCurrentPost(currentPage) {
      this.currentPostPage = currentPage; //点击第几页
    },
    handleChangeUser(size) {
      this.pageUsersize = size; //每页下拉显示数据
    },
    handleCurrentUser(currentPage) {
      this.currentUserPage = currentPage; //点击第几页
    },
    // 默人选中的用户组  相对执行人
    selectRole() {
      var that = this;
      that.$nextTick(() => {
        that.roleList.forEach(row => {
          if (that.sponsor.role.indexOf(row.id) >= 0) {
            // 没有出现返回-1  出现大于等0
            that.$refs.roleTable.toggleRowSelection(row, true);
          }
        });
      });
    },
    selectRelative() {
      var that = this;
      that.$nextTick(() => {
        that.enumDictionaryList.forEach(row => {
          // debugger;
          if (that.sponsor.relative.indexOf(row.keyId) >= 0) {
            // 没有出现返回-1  出现大于等0
            that.$refs.relativeTable.toggleRowSelection(row, true);
          }
        });
      });
    },
    selectPost() {
      var that = this;
      that.$nextTick(() => {
        that.postList.forEach(row => {
          // debugger;
          if (that.sponsor.post.indexOf(row.id) >= 0) {
            // 没有出现返回-1  出现大于等0
            that.$refs.postTable.toggleRowSelection(row, true);
          }
        });
      });
    },
    selectUser() {
      var that = this;
      that.$nextTick(() => {
        that.userList.forEach(row => {
          if (that.sponsor.user.indexOf(row.id) >= 0) {
            // 没有出现返回-1  出现大于等0
            that.$refs.userTable.toggleRowSelection(row, true);
          }
        });
      });
    },
    getRowKeys(row) {
      return row.id;
    },
    getUserKeys(row) {
      return row.id;
    },
    rowByID(row) {
      return row.id;
    },
    enumDictionaryID(row) {
      return row.id;
    },
    cancel() {
      this.dialogCus.show = false;
    },
    submit() {
      if (this.number == 1) {
        this.dialogTask = {
          show: true,
          title: "加签意见",
          option: "create"
        };
      }
      if (this.number == 2) {
        this.dialogTask = {
          show: true,
          title: "转签意见",
          option: "create"
        };
      }
      if (this.number == 3) {
        this.dialogTask = {
          show: true,
          title: "传阅意见",
          option: "create"
        };
      }
    },
    confirm() {
      if (this.number == 1) {
        AddFlowTask({
          assignTaskId: localStorage.getItem("RowId"),
          taskSponsors: this.sponsor,
          comments: this.comments
        }).then(res => {
          if (res.result.resultCode == 0) {
            this.$message({
              message: res.result.resultText,
              type: "success"
            });
            this.$router.push("/pendingFlow");
          }
          if (res.result.resultCode == 9) {
            this.$message({
              message: res.result.resultText,
              type: "warn"
            });
          }
          this.dialogCus.show = false;
          this.dialogTask.show = false;
        });
      }
      if (this.number == 2) {
        TransferFlowTask({
          assignTaskId: localStorage.getItem("RowId"),
          taskSponsors: this.sponsor,
          comments: this.comments
        })
          .then(res => {
            if (res.result.resultCode == 0) {
              this.$message({
                message: res.result.resultText,
                type: "success"
              });
              this.$router.push("/pendingFlow");
            }
            if (res.result.resultCode == 9) {
              this.$message({
                message: res.result.resultText,
                type: "warn"
              });
            }
            this.dialogCus.show = false;
            this.dialogTask.show = false;
          })
          .catch();
      }
      if (this.number == 3) {
        CirculateFlowTask({
          assignTaskId: localStorage.getItem("RowId"),
          taskSponsors: this.sponsor,
          comments: this.comments
        })
          .then(res => {
            if (res.result.resultCode == 0) {
              this.$message({
                message: res.result.resultText,
                type: "success"
              });
              this.$router.push("/pendingFlow");
            }
            if (res.result.resultCode == 9) {
              this.$message({
                message: res.result.resultText,
                type: "warn"
              });
            }
            this.dialogCus.show = false;
            this.dialogTask.show = false;
          })
          .catch();
      }
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
.flow-success {
  .el-dialog {
    height: 200px;
    width: 50%;
  }
  .el-dialog__body {
    height: 80px;
  }
}
</style>