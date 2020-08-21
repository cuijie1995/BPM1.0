<template>
  <div class="flow_rule">
    <el-dialog
      :title="dialogRules.title"
      :visible.sync="dialogRules.show"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div class="field">
        <el-row :gutter="2" v-for="(flowRule, index) in dataFlow.flowRule" :key="index">
          <el-col :span="1">
            <span class="sort" v-model="flowRule.sortNo=index+1">{{index+1}}</span>
          </el-col>
          <el-col :span="2">
            <el-input v-model="flowRule.leftBrackets" placeholder="左括号" />
          </el-col>
          <el-col :span="3">
            <!-- <el-input v-model="flowRule.customPropertie" type="text" placeholder="属性名称" /> -->
            <el-select v-model="flowRule.customType" placeholder="请选择类型">
              <el-option
                v-for="item in FlowCustomTypeEmun"
                :key="item.keyId"
                :label="item.text"
                :value="item.keyId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="flowRule.customPropertie" placeholder="请选择属性名称">
              <el-option
                v-for="item in titleList"
                :key="item.token"
                :label="item.name"
                :value="item.token"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="flowRule.operator" placeholder="选择操作符">
              <el-option
                v-for="item in FlowRoleOperatorEnum"
                :key="item.keyId"
                :label="item.text"
                :value="item.keyId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input v-model="flowRule.value" placeholder="值" />
          </el-col>
          <el-col :span="2">
            <el-input v-model="flowRule.rightBrackets" placeholder="右括号" />
          </el-col>
          <el-col :span="3">
            <el-select v-model="flowRule.connector" clearable placeholder="选择连接符">
              <el-option
                v-for="item in FlowRoleConnectorEnum"
                :key="item.keyId"
                :label="item.text"
                :value="item.keyId"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="2">
            <div class="button_icon">
              <div class="icon">
                <span :class="[index == 0 ? 'disabled' : '']" @click="top(index)">
                  <i class="el-icon-caret-top"></i>
                </span>
                <span
                  :class="[index == dataFlow.flowRule.length - 1 ? 'disabled' : '']"
                  @click="bottom(index)"
                >
                  <i class="el-icon-caret-bottom"></i>
                </span>
              </div>

              <el-button type="primary" class="el-icon-plus" v-if="index == 0" @click="btnAdd"></el-button>
              <el-button
                type="danger"
                class="el-icon-delete"
                v-if="index != 0"
                @click="btnDel(index,flowRule)"
              ></el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRules.show = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { ZFSN } from "../util/ZFSN.js";
import {
  getFlowRoleConnectorEnum,
  getFlowRoleOperatorEnum,
  getFlowCustomTypeEmun
} from "../../../api/base";
import { getForEditFlow, GetAttributeEnum } from "../../../api/flow";

export default {
  props: {
    dialogRules: Object,
    linkId: String,
    arrRules: Array,
    currentSelect: Object,
    flowData: Object
    // titleList: Array
  },
  name: "FlowRules",
  data() {
    return {
      dataFlow: {
        flowRule: [
          {
            sortNo: "",
            customType: 1,
            customPropertie: "",
            operator: "",
            value: "",
            connector: "",
            flowNodeMapId: this.linkId,
            id: ZFSN.getId()
          }
        ]
      },
      FlowRoleConnectorEnum: [],
      FlowRoleOperatorEnum: [],
      FlowCustomTypeEmun: [],
      titleList: []
    };
  },
  mounted() {
    this.getData();
    // this.getTitle();
  },
  methods: {
    getTitle() {
      if (localStorage.getItem("titleId")) {
        GetAttributeEnum({ id: localStorage.getItem("titleId") }).then(res => {
          this.titleList = res.result;
        });
      }
    },
    getData() {
      getFlowRoleConnectorEnum().then(res => {
        this.FlowRoleConnectorEnum = res.result;
      });

      getFlowRoleOperatorEnum().then(res => {
        this.FlowRoleOperatorEnum = res.result;
      });

      getFlowCustomTypeEmun().then(res => {
        this.FlowCustomTypeEmun = res.result;
      });
    },
    top(index) {
      if (index < 1) {
        return false;
      }
      // 复制当前控件
      const tmp = this.dataFlow.flowRule[index];
      // 再删除控件+占位坑
      this.dataFlow.flowRule.splice(index, 1);
      // 再插入控件
      this.dataFlow.flowRule.splice(index - 1, 0, tmp);
    },
    bottom(index) {
      if (index === this.dataFlow.flowRule.length - 1) {
        return false;
      }
      // 复制当前控件
      const tmp = this.dataFlow.flowRule[index];
      // 再删除控件+占位坑
      this.dataFlow.flowRule.splice(index, 1);
      // 再插入控件
      this.dataFlow.flowRule.splice(index + 1, 0, tmp);
    },
    btnAdd() {
      // console.log(this.dataFlow.flowRule.length)
      this.dataFlow.flowRule.push({
        sortNo: "",
        customType: 1,
        customPropertie: "",
        operator: "",
        value: "",
        connector: "",
        flowNodeMapId: this.linkId,
        id: ZFSN.getId()
      });
    },
    btnDel(e, data) {
      this.dataFlow.flowRule.splice(e, 1);
      this.flowData.flowRules.forEach((element, index) => {
        if (element.id == data.id) {
          this.flowData.flowRules.splice(index, 1);
        }
      });
    },
    confirm() {
      this.dataFlow.flowRule.forEach(item => {
        item.flowNodeMapId = this.linkId;
      });

      // console.log(this.dataFlow.flowRule);
      this.$emit("clickRules", this.dataFlow.flowRule);
      this.dialogRules.show = false;
    }
  },
  watch: {
    arrRules: {
      handler: function(value) {
        // console.log(value);
        if (value.length > 0) {
          this.dataFlow.flowRule = value;
        }
        // if (value.length == 0) {
        //   this.flowData.flowRules = [
        //     {
        //       sortNo: "",
        //       customType: 1,
        //       customPropertie: "",
        //       operator: "",
        //       value: "",
        //       connector: "",
        //       flowNodeMapId: this.linkId,
        //       id: ZFSN.getId()
        //     }
        //   ];
        // }
      },
      deep: true
    },
    currentSelect: {
      handler(value) {
        // console.log(value);

        if (value.flowNodeChildId) {
          if (value.flowRules && this.arrRules.length > 0) {
            this.dataFlow.flowRule = value.flowRules;
          } else if (value.flowRules && this.arrRules.length == 0) {
            this.dataFlow.flowRule = value.flowRules;
          } else if (!value.flowRules && this.arrRules.length > 0) {
            this.dataFlow.flowRule = this.arrRules;
          } else {
            this.dataFlow.flowRule = [
              {
                sortNo: "",
                customType: 1,
                customPropertie: "",
                operator: "",
                value: "",
                connector: "",
                flowNodeMapId: this.linkId,
                id: ZFSN.getId()
              }
            ];
          }
          this.flowData.flowRules.concat(this.dataFlow.flowRule);

          // console.log(this.flowData.flowRules);

          //  this.flowData.flowRules = this.flowData.flowRules.concat(
          //   this.dataFlow.flowRule
          // );
        }
      }
    }
  }
};
</script>
<style  lang="scss">
.flow_rule {
  .el-dialog {
    width: 60%;
  }
  .el-select {
    width: 100%;
  }

  .field i {
    font-size: 10px;
    margin-right: 10px;
    cursor: pointer;
    // display: block
  }

  .field .el-button {
    padding: 2px 10px !important;
  }
  .field .el-input {
    line-height: 55px !important;
  }
  .field .icon {
    height: 10px;
    line-height: 10px;
    margin-top: 10px;
  }

  .field .icon {
    .disabled {
      color: #e4e4e4;
    }
  }
  .sort {
    height: 55px;
    line-height: 55px;
  }

  .button_icon {
    display: none;

    .el-button {
      margin-top: 3px;
    }
  }

  .field .el-row:hover {
    .button_icon {
      display: block;
    }
  }

  .el-dialog__body {
    padding: 10px 30px;
  }

  input.el-input__inner {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
  .el-dialog__footer .el-button {
    padding: 7px 15px;
  }
}
</style>