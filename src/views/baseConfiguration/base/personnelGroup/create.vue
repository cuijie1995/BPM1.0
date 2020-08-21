<template>
  <div class="per_add">
    <el-dialog
      :title="dialogPersonnelGroup.title"
      :visible.sync="dialogPersonnelGroup.show"
      :close-on-click-modal="false"
    >
      <el-form :model="personnelGroupForm" ref="personnelGroupForm" :rules="personnelGroupRules">
        <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="personnelGroupForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简称：" :label-width="formLabelWidth" prop="displayName">
          <el-input v-model="personnelGroupForm.displayName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="通用名：" :label-width="formLabelWidth" prop="normalizedName">
          <el-input v-model="personnelGroupForm.normalizedName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth" prop="description">
          <el-input v-model="personnelGroupForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPersonnelGroup.show = false">取 消</el-button>
        <el-button type="primary" @click="submitPersonnelGroup()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { CreateRole } from "../../../../api/role";

export default {
  name: "personnelGroup",
  props: {
    dialogPersonnelGroup: Object,
    personnelGroupForm: Object,
    changeOnSelect: {
      default: true
    }
  },
  data() {
    return {
      formLabelWidth: "120px",
      personnelGroupRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        displayName: [
          { required: true, message: "请输入简称", trigger: "blur" }
        ],
        normalizedName: [
          { required: true, message: "请输入通用名", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    submitPersonnelGroup() {
      this.$refs["personnelGroupForm"].validate(valid => {
        if (valid) {
          let token = localStorage.getItem("Token");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;

          CreateRole(this.personnelGroupForm)
            .then(res => {
              this.$nextTick(() => {
                this.$refs.personnelGroupForm.clearValidate();
                this.$refs.personnelGroupForm.resetFields();
              });
              this.dialogPersonnelGroup.show = false;

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
.per_add .el-form-item__content {
  margin-left: 0 !important;
}
.per_add label.el-form-item__label {
  text-align: left;
  padding-left: 2%;
  font-size: 12px;
}
.per_add .el-dialog {
  width: 38%;
}
.per_add .el-dialog__body {
  padding: 10px 20px;
}
.per_add .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.per_add .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.per_add .el-form-item {
  margin-bottom: 0;
}
.per_add .el-cascader {
  width: 100% !important;
}
.per_add .el-input__inner {
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
</style>