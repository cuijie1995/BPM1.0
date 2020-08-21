<template>
  <div class="add_type">
    <div class="type_add">
      <el-dialog
        :title="dialogType.title"
        :visible.sync="dialogType.show"
        :close-on-click-modal="false"
      >
        <el-form :model="typeForm" ref="typeForm" :rules="typeRules">
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
          <el-form-item label="类型名称：" :label-width="formLabelWidth" prop="flowTypeName">
            <el-input v-model="typeForm.flowTypeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="序号：" :label-width="formLabelWidth" prop="sortNo">
            <el-input v-model="typeForm.sortNo" autocomplete="off" disabled></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogType.show = false">取 消</el-button>
          <el-button type="primary" @click="submitType()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { UploadIForm } from "../../../api/uplaod";
import { CreatOrUpdateFlowType } from "../../../api/flow";

import Bus from "../../../components/bus";

export default {
  name: "personnelGroup",
  props: {
    dialogType: Object,
    typeForm: Object
  },
  components: {},
  data() {
    return {
      formLabelWidth: "100px",
      typeRules: {
        icon: [{ required: true, message: "请输入名称", trigger: "blur" }],
        flowTypeName: [
          { required: true, message: "请输入简称", trigger: "blur" }
        ],
        sortNo: [{ required: true, message: "请输入通用名", trigger: "blur" }]
      },
      fileList: []
    };
  },
  mounted() {},
  methods: {
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
        this.typeForm.icon = res.result.enclosures[0].id;
      });
    },
    submitType() {
      this.$refs["typeForm"].validate(valid => {
        if (valid) {
          let token = localStorage.getItem("Token");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;

          CreatOrUpdateFlowType(this.typeForm)
            .then(res => {
              this.$nextTick(() => {
                this.$refs.typeForm.clearValidate();
                this.$refs.typeForm.resetFields();
              });
              this.dialogType.show = false;

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
.add_type .el-form-item__content {
  margin-left: 0 !important;
}
.add_type label.el-form-item__label {
  text-align: left;
  padding-left: 2%;
  font-size: 12px;
}
.type_add .el-dialog {
  width: 38%;
}
.add_type .el-dialog__body {
  padding: 10px 20px;
}
.add_type .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.add_type .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.add_type .el-form-item {
  margin-bottom: 0;
}
.add_type .el-cascader {
  width: 100% !important;
}
.add_type .el-input__inner {
  height: 35px;
  line-height: 35px;
}

.add_type input[type="file"] {
  display: none;
}
.add_type .el-dialog__headerbtn {
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