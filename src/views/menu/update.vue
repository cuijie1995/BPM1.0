<template>
  <div class="menu_update">
    <div class="menu_add">
      <el-dialog
        :title="dialogMenuUpdate.title"
        :visible.sync="dialogMenuUpdate.show"
        :close-on-click-modal="false"
      >
        <el-form :model="menuForm" ref="menuForm" :rules="menuRules">
          <el-form-item label="图标：" :label-width="formLabelWidth" prop="icon">
            <el-upload
              class="upload-demo"
              action="2222"
              :multiple="true"
              :auto-upload="false"
              :before-upload="doUploads"
              :on-change="handleChange"
              :show-file-list="true"
              :file-list="fileList"
              accept=".peg, .png, .jpg"
              name="files"
              list-type="picture"
            >
              <div class="plus">
                <i class="el-icon-plus" style="font-size: 20px;"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="菜单名称：" :label-width="formLabelWidth" prop="nodeName">
            <el-input v-model="menuForm.nodeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径：" :label-width="formLabelWidth" prop="menuPath">
            <el-input v-model="menuForm.menuPath" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="层级码：" :label-width="formLabelWidth" prop="hierarchicalCode">
            <el-input v-model="menuForm.hierarchicalCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型：" :label-width="formLabelWidth" prop="menuType">
            <el-input v-model="menuForm.menuType" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限：" :label-width="formLabelWidth" prop="isAuthorityControl">
            <el-checkbox v-model="menuForm.isAuthorityControl">是</el-checkbox>
          </el-form-item>
          <el-form-item label="根菜单：" :label-width="formLabelWidth" prop="rootId">
            <el-select
              v-model="menuForm.rootId"
              filterable
              :default-first-option="true"
              placeholder="请选择"
              @change="clickChange"
            >
              <el-option label="根菜单" :value="menuForm.rootId"></el-option>

              <el-option
                v-for="item in listMenu"
                :key="item.id"
                :label="item.nodeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级菜单：" :label-width="formLabelWidth" prop="parentId">
            <el-cascader
              :show-all-levels="false"
              v-model="menuForm.parentId"
              :change-on-select="changeOnSelect"
              :props="props"
              :options="array"
              @active-item-change="handleItemChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogMenuUpdate.show = false">取 消</el-button>
          <el-button type="primary" @click="submitMenu()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import { UploadIForm } from "../../api/uplaod";
import { CreateOrUpdateMenu, GetSubmenus, getAllMenu } from "../../api/menu";
export default {
  name: "MenuUpdate",
  props: {
    dialogMenuUpdate: Object,
    menuForm: Object,
    listMenu: Array,
    changeOnSelect: {
      default: true
    }
  },
  components: {},
  data() {
    return {
      formLabelWidth: "100px",
      menuRules: {
        nodeName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        menuPath: [
          { required: true, message: "请输入菜单路径", trigger: "blur" }
        ],
        hierarchicalCode: [
          { required: true, message: "请输入层级码", trigger: "blur" }
        ],
        menuType: [
          { required: true, message: "请输入菜单类型", trigger: "blur" }
        ]
      },
      fileList: [],
      parentList: [],
      props: {},
      array: []
    };
  },
  created() {
    this.props = {
      lazy: true,
      expandTrigger: "click",
      lazyLoad(node, resolve) {
        const { level } = node;

        setTimeout(() => {
          if (level === 0) {
            getAllMenu({ MaxResultCount: 30 })
              .then(res => {
                this.array = res.result.items;
                const nodes = this.array.map((value, i) => {
                  ({
                    value: value.id,
                    label: value.nodeName,
                    leaf: level >= 5
                  });
                  return {
                    value: value.id,
                    label: value.nodeName,
                    leaf: level >= 5
                  };
                });
                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 1) {
            // console.log(level);
            GetSubmenus({ id: node.value })
              .then(res => {
                this.array = res.result;
                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.nodeName,
                  leaf: level >= 5
                }));
                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 2) {
            GetSubmenus({ id: node.value })
              .then(res => {
                this.array = res.result;

                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.nodeName,
                  leaf: level >= 5
                }));
                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 3) {
            GetSubmenus({ id: node.value })
              .then(res => {
                this.array = res.result;

                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.nodeName,
                  leaf: level >= 5
                }));
                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 4) {
            GetSubmenus({ id: node.value })
              .then(res => {
                this.array = res.result;

                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.nodeName,
                  leaf: level >= 5
                }));
                resolve(nodes);
              })
              .catch(err => {});
          }
          if (level === 5) {
            GetSubmenus({ id: node.value })
              .then(res => {
                this.array = res.result;

                const nodes = this.array.map((value, i) => ({
                  value: value.id,
                  label: value.nodeName,
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
  mounted() {},

  methods: {
    handleItemChange() {},
    clickChange(val) {
      GetSubmenus({ id: val }).then(res => {
        this.parentList = res.result;
      });
    },
    doUploads(file, files) {
      this.fileuploaded = false;

      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpeg";
      const extension2 = testmsg === "png";
      const extension3 = testmsg === "jpg";
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: "上传文件只能是jpeg、png、jpg格式!",
          type: "warning"
        });
      }

      return extension || extension2 || extension3;
    },
    handleChange(file, fileList) {
      const formData = new FormData();
      formData.append("files", file.raw);

      UploadIForm(formData).then(res => {
        this.menuForm.menuIcon = res.result.enclosures[0].id;
      });
    },
    submitMenu() {
      var curguid = "00000000-0000-0000-0000-000000000000";

      this.$refs["menuForm"].validate(valid => {
        if (valid) {
          let token = localStorage.getItem("Token");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          if (typeof this.menuForm.parentId == "object") {
            this.menuForm.parentId = this.menuForm.parentId[0];
          }

          CreateOrUpdateMenu(this.menuForm)
            .then(res => {
              this.$nextTick(() => {
                this.$refs.menuForm.clearValidate();
                this.$refs.menuForm.resetFields();
              });
              this.dialogMenuUpdate.show = false;

              this.$parent.getList();
            })
            .catch(err => {});
        }
      });
    }
  }
};
</script>
<style>
.menu_update label.el-form-item__label {
  text-align: left;
  padding-left: 2%;
  font-size: 12px;
}
.menu_add .el-dialog {
  width: 38%;
}
.menu_update .el-dialog__body {
  padding: 10px 20px;
}
.menu_update .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.menu_update .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.menu_update .el-form-item {
  margin-bottom: 0;
}

.menu_update .el-input__inner {
  height: 35px;
  line-height: 35px;
}

.menu_update input[type="file"] {
  display: none;
}
.menu_update .el-dialog__headerbtn {
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