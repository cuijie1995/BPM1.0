<template>
  <div class="dynamic_form" style="height: 100%;overflow:hidden;">
    <el-container style="height: 100%;">
      <el-header style="padding: 0;height: 42px;">
        <div class="filter-container">
          <el-button
            type="primary"
            v-loading="loading"
            size="mini"
            class="filter-item"
            style="margin-left: 10px;"
            @click="submitForm"
          >保存</el-button>
        </div>
      </el-header>
      <el-main style="padding:0;height: calc(100% - 42px);">
        <el-container style="height: 100%;">
          <el-aside style="background: #fff;">
            <el-form :model="dynamicForm" ref="dynamicForm" :rules="rules" label-position="top">
              <div class="dynamic_main" style="margin: 0;height: 100%;">
               
                <el-form-item label="表单名称：" label-position="top" prop="name">
                  <el-input v-model="dynamicForm.name"></el-input>
                </el-form-item>

                <el-form-item label="摘要：" label-position="top" prop="remark">
                  <el-input type="textarea" v-model="dynamicForm.remark"></el-input>
                </el-form-item>

                <el-form-item label="表单类型：" label-position="top" prop="formType">
                  <el-select v-model="dynamicForm.formType" placeholder="请选择">
                    <el-option
                      v-for="item in typeForm"
                      :key="item.keyId"
                      :label="item.text"
                      :value="item.keyId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <div v-if="dynamicForm.formType === 2">
                  <el-form-item label="表单路径：" label-position="top" prop="formPath">
                    <el-select v-model="dynamicForm.formPath" placeholder="请选择">
                      <el-option
                        v-for="(item,index) in accessApi"
                        :key="index"
                        :label="item.apiPath"
                        :value="item.apiPath"
                      >
                        <span @click="changeAccessApi(item.apiPath,item.apiName)">{{item.apiPath}}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="数据接口：" label-position="top" prop="bindApi">
                    <el-input v-model="dynamicForm.bindApi" disabled></el-input>
                  </el-form-item>

                  <!-- <el-form-item label="标识属性：" label-position="top" prop="identificationField">
                    <el-input v-model="dynamicForm.identificationField"></el-input>
                  </el-form-item>-->
                </div>
              </div>
            </el-form>
          </el-aside>
          <el-main style="padding:0;">
            <div
              class="dynamic_container"
              style="height: 100%;"
              v-if="dynamicForm.formType === 2 || dynamicForm.formType === 1"
            >
              <FormContainer
                ref="contentDataForm"
                :edit-info="editInfo"
                :formType="dynamicForm.formType"
              ></FormContainer>
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import FormContainer from "@/components/Formcreated/index";
import {
  CreateOrUpdateFormData,
  getDetailFormData
} from "../../../../api/form";
import { getFormTypeData, getAccessApi } from "../../../../api/base";

const defaultForm = {
  id: "",
  code: "",
  name: "",
  formType: 1,
  contentData: "",
  formPath: "",
  bindApi: "",
  identificationField: "",
  remark: ""
};

export default {
  name: "form-detail",
  components: {
    FormContainer
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dynamicForm: Object.assign({}, defaultForm),
      loading: false,
      FormID: "",
      rules: {
        // code: [
        //   { required: true, message: "表单名称为必填属性", trigger: "blur" }
        // ],

        name: [
          { required: true, message: "表单名称为必填属性", trigger: "blur" }
        ],

        formType: [
          { required: true, message: "表单类型为必选属性", trigger: "blur" }
        ],

        formPath: [
          { required: true, message: "表单路径为必填属性", trigger: "blur" }
        ],
        bindApi: [
          { required: true, message: "绑定取数接口为必填属性", trigger: "blur" }
        ],
        identificationField: [
          { required: true, message: "绑定标识属性为必填属性", trigger: "blur" }
        ]
      },
      typeForm: [],
      accessApi: []
    };
  },
  computed: {
    editInfo() {
      return (
        (this.dynamicForm.contentData &&
          JSON.parse(this.dynamicForm.contentData)) ||
        {}
      );
    }
  },
  mounted() {
    this.dynamicForm.formType =
      this.$route.query["formType"] !== undefined
        ? this.$route.query["formType"]
        : 2;
    if (!this.isEdit) {
      this.dynamicForm = Object.assign({}, defaultForm);
    } else {
      // ueditor需要准备好了调用数据，frmtype为2时，不调用ueditor
      if (Number(this.dynamicForm.formType) !== 0) {
        const id = this.$route.params && this.$route.params.id;
        this.fetchData({
          id: id
        });
      }
    }

    this.getFormData();
    this.getFormType();
  },
  watch: {
    "dynamicForm.formType": function() {
      // console.log(this.dynamicForm.formType);
      if (this.dynamicForm.formType == 0) {
        localStorage.setItem("num", this.dynamicForm.formType);
      }
    }
  },

  methods: {
    getFormType() {
      getFormTypeData()
        .then(res => {
          this.typeForm = res.result;
        })
        .catch(err => {
          console.log(err);
        });

      getAccessApi()
        .then(res => {
          this.accessApi = res.result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeAccessApi(value, name) {
      this.dynamicForm.bindApi = name;
      this.dynamicForm.identificationField = "id";
    },
    getFormData() {
      this.FormID = localStorage.getItem("formId");
      this.Num = localStorage.getItem("Det");
      if (this.FormID) {
        getDetailFormData({ Id: this.FormID }).then(res => {
          this.dynamicForm = res.result;
          localStorage.removeItem("formId");
        });
      }
    },
    fetchData(id) {
      forms
        .get(id)
        .then(response => {
          this.dynamicForm = response.result;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm() {
      this.dynamicForm.contentData = JSON.stringify(
        this.$refs.contentDataForm.handleGenerateJson()
      );

      this.$refs.dynamicForm.validate(valid => {
        if (valid) {
          this.loading = true;
          CreateOrUpdateFormData(this.dynamicForm).then(() => {
            this.$router.push("/form");
            this.loading = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dynamic_form {
  position: relative;

  .dynamic_main {
    margin: 10px;
    background-color: white;
    padding: 10px;
    padding-top: 0;

    .dynamic_container {
      min-height: 500px;
      margin: 0 0 30px;
    }
  }
}

.filter-container {
  text-align: right;
}
.el-select {
  width: 100%;
}
</style>
<style>
.dynamic_main .el-form-item__label {
  height: 30px;
  line-height: 30px;
  padding: 0;
}

.developer_form {
  width: 90%;
  margin-left: 5%;
  background: #ffffff;
  height: 100%;
  padding: 5%;
}
</style>
