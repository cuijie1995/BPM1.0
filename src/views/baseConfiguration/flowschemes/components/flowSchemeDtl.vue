<template>
  <div class="process-container">
    <el-form class="form-container" :model="processDesign" ref="processDesign">
      <div class="process-content">
        <!--流程设计-->

        <div class="editor-container" style="height: 100%;">
          <CreatedFlow
            ref="createdFlow"
            :form-template="currentForm"
            :isEdit="isEdit"
            :scheme-content="processDesign"
          ></CreatedFlow>
          <!-- :scheme-content="processDesign.flowContent" -->
        </div>
      </div>
      <div class="edit-btns text-center">
        <!-- <el-button
          size="small"
          v-loading="loading"
          style="margin-left: 10px;"
          type="primary"
          @click="preservation"
        >保存</el-button>-->
        <el-button
          size="small"
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import CreatedFlow from "@/components/CreatedFlow";
import CreatedForm from "@/components/Formcreated/components/CreatedForm";

import { CreaOrUpdateFlowData, getForEditFlow } from "../../../../api/flow";

const defaultFlow = {
  // 表单中的控件属性描述
};

export default {
  name: "flow-scheme-dtl",
  components: {
    CreatedFlow,
    CreatedForm
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      processDesign: Object.assign({}, defaultFlow),
      loading: false,
      forms: [],
      currentForm: null // 当前选中的form表单字段信息
    };
  },
  created() {
    if (this.isEdit) {
      this.getFlowData();
    } else {
      this.processDesign = Object.assign({}, defaultFlow);
    }
  },
  methods: {
    getFlowData() {
      if (localStorage.getItem("flowId")) {
        getForEditFlow({ Id: localStorage.getItem("flowId") })
          .then(res => {
            this.processDesign = res.result;

            this.processDesign.flowNodes.forEach(item => {
              var value = eval("(" + item.sponsor + ")");

              item.sponsor = value;
            });
            // console.log(this.processDesign);
            localStorage.removeItem("flowId");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    submitForm() {
      // debugger
      this.$refs.processDesign.validate(valid => {
        if (valid) {
          this.loading = true;
          this.processDesign = this.$refs.createdFlow.flowData;

          var starterType = typeof this.processDesign.starter;
          if (starterType == "object") {
            this.processDesign.starter = JSON.stringify(
              this.processDesign.starter
            );
          } else {
            this.processDesign.starter = this.processDesign.starter;
          }

          this.processDesign.flowNodes.forEach(item => {
            var str = typeof item.sponsor;
            if (str == "object") {
              item.sponsor = JSON.stringify(item.sponsor);
            } else {
              item.sponsor = item.sponsor;
            }
          });

          this.processDesign.flowNodes.forEach(item => {
            var str = typeof item.sponsorName;
            if (str == "object") {
              item.sponsorName = JSON.stringify(item.sponsorName);
            } else {
              item.sponsorName = item.sponsorName;
            }
          });

          this.processDesign.flowNodeMaps.forEach(item => {
            if (item.flowRules) {
              item.flowRules.forEach(element => {
                this.processDesign.flowRules.push(element);
              });
            }
          });
          this.processDesign.flowNodeMaps.forEach(item => {
            if (item.flowRules) {
              delete item.flowRules;
            }
          });
          this.processDesign.flowRules.forEach(item => {});
          if (this.processDesign.flowRules.length > 0) {
            var hash = [];
            for (var i = 0; i < this.processDesign.flowRules.length; i++) {
              for (
                var j = i + 1;
                j < this.processDesign.flowRules.length;
                j++
              ) {
                if (
                  this.processDesign.flowRules[i].id ===
                  this.processDesign.flowRules[j].id
                ) {
                  ++i;
                }
              }
              hash.push(this.processDesign.flowRules[i]);
            }

            this.processDesign.flowRules = hash;
          }

          console.log(this.processDesign);

          CreaOrUpdateFlowData(this.processDesign).then(res => {
            this.loading = false;
            this.$notify({
              title: "成功",
              type: "success",
              duration: 2000
            });

            this.$router.push("/flow");
          });
          this.loading = false;
        }
      });
    },
    preservation() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";

.process-container {
  margin: 10px;
  padding: 10px;
  background-color: white;
  height: calc(100% - 20px);
  .form-container {
    height: 100%;
  }
  .process-content {
    height: 100%;
    overflow: auto;
  }
  .process-main-container {
    max-width: 800px;
    margin: 0 auto;
    margin-top: 40px;
    position: relative;
    .process-main-model {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      cursor: not-allowed;
    }
  }
}

.steps {
  max-width: 1000px;
  margin: 0 auto;

  .el-step__main {
    margin-left: -21px;
  }
}

.edit-btns {
  padding: 20px;
  text-align: center;
}

.el-tabs--border-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  -webkit-box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12),
    0 0 6px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
