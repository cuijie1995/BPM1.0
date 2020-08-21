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
            <el-input placeholder="岗位"></el-input>
            <el-input placeholder="用户"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small">查询</el-button>
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
                :data="postList"
                v-loading="postLoading"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-bottom:40px"
                @selection-change="handlePostChange"
              >
                <el-table-column type="selection" align="center" width="55"></el-table-column>

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

              <el-table
                :data="userList"
                v-loading="userLoading"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="handleUserChange"
              >
                <el-table-column type="selection" align="center" width="55"></el-table-column>

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
            </div>
          </el-col>

          <el-col :span="6">
            <el-card shadow="never" class="body-small">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label=" 用户组" name="first">
                  <el-table
                    :data="roleList"
                    v-loading="roleLoading"
                    border
                    fit
                    highlight-current-row
                    @selection-change="handleRoleChange"
                  >
                    <el-table-column type="selection" align="center" width="40"></el-table-column>

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
                    border
                    fit
                    highlight-current-row
                    @selection-change="handleenumDictionaryChange"
                  >
                    <el-table-column type="selection" align="center" width="40"></el-table-column>

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
import { getAllRole } from "../../../api/role";
import { GetUserByPostID } from "../../../api/post";
import {
  getAlltOrganizet,
  getPostsByOrganizeId
} from "../../../api/organization";
import { getRelativeExecutorEnum } from "../../../api/enumDictionary";

export default {
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
      postList: [],
      userList: [],
      postLoading: false,
      userLoading: false,
      roleLoading: false,
      enumDictionaryLoading: false,
      activeName: "first",
      roleList: [],
      enumDictionaryList: []
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getCheckedNodes() {
      var data = this.$refs.tree.getCheckedNodes();
      this.sponsor.department = [];
      this.name.department = [];
      for (let i = 0; i < data.length; i++) {
        this.sponsor.department.push(data[i].id);
      }
      for (let i = 0; i < data.length; i++) {
        this.name.department.push(data[i].name);
      }
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

      // this.sponsor.post = [];
      // this.name.post = [];
      for (let i = 0; i < val.length; i++) {
        this.sponsor.post.push(val[i].id);
      }
      for (let i = 0; i < val.length; i++) {
        this.name.post.push(val[i].postName);
      }

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
      this.sponsor.user = [];
      this.name.user = [];
      for (let i = 0; i < val.length; i++) {
        this.sponsor.user.push(val[i].id);
      }
      for (let i = 0; i < val.length; i++) {
        this.name.user.push(val[i].name);
      }

      this.name.user = this.name.user.join("/");
    },
    handleRoleChange(val) {
      this.sponsor.role = [];
      this.name.role = [];
      for (let i = 0; i < val.length; i++) {
        this.sponsor.role.push(val[i].id);
      }
      for (let i = 0; i < val.length; i++) {
        this.name.role.push(val[i].name);
      }
      this.name.role = this.name.role.join("/");
    },
    handleenumDictionaryChange(val) {
      this.sponsor.relative = [];
      this.name.relative = [];
      for (let i = 0; i < val.length; i++) {
        this.sponsor.relative.push(val[i].id);
      }
      for (let i = 0; i < val.length; i++) {
        this.name.relative.push(val[i].text);
      }
      this.name.relative = this.name.relative.join("/");
    },
    confirm() {
      this.$emit("checkContent", this.sponsor);
      this.dialogCus.show = false;
    },
    cancel() {
      this.dialogCus.show = false;
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
    }
  },
  watch: {
    currentSelect: {
      handler: function(val) {
        if (val.sponsor) {
          this.sponsor = val.sponsor;
        } else {
          this.sponsor = {
            user: [],
            post: [],
            role: [],
            department: [],
            relative: []
          };
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
}
</style>