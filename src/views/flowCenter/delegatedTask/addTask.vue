<template>
  <div class="task_add">
    <el-dialog
      :title="dialogCreate.title"
      :visible.sync="dialogCreate.show"
      :close-on-click-modal="false"
    >
      <el-form :model="dataForm" ref="dataForm" :rules="dataFormRules">
        <el-form-item label="委托人：" :label-width="formLabelWidth" prop="delegateUserId">
          <el-select v-model="dataForm.delegateUserId" placeholder="请选择" filterable>
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id">
              <div @click="clickDelegate(item.id,item.name)">{{item.name}}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="被委托人：" :label-width="formLabelWidth" prop="principalId">
          <el-select v-model="dataForm.principalId" placeholder="请选择" filterable>
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id">
              <div @click="clickPrincipal(item.id,item.name)">{{item.name}}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始有效期：" :label-width="formLabelWidth" prop="staDate">
          <el-date-picker v-model="dataForm.staDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束有效期：" :label-width="formLabelWidth" prop="endDate">
          <el-date-picker v-model="dataForm.endDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>

        <el-form-item label="流程：" :label-width="formLabelWidth" prop="flow">
          <el-select v-model="dataForm.flow" multiple placeholder="请选择">
            <el-option
              v-for="item in flowList"
              :key="item.id"
              :label="item.flowName"
              :value="item.id"
            >
              <div @click="clickFlow(item.id,item.flowName)">{{item.flowName}}</div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="
          是否激活：" prop="isActive">
          <el-checkbox v-model="dataForm.isActive">是</el-checkbox>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate.show = false">取 消</el-button>
        <el-button type="primary" @click="submitPersonnelGroup()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { CreateDelegateTask } from "../../../api/flowCenter";
import { getFlowData } from "../../../api/flow";
import { getAllUser } from "../../../api/user";

export default {
  name: "personnelGroup",
  props: {
    dialogCreate: Object,
    dataForm: Object
  },
  data() {
    return {
      formLabelWidth: "110px",
      dataFormRules: {
        delegateUserId: [
          { required: true, message: "请选择委托人", trigger: "blur" }
        ],
        principalId: [
          { required: true, message: "请选择被委托人", trigger: "blur" }
        ],
        staDate: [
          { required: true, message: "请选择开始有效期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择结束有效期", trigger: "blur" }
        ],
        flow: [{ required: true, message: "请选择流程", trigger: "blur" }]
      },
      userList: [],
      flowList: []
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    clickDelegate(id, value) {
      this.dataForm.delegateUserId = id;
      this.dataForm.delegateUserName = value;
    },
    clickPrincipal(id, value) {
      this.dataForm.principalId = id;
      this.dataForm.principalName = value;
    },
    clickFlow(id, value) {
      var obj = {
        flowDefinitionId: id,
        flowName: value
      };
      this.dataForm.delegateTaskDetails.push(obj);
    },
    getUser() {
      getAllUser().then(res => {
        this.userList = res.result.items;
      });

      getFlowData().then(res => {
        this.flowList = res.result.items;
      });
    },
    submitPersonnelGroup() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let token = localStorage.getItem("Token");
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;

          delete this.dataForm.flow;

          console.log(this.dataForm);

          CreateDelegateTask(this.dataForm)
            .then(res => {
              this.$nextTick(() => {
                this.$refs.dataForm.clearValidate();
                this.$refs.dataForm.resetFields();
              });
              this.dialogCreate.show = false;

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
.task_add .el-form-item__content {
  margin-left: 0 !important;
}
.task_add label.el-form-item__label {
  text-align: left;
  padding-left: 2%;
  font-size: 12px;
}
.task_add .el-dialog {
  width: 38%;
}
.task_add .el-dialog__body {
  padding: 10px 20px;
}
.task_add .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.task_add .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.task_add .el-form-item {
  margin-bottom: 0;
}
.task_add .el-cascader {
  width: 100% !important;
}
.task_add .el-input__inner {
  height: 35px;
  line-height: 35px;
}
.task_add .el-dialog__headerbtn {
  top: 0;
}
</style>
<style scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}

.el-checkbox {
  margin-left: 40px;
}
</style>