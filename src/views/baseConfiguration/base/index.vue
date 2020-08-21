<template>
  <div class="organizational">
    <div class="organizational_header">
      <el-button type="primary" class="el-icon-plus" @click="orgAdd()">添加</el-button>
      <el-button class="el-icon-edit" @click="orgUpdata()">编辑</el-button>
      <el-button type="danger" class="el-icon-delete" @click="orgDelete()">删除</el-button>

      <el-input
        size="mini"
        style="width: 150px;margin:0 15px;"
        class="filter-item"
        :placeholder="'岗位名称'"
        v-model="listQuery.PostName"
      ></el-input>
      <el-select v-model="listQuery.IsResponsiblePost" placeholder="是否为主管" style="width: 150px;">
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>

      <el-button type="primary" class="el-icon-plus" @click="postAdd()">添加岗位</el-button>

      <el-button type="success" @click="configureMenu">
        <i class="el-icon-edit"></i>配置权限
      </el-button>
    </div>

    <div class="app-container flex-item">
      <el-row style="height: 100%;">
        <el-col :span="7" style="height: 100%;border: 1px solid #EBEEF5;">
          <el-card shadow="never" class="body-small" style="height: 100%;overflow:auto;">
            <el-tree :props="props" ref="tree" lazy :load="loadNode" node-key="id" accordion>
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
          </el-card>
        </el-col>
        <el-col :span="17" style="height: 100%;">
          <div class="bg-post" style="height: 100%;">
            <el-table
              ref="mainTable"
              :data="postList"
              v-loading="listLoading"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" align="center" width="55"></el-table-column>

              <el-table-column min-width="60px" :label="'岗位名称'" align="center">
                <template slot-scope="scope">
                  <span class="link-type">{{scope.row.postName}}</span>
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

              <el-table-column
                align="center"
                :label="'操作'"
                width="140"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="updatePost(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="deletePost(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 添加组织架构 -->
    <div class="org_add">
      <el-dialog
        :title="dialogAddForm.title"
        :visible.sync="dialogAddForm.show"
        :close-on-click-modal="false"
      >
        <el-form :model="form" ref="form" :rules="rulesCreateOrg">
          <el-form-item label="组织名称：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="组织架构代码：" :label-width="formLabelWidth" prop="nodeCode">
            <el-input v-model="form.nodeCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属机构：" :label-width="formLabelWidth" prop="orgName">
            <el-input v-model="form.orgName" disabled></el-input>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddForm.show = false">取 消</el-button>
          <el-button type="primary" @click="submitOrg()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改组织架构 -->
    <div class="org_add">
      <el-dialog
        :title="dialogUpdateForm.title"
        :visible.sync="dialogUpdateForm.show"
        :close-on-click-modal="false"
      >
        <el-form :model="form" ref="form">
          <el-form-item label="组织名称：" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="组织架构代码：" :label-width="formLabelWidth" prop="nodeCode">
            <el-input v-model="form.nodeCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属机构：" :label-width="formLabelWidth" prop="organizeParentId">
            <el-input v-model="form.organizeParentId" style="display:none"></el-input>
            <el-input v-model="orgName" :value="orgName" disabled></el-input>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateForm.show = false">取 消</el-button>
          <el-button type="primary" @click="submitupdateOrg()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 添加岗位 -->
    <div class="add_post">
      <el-dialog
        :title="dialogPost.title"
        :visible.sync="dialogPost.show"
        :close-on-click-modal="false"
      >
        <el-form :model="postForm" ref="postForm" :rules="rulesCreatePost">
          <el-form-item label="岗位名称：" :label-width="formLabelWidth" prop="postName">
            <el-input v-model="postForm.postName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属机构：" :label-width="formLabelWidth" prop="postOrgName">
            <el-input v-model="postForm.postOrgName" disabled></el-input>
          </el-form-item>
          <el-form-item label="
          是否为主管：" prop="isResponsiblePost">
            <el-checkbox v-model="postForm.isResponsiblePost">是</el-checkbox>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="postForm.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPost.show = false">取 消</el-button>
          <el-button type="primary" @click="submitCreatePost()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 编辑岗位 -->
    <div class="add_post">
      <el-dialog
        :title="dialogUpdatePost.title"
        :visible.sync="dialogUpdatePost.show"
        :close-on-click-modal="false"
      >
        <el-form :model="UpdatePostForm" ref="UpdatePostForm" :rules="rulesUpdatePost">
          <el-form-item label="岗位名称：" :label-width="formLabelWidth" prop="postName">
            <el-input v-model="UpdatePostForm.postName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属机构：" :label-width="formLabelWidth" prop="postOrg">
            <el-input v-model="UpdatePostForm.postOrg" disabled></el-input>
          </el-form-item>
          <el-form-item label="
          是否为主管：" prop="isResponsiblePost">
            <el-checkbox v-model="UpdatePostForm.isResponsiblePost">是</el-checkbox>
          </el-form-item>
          <el-form-item label="描述：" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="UpdatePostForm.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdatePost.show = false">取 消</el-button>
          <el-button type="primary" @click="submitUpdatePost()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

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

import MenuPermissions from "./menuPermissions";

import {
  getAlltOrganizet,
  deleteOrganize,
  getDetailOrganize,
  getPostsByOrganizeId,
  CreateOrUpdateOrganize
} from "../../../api/organization";
import {
  CreateOrUpdate,
  DeletePost,
  getAllPost,
  getByIdPost
} from "../../../api/post";

let id = 0;
export default {
  name: "organizational",
  components: {
    Pagination,
    MenuPermissions
  },
  data() {
    return {
      orgName: "",
      rulesCreateOrg: {
        name: [
          { required: true, message: "请输入组织名称", trigger: "change" }
        ],
        nodeCode: [
          { required: true, message: "请输入组织架构代码", trigger: "change" }
        ]
      },
      rulesCreatePost: {
        postName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" }
        ]
      },
      rulesUpdatePost: {
        postName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" }
        ]
      },
      props: {
        label: "name",
        children: "child",
        isLeaf: "leaf"
      },
      listLoading: false,
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        PostName: "",
        IsResponsiblePost: "",
        Remark: ""
      },
      orgId: "",
      // 组织架构
      dialogAddForm: {
        show: false,
        title: "",
        option: "create"
      },
      dialogUpdateForm: {
        show: false,
        title: "",
        option: "update"
      },
      form: {
        name: "",
        nodeCode: "",
        organizeParentId: "",
        orgName: "",
        remark: ""
      },
      // 岗位
      dialogPost: {
        show: false,
        title: "",
        option: "create"
      },
      postForm: {
        postName: "",
        organizeId: "",
        departmentId: "",
        postOrgName: "",
        postnLeaderId: 0,
        isResponsiblePost: true,
        remark: "",
        parentPostId: "",
        postOrg: ""
      },
      dialogUpdatePost: {
        show: false,
        title: "",
        option: "create"
      },
      UpdatePostForm: {
        postName: "",
        organizeId: "",
        departmentId: "",
        postnLeaderId: 0,
        isResponsiblePost: true,
        remark: "",
        parentPostId: "",
        postOrg: ""
      },
      postList: [],
      postId: "",
      updateId: "",
      orgsId: "",
      selectId: "",
      organizeParentId: "",
      formLabelWidth: "120px",
      organizeName: "",
      departmentName: "",
      orgData: [],
      orgResolve: [],
      orgNode: [],

      dialogMenu: {
        show: false,
        title: "",
        option: "create"
      },
      userListId: "",
      menuNum: "",
      multipleSelection: []
    };
  },

  mounted() {},
  methods: {
    configureMenu() {
      if (this.menuNum == "") {
        this.$message.error("请先选择组织架构或者岗位");
      } else {
        if (this.userListId == "1") {
          this.$message.error("此组织架构下不允许添加菜单权限");
        } else {
          this.dialogMenu = {
            show: true,
            title: "配置菜单权限",
            option: "create"
          };
          if (this.menuNum == "3") {
            this.userListId = toString(this.multipleSelection[0].id);
          }
          this.$refs.childMenu.getList();
        }
      }
    },
    loadNode(node, resolve) {
      this.orgNode = node;
      this.orgResolve = resolve;
      if (node.level === 0) {
        return resolve([{ name: "组织架构", id: "1" }]);
      } else {
        this.getTreeChild(node.data.id, resolve);
      }
    },
    getTreeChild(id, resolve) {
      localStorage.setItem("orgId", id);
      if (id == "1") {
        getAlltOrganizet()
          .then(res => {
            this.orgData = res.result.items;
            resolve(this.orgData);
          })
          .catch(err => {});
      } else {
        this.orgsId = id;
        getAlltOrganizet({ OrganizeParentId: id })
          .then(res => {
            this.orgData = res.result.items;
            resolve(this.orgData);
          })
          .catch(err => {});
      }
    },
    selectName(id, organizeParentId) {
      this.menuNum = "4";
      this.userListId = id;
      this.selectId = id;
      this.organizeParentId = organizeParentId;
      if (id != 1) {
        this.getPost(id);
      }
    },
    // 组织架构添加
    orgAdd() {
      this.dialogAddForm = {
        show: true,
        title: "新增组织架构",
        option: "create"
      };

      if (this.selectId == 1) {
        this.form = {
          name: "",
          nodeCode: "",
          organizeParentId: "",
          orgName: "组织架构",
          remark: ""
        };
      } else {
        getDetailOrganize({ Id: this.selectId }).then(res => {
          this.form = {
            name: "",
            nodeCode: "",
            organizeParentId: this.selectId,
            orgName: res.result.name,
            remark: ""
          };
        });
      }
    },
    submitOrg() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.organizeParentId === 1) {
            this.form.organizeParentId = "";
          }
          CreateOrUpdateOrganize(this.form).then(res => {
            this.loading = false;

            if (this.form.organizeParentId == "") {
              getAlltOrganizet()
                .then(res => {
                  this.orgData = res.result.items;

                  this.$refs.tree.updateKeyChildren(1, this.orgData);
                })
                .catch(err => {});
            } else {
              getAlltOrganizet({
                OrganizeParentId: this.form.organizeParentId
              })
                .then(res => {
                  this.orgData = res.result.items;
                  this.$refs.tree.updateKeyChildren(
                    this.form.organizeParentId,
                    this.orgData
                  );
                })
                .catch(err => {});
            }
            localStorage.removeItem("orgId");

            this.$nextTick(() => {
              this.$refs.form.clearValidate();
              this.$refs.form.resetFields();
            });

            this.dialogAddForm.show = false;
          });
        }
      });
    },
    // 组织架构修改
    orgUpdata() {
      if (localStorage.getItem("orgId") == 1) {
        this.$confirm("根节点不允许修改", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      } else {
        this.dialogUpdateForm = {
          show: true,
          title: "编辑组织架构",
          option: "update"
        };
        this.getorgUpdata();
      }
    },
    getorgUpdata() {
      const ogId = localStorage.getItem("orgId");

      getDetailOrganize({ Id: ogId })
        .then(res => {
          this.form = res.result;
          if (this.form.organizeParentId) {
            getDetailOrganize({ Id: this.form.organizeParentId })
              .then(res => {
                this.orgName = res.result.name;
              })
              .catch();
          } else {
            this.orgName = "组织架构";
          }
        })
        .catch();
    },
    submitupdateOrg() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          CreateOrUpdateOrganize(this.form).then(res => {
            this.loading = false;

            if (this.form.organizeParentId == null) {
              getAlltOrganizet()
                .then(res => {
                  this.orgData = res.result.items;

                  this.$refs.tree.updateKeyChildren(1, this.orgData);
                })
                .catch(err => {});
            } else {
              getAlltOrganizet({
                OrganizeParentId: this.form.organizeParentId
              })
                .then(res => {
                  this.orgData = res.result.items;
                  this.$refs.tree.updateKeyChildren(
                    this.form.organizeParentId,
                    this.orgData
                  );
                })
                .catch(err => {});
            }

            this.dialogUpdateForm.show = false;

            localStorage.removeItem("orgId");
            this.orgName = "";
          });
        }
      });
    },
    // 组织架构删除
    orgDelete() {
      if (this.selectId == 1) {
        this.$confirm("根节点不允许删除", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      } else {
        this.$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteOrganize({ Id: this.selectId })
              .then(res => {
                // if (this.organizeParentId == null) {
                //   var node = {
                //     level: 1,
                //     data: {
                //       id: 1
                //     },
                //     childNodes: []
                //   };

                //   // this.orgNode.childNodes = [];
                //   // this.loadNode(node, this.orgResolve);
                //   debugger;

                //   // this.loadNode(this.orgNode, this.orgResolve);
                // }

                this.$refs.tree.remove(this.selectId, this.orgNode);
              })
              .catch();
          })
          .catch(() => {});
      }
    },
    // 岗位添加
    postAdd() {
      this.dialogPost = {
        show: true,
        title: "新增岗位",
        option: "create"
      };

      getDetailOrganize({ Id: this.selectId }).then(res => {
        this.postForm = {
          postName: "",
          organizeId: res.result.organizeParentId,
          departmentId: this.selectId,
          postOrgName: res.result.name,
          postnLeaderId: 0,
          isResponsiblePost: true,
          remark: "",
          parentPostId: ""
        };
      });
    },
    submitCreatePost() {
      this.$refs["postForm"].validate(valid => {
        if (valid) {
          if (localStorage.getItem("postId")) {
            this.postForm.parentPostId = localStorage.getItem("postId");
          } else {
            delete this.postForm.parentPostId;
          }

          CreateOrUpdate(this.postForm).then(res => {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            if (localStorage.getItem("postId")) {
              localStorage.removeItem("postId");
            }

            this.$nextTick(() => {
              this.$refs.postForm.clearValidate();
              this.$refs.postForm.resetFields();
            });
            this.dialogPost.show = false;
            this.getPost(this.selectId);
          });
        }
      });
    },
    // 岗位修改
    updatePost(row, index) {
      localStorage.setItem("updateId", row.id);
      this.dialogUpdatePost = {
        show: true,
        title: "编辑岗位",
        option: "update"
      };

      this.getPostData();
    },
    getPostData() {
      getByIdPost({ Id: localStorage.getItem("updateId") })
        .then(res => {
          getDetailOrganize({ Id: res.result.organizeId })
            .then(res1 => {
              const name1 = res1.result.name;
              getDetailOrganize({ Id: res.result.departmentId })
                .then(res2 => {
                  const name2 = res2.result.name;
                  this.UpdatePostForm = res.result;
                  this.UpdatePostForm.postOrg = name1.concat("/").concat(name2);
                })
                .catch(() => {});
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    submitUpdatePost() {
      this.$refs["UpdatePostForm"].validate(valid => {
        if (valid) {
          CreateOrUpdate(this.UpdatePostForm).then(res => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            localStorage.removeItem("updateId");
            this.dialogUpdatePost.show = false;
            this.getPost(this.selectId);
          });
        } else {
          return false;
        }
      });
    },
    deletePost(row, index) {
      DeletePost({ Id: row.id })
        .then(res => {
          this.getPost(this.selectId);
        })
        .catch(err => {});
    },
    search() {
      getAllPost(this.listQuery)
        .then(res => {
          this.postList = res.result.items;
        })
        .catch();
    },
    // 根据部门获取获取岗位
    getPost(id) {
      this.listLoading = true;
      getPostsByOrganizeId({ Id: id })
        .then(res => {
          this.postList = res.result;
          this.listLoading = false;
        })
        .catch(err => {});
    },

    handleSelectionChange(val) {
      this.menuNum = "3";
      this.multipleSelection = val;
      // console.log(val);
      val.forEach(item => {
        localStorage.setItem("postId", item.id);
      });
    }
  }
};
</script>
<style scoped>
.organizational_header {
  text-align: right;
  margin-bottom: 5px;
  padding: 10px 20px 10px 0;
  background: #ffffff;
}
.organizational_header .el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.el-table .el-button {
  padding: 6px 10px;
  font-size: 10px;
}
</style>
<style>
.organizational_header .el-input__inner {
  height: 28px;
  line-height: 28px;
}
</style>
<style>
.bg-post .el-table td,
.el-table th {
  padding: 5px 0;
}
.bg-post .el-table__header-wrapper .cell {
  text-align: center;
}
span.tree-node {
  font-size: 12px;
}
.organizational {
  height: 100%;
}
.organizational .app-container {
  height: calc(100% - 52px);
}
.organizational .el-card__body {
  padding-top: 10px;
  padding-left: 5px;
}

.el-tree-node.is-current > .el-tree-node__content {
  background-color: #2f8dfb !important;
  color: white;
}
</style>
<style>
.add_post .el-form-item__content {
  margin-left: 0 !important;
}
.add_post label.el-form-item__label {
  text-align: left;
  padding-left: 2%;
  font-size: 12px;
}
.add_post .el-dialog {
  width: 38%;
}
.add_post .el-dialog__body {
  padding: 10px 20px;
}
.add_post .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.add_post .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.add_post .el-form-item {
  margin-bottom: 0;
}
.add_post .el-cascader {
  width: 100% !important;
}
.add_post .el-input__inner {
  height: 35px;
  line-height: 35px;
}
</style>
<style>
.org_add .el-form-item__content {
  margin-left: 0 !important;
}
.org_add label.el-form-item__label {
  text-align: left;
  padding-left: 2%;
  font-size: 12px;
}
.org_add .el-dialog {
  width: 38%;
}
.org_add .el-dialog__body {
  padding: 10px 20px;
}
.org_add .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.org_add .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.org_add .el-form-item {
  margin-bottom: 0;
}
.org_add .el-cascader {
  width: 100% !important;
}
</style>