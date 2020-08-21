<template>
  <div class="add_person">
    <el-dialog
      :title="dialogUpdatePersonnel.title"
      :visible.sync="dialogUpdatePersonnel.show"
      :close-on-click-modal="false"
    >
      <el-form :model="personnelForm" ref="personnelForm" :rules="personnelRules">
        <el-form-item label="账号：" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="personnelForm.userName" autocomplete="off"></el-input>
          {{personnelForm.organizesId}}
        </el-form-item>

        <el-form-item label="用户名：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="personnelForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="简称：" :label-width="formLabelWidth" prop="surname">
          <el-input v-model="personnelForm.surname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱：" :label-width="formLabelWidth" prop="emailAddress">
          <el-input v-model="personnelForm.emailAddress"></el-input>
        </el-form-item>

        <el-form-item label="
          是否激活：" prop="isActive">
          <el-checkbox v-model="personnelForm.isActive">是</el-checkbox>
        </el-form-item>

        <el-form-item label="
          岗位角色：" prop="roleNames">
          <el-checkbox-group v-model="personnelForm.roleNames">
            <el-checkbox :label="role.name" v-for="role in roleLists" :key="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="所属岗位：" :label-width="formLabelWidth" prop="organizesId">
          <el-row>
            <el-col :span="13">
              <el-cascader
                :show-all-levels="false"
                v-model="orgName"
                :props="props"
                :options="array"
                :change-on-select="changeOnSelect"
                @active-item-change="handleItemChange"
              ></el-cascader>
            </el-col>
            <el-col :span="8">
              <el-select v-model="personnelForm.postId" value-key="id" placeholder="选择岗位">
                <el-option
                  v-for="item in postList"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.id"
                >{{item.postName}}</el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- {{orgName}}/ -->
        <el-button @click="dialogUpdatePersonnel.show = false">取 消</el-button>
        <el-button type="primary" @click="submitPersonnel()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { UpdateUser } from "../../../../api/user";
import { getAllRole } from "../../../../api/role";
import {
  getPostsByOrganizeId,
  getAlltOrganizet
} from "../../../../api/organization";
import { getAllPost } from "../../../../api/post";

export default {
  name: "personnel",
  props: {
    dialogUpdatePersonnel: Object,
    personnelForm: Object,
    changeOnSelect: {
      default: true
    },
    orgName: Array,
    postName: String
  },
  data() {
    return {
      personnelRules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        surname: [{ required: true, message: "请输入简称", trigger: "blur" }],
        emailAddress: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        organizesId: [
          { required: true, message: "请选择所属岗位", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px",
      orgList: [],
      departList: [],
      postList: [],
      roleLists: [],
      props: {},
      array: []
    };
  },
  created() {
    this.props = {
      lazy: true,
      expandTrigger: "hover",
      lazyLoad(node, resolve) {
        const { level } = node;
        setTimeout(() => {
          if (level === 0) {
            getAlltOrganizet()
              .then(res => {
                this.array = res.result.items;
                const nodes = this.array.map((value, i) => {
                  ({
                    value: value.id,
                    label: value.name,
                    leaf: level >= 5
                  });
                  return {
                    value: value.id,
                    label: value.name,
                    leaf: level >= 5
                  };
                });
                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 1) {
            getAlltOrganizet({ OrganizeParentId: node.value })
              .then(res => {
                this.array = res.result.items;
                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.name,
                  leaf: level >= 5
                }));

                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 2) {
            getAlltOrganizet({ OrganizeParentId: node.value })
              .then(res => {
                this.array = res.result.items;
                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.name,
                  leaf: level >= 5
                }));

                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 3) {
            getAlltOrganizet({ OrganizeParentId: node.value })
              .then(res => {
                this.array = res.result.items;
                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.name,
                  leaf: level >= 5
                }));

                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 4) {
            getAlltOrganizet({ OrganizeParentId: node.value })
              .then(res => {
                this.array = res.result.items;
                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.name,
                  leaf: level >= 5
                }));

                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 5) {
            getAlltOrganizet({ OrganizeParentId: node.value })
              .then(res => {
                this.array = res.result.items;
                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.name,
                  leaf: level >= 5
                }));

                resolve(nodes);
              })
              .catch(err => {});
          }
        }, 1000);
      }
    };
  },
  mounted() {
    // this.getRoleList();
  },
  methods: {
    handleItemChange(value) {
      this.getPostList(value.pop());
    },
    getPostList(id) {
      getPostsByOrganizeId({ Id: id })
        .then(res => {
          this.postList = res.result;
        })
        .catch(() => {});
    },
    getRoleList() {
      let token = localStorage.getItem("Token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      getAllRole()
        .then(res => {
          this.roleLists = res.result.items;
        })
        .catch(() => {});

      getAllPost().then(res => {
        this.postList = res.result.items;
      });
    },
    submitPersonnel() {
      this.personnelForm.organizesId = this.orgName.toString();
      this.$refs["personnelForm"].validate(valid => {
        if (valid) {
          let token = localStorage.getItem("Token");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;

          UpdateUser(this.personnelForm)
            .then(res => {
              this.$parent.getList();
              this.dialogUpdatePersonnel.show = false;
            })
            .catch(err => {});
        }
      });
    }
  }
};
</script>
<style>
.add_person .el-form-item__content {
  margin-left: 100px !important;
}
.add_person label.el-form-item__label {
  width: 100px !important;
  padding-left: 2%;
  font-size: 12px;
}
.add_person .el-dialog {
  width: 38%;
}
.add_person .el-dialog__body {
  padding: 10px 20px;
}
.add_person .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.add_person .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.add_person .el-form-item {
  margin-bottom: 10px;
}
.add_person .el-cascader {
  width: 100% !important;
}
.add_person .el-input__inner {
  height: 35px;
  line-height: 35px;
}
</style>
<style scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.el-col-13 {
  margin-right: 30px;
}
</style>