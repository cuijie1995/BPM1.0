<template>
  <!-- 右侧侧边栏 -->
  <div style="height: 100%;" class="flow-attr-box">
    <el-tabs size="small" :value="activeKey" style="height: 100%;">
      <el-tab-pane name="flow-attr" disabled>
        <span slot="label">
          <i class="el-icon-s-operation" />
          流程属性
        </span>

        <el-form ref="flowDataForm" :model="flowData">
          <el-form-item
            size="small"
            label="表单对象："
            prop="formDefinitionId"
            :rules="[{ required: true, message: '请选择表单对象', trigger: 'blur' }]"
          >
            <el-select
              v-model="flowData.formDefinitionId"
              filterable
              :default-first-option="true"
              placeholder="请选择"
              @change="clickChange"
            >
              <el-option
                v-for="item in formList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            size="small"
            label="流程标题："
            prop="flowTitle"
            :rules="[{ required: true, message: '请选择流程标题', trigger: 'blur' }]"
          >
            <el-select
              v-model="flowData.flowTitle"
              :default-first-option="true"
              filterable
              placeholder="请选择流程标题"
            >
              <el-option
                v-for="item in titleList"
                :key="item.token"
                :label="item.name"
                :value="item.token"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            size="small"
            label="流程类别："
            prop="flowTypeId"
            :rules="[{ required: true, message: '请选择流程类别', trigger: 'blur' }]"
          >
            <el-select
              v-model="flowData.flowTypeId"
              :default-first-option="true"
              filterable
              placeholder="请选择流程类别"
            >
              <el-option
                v-for="item in flowTypeList"
                :key="item.id"
                :label="item.flowTypeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            size="small"
            label="流程名称："
            prop="flowName"
            :rules="[{ required: true, message: '请输入流程名称', trigger: 'blur' }]"
          >
            <el-input v-model="flowData.flowName" placeholder="流程名称"></el-input>
          </el-form-item>

          <el-form-item size="small" label="图标：" prop="starter">
            <el-button size="small" type="primary" @click="clickImg">请选择图标</el-button>

            <div class="myBiaoZhu" id="myBiaoZhuDiv">
              <img
                id="myBiaoZhu"
                src="../../../assets/404_images/办公网2.png"
                alt
                style="display:none"
              />

              <div
                id="selectImg"
                :style="{backgroundPositionY:'-' + imgY  + 'px'  ,backgroundPositionX:'-' +imgX + 'px'}"
                style="display:none"
              ></div>
            </div>
          </el-form-item>

          <el-form-item
            size="small"
            label="启动权限："
            prop="starter"
            :rules="[{ required: true, message: '请选择启动权限', trigger: 'blur' }]"
          >
            <el-button size="small" type="primary" @click="executorFlow">请选择启动权限</el-button>

            <div style="color:#67C23A;font-size:10px" v-if="flowData.starterName != ''">
              您选择的权限为：
              <span>
                <span>{{flowData.starterName}}</span>
              </span>
            </div>
          </el-form-item>

          <el-form-item size="small" label="备注：" prop="remark">
            <el-input v-model="flowData.remark"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="node-attr" disabled>
        <span slot="label">
          <i class="el-icon-notebook-2" />
          节点属性
        </span>
        <template v-if="currentSelect && currentSelect.id">
          <el-form :rules="rules" ref="dataForm" :model="currentSelect">
            <el-form-item size="small" :label="'节点代号：'" prop="nodeCode" style="display:none">
              <el-input v-model="currentSelect.nodeCode"></el-input>
            </el-form-item>

            <el-form-item size="small" :label="'节点名称：'" prop="nodeName">
              <el-input v-model="currentSelect.nodeName"></el-input>
            </el-form-item>

            <el-form-item size="small" :label="'节点类别：'" prop="flowNodeType">
              <div v-if="nodeType.defaultIcon == 'iconfont icon-kaishi1'">
                <span v-model="currentSelect.flowNodeType = 1">开始节点</span>
              </div>

              <div v-if="nodeType.defaultIcon == 'iconfont icon-gongzuo1'">
                <span v-model="currentSelect.flowNodeType = 2">工作节点</span>
              </div>
              <div v-if="nodeType.defaultIcon == 'iconfont icon-zidong1'">
                <span v-model="currentSelect.flowNodeType = 3">自动节点</span>
              </div>
              <div v-if="nodeType.defaultIcon == 'iconfont icon-huiqian1'">
                <span v-model="currentSelect.flowNodeType = 4">会签节点</span>
              </div>
              <div v-if="nodeType.defaultIcon == 'iconfont icon-jieshu'">
                <span v-model="currentSelect.flowNodeType = 5">结束节点</span>
              </div>
            </el-form-item>

            <el-form-item size="small" :label="'流入类别：'" prop="inFlowType">
              <el-select v-model="currentSelect.inFlowType">
                <el-option
                  v-for="item in InflowTypeEnum"
                  :key="item.keyId"
                  :label="item.text"
                  :value="item.keyId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item size="small" :label="'流出类别：'" prop="outFlowType">
              <el-select v-model="currentSelect.outFlowType">
                <el-option
                  v-for="item in OutFlowTypeEnum"
                  :key="item.keyId"
                  :label="item.text"
                  :value="item.keyId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              size="small"
              :label="'执行人：'"
              v-if="nodeType.defaultIcon != 'iconfont icon-kaishi1' && nodeType.defaultIcon != 'iconfont icon-jieshu' && nodeType.defaultIcon != 'iconfont icon-zidong1'"
            >
              <el-button size="small" type="primary" @click="executor">请选择执行人</el-button>

              <div v-if="sponsor_name != ''" style="color:#67C23A;font-size:10px">
                您选择的执行人为：
                <span>{{sponsor_name}}</span>
              </div>
            </el-form-item>

            <el-form-item
              size="small"
              :label="'流程办理时间(小时)：'"
              prop="timeOutHours"
              v-if="nodeType.defaultIcon != 'iconfont icon-kaishi1' && nodeType.defaultIcon != 'iconfont icon-jieshu'"
            >
              <el-input v-model="currentSelect.timeOutHours"></el-input>
            </el-form-item>

            <el-form-item
              size="small"
              :label="'超时提醒方式：'"
              prop="timeOutHandling"
              v-if="nodeType.defaultIcon != 'iconfont icon-kaishi1' && nodeType.defaultIcon != 'iconfont icon-jieshu'"
            >
              <el-select v-model="currentSelect.timeOutHandling" placeholder="请选择">
                <el-option
                  v-for="item in TimeOutHandlingEnum"
                  :key="item.keyId"
                  :label="item.text"
                  :value="item.keyId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              size="small"
              label="任务分配方式："
              prop="taskAssignmentType"
              v-if="nodeType.defaultIcon != 'iconfont icon-kaishi1' && nodeType.defaultIcon != 'iconfont icon-jieshu' && nodeType.defaultIcon != 'iconfont icon-zidong1'"
              :rules="[{ required: true, message: '请选择任务分配方式', trigger: 'blur' }]"
            >
              <el-select v-model="currentSelect.taskAssignmentType" placeholder="请选择">
                <el-option label="全部分配" :value="currentSelect.taskAssignmentType"></el-option>
                <el-option
                  v-for="item in TaskAssignmentTypeEnum"
                  :key="item.keyId"
                  :label="item.text"
                  :value="item.keyId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane name="link-attr" disabled>
        <span slot="label">
          <i class="iconfont icon-Connection" />
          连线属性
        </span>
        <el-form :label-position="'top'">
          <el-form-item size="small" label="上游节点：" style="display:none">
            <el-input v-model="currentSelect.flowNodeParentId" disabled />
          </el-form-item>
          <el-form-item size="small" label="下游节点：" style="display:none">
            <el-input v-model="currentSelect.flowNodeChildId" disabled />
          </el-form-item>
          <el-form-item size="small" label="文字：">
            <el-input v-model="currentSelect.linkName" @change="linkLabelChange" />
          </el-form-item>

          <el-form-item style="display: inline-block;" size="small" label="字段条件：">
            <div>
              <el-button size="small" type="primary" @click="changeRules(currentSelect.id)">请填写字段条件</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <FlowExecutor
      :dialogCus="dialogCus"
      @checkContent="checkContent"
      :currentSelect="currentSelect"
      ref="child"
    ></FlowExecutor>

    <FlowTypeExecutor
      :dialogTypeExecutor="dialogTypeExecutor"
      @checkSponor="checkSponor"
      :flowData="flowData"
      ref="childStart"
    ></FlowTypeExecutor>

    <FlowRules
      :dialogRules="dialogRules"
      :linkId="linkId"
      @clickRules="clickRules"
      :arrRules="arrRules"
      :currentSelect="currentSelect"
      :titleList="titleList"
      :flowData="flowData"
      ref="childRules"
    ></FlowRules>
  </div>
</template>

<script>
let self;

import jsplumb from "jsplumb";
import util from "../util/util.js";
import { ZFSN } from "../util/ZFSN.js";
import FlowExecutor from "./FlowExecutor";
import FlowTypeExecutor from "./FlowTypeExecutor";
import FlowRules from "./FlowRules";
import { getFormData } from "../../../api/form";
import {
  getForEditFlow,
  GetAttributeEnum,
  GetFlowTypes
} from "../../../api/flow";
import {
  getFlowNodeTypeEnum,
  getInFlowTypeEnum,
  getOutFlowTypeEnum,
  getTaskAssignmentTypeEnum,
  getTimeOutHandlingEnum,
  getFlowRoleConnectorEnum,
  getFlowRoleOperatorEnum
} from "../../../api/base";
import { getDetailUser } from "../../../api/user";
import { getByIdPost } from "../../../api/post";
import { getDetailRole } from "../../../api/role";
import { getDetailOrganize } from "../../../api/organization";

export default {
  props: ["plumb", "flowData", "select", "formTemplate"],
  components: {
    jsplumb,
    FlowExecutor,
    FlowRules,
    FlowTypeExecutor
  },
  data() {
    return {
      imgX: "",
      imgY: "",
      currentSelect: this.select,
      rules: {
        inFlowType: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        outFlowType: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
      },
      activeKey: "flow-attr",
      centerDialogVisible: false,

      FlowNodeTypeEnum: [],
      InflowTypeEnum: [],
      OutFlowTypeEnum: [],
      TaskAssignmentTypeEnum: [],
      TimeOutHandlingEnum: [],
      FlowRoleConnectorEnum: [],
      FlowRoleOperatorEnum: [],
      linkId: "",
      dialogCus: {
        show: false,
        title: "",
        option: "create"
      },
      dialogRules: {
        show: false,
        title: "",
        option: "create"
      },
      dialogTypeExecutor: {
        show: false,
        title: ""
      },
      FlowId: "",
      nodeType: null,
      rulesFlow: [],
      arrRules: [],
      name: "",
      titleList: [],
      flowTypeList: [],
      sponsor_name: "",
      titleListId: "",
      formList: [],
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10
      },
      currentSelect: {
        taskAssignmentType: 1
      },
      banMa: [], //斑马线的数组

      canBiaoZhu: false, //是否可以进行标注
      pointColor: "red", //点的颜色
      pointSize: 10, //点的大小
      imgShow: false
    };
  },
  created() {},
  mounted() {
    self = this;
    self.getFormList();

    self.FlowId = localStorage.getItem("flowId");
    if (self.FlowId) {
      self.getFlowData();
    }
    self.getTitle();

    self.getFlowNode();

    self.currentSelect.taskAssignmentType = "1";

    document.getElementById("myBiaoZhu").oncontextmenu = e => {
      if (e && e.preventDefault) {
        //阻止默认浏览器动作(W3C)
        e.preventDefault();
      } else {
        //IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
      }
      return false;
    }; //阻止冒泡行为和默认右键菜单事件
    document.getElementById("myBiaoZhu").onmousedown = e => {
      e = e || window.event;
      var x = e.offsetX || e.layerX;
      var y = e.offsetY || e.layerY;

      if (x > 11 && x < 96) {
        x = 11;
      }
      if (x > 96 && x < 182) {
        x = 96;
      }
      if (x > 182) {
        x = 162;
      }
      if (y > 12 && y < 111) {
        y = 12;
      }
      if (y > 111 && y < 197) {
        y = 111;
      }
      if (y > 197) {
        y = 167;
      }
      self.flowData.topSize = y;
      self.flowData.leftSize = x;
      var myImg = document.querySelector("#myBiaoZhu");
      var currWidth = myImg.clientWidth;
      var currHeight = myImg.clientHeight;
      var ProportionWidthInImg = x / currWidth;
      var ProportionHeightInImg = y / currHeight;

      this.banMa.push({
        id: this.banMa.length + 1,
        x,
        y
      });

      this.createMarker(x, y);
    };
    // }
  },
  methods: {
    clickImg() {
      document.getElementById("myBiaoZhu").style.display = "block";
    },
    //画点
    createMarker(x, y) {
      if (x == 11) {
        x = 0;
      }
      if (x == 96) {
        x = 56;
      }

      if (x == 162) {
        x = 120;
      }
      if (y == 12) {
        y = 0;
      }
      if (y == 111) {
        y = 61;
      }
      if (y == 167) {
        y = 120;
      }

      this.imgX = x;
      this.imgY = y;

      document.getElementById("myBiaoZhu").style.display = "none";
      document.getElementById("selectImg").style.display = "block";
    },
    getTitle() {
      if (localStorage.getItem("titleId")) {
        GetAttributeEnum({ id: localStorage.getItem("titleId") }).then(res => {
          self.titleList = res.result;
        });
      }
    },
    clickChange(val) {
      self.titleListId = val;
      localStorage.setItem("titleId", val);

      self.getTitle();
    },
    getFlowData() {
      if (localStorage.getItem("flowId")) {
        getForEditFlow({ Id: localStorage.getItem("flowId") }).then(res => {
          self.currentSelect = res.result;
          self.flowData.flowRules = res.result.flowRules;
          localStorage.removeItem("flowId");
        });
      }
    },
    executorFlow() {
      self.imgShow = false;
      self.dialogTypeExecutor = {
        show: true,
        title: "选择流程执行人",
        option: "create"
      };
      if (self.flowData.starterName != "") {
        self.$refs.childStart.sonFun(self.flowData);
      }
    },
    checkSponor(value, name) {
      self.flowData.starter = value;
      self.flowData.starterName = name;
    },
    executor() {
      self.dialogCus = {
        show: true,
        title: "选择执行人",
        option: "create"
      };
      if (self.currentSelect.sponsor) {
        self.$refs.child.sponsorData(self.currentSelect.sponsor);
      }
    },
    checkContent(data, name) {
      self.currentSelect.sponsor = data;
      self.currentSelect.sponsorName = name;
      self.sponsor_name = name;
    },
    changeRules(id) {
      if (self.flowData.formDefinitionId) {
        localStorage.setItem("titleId", self.flowData.formDefinitionId);
        self.dialogRules = {
          show: true,
          title: "添加字段条件",
          option: "create"
        };

        self.$refs.childRules.getTitle();
      } else {
        self.$message.error("请选择表单");
      }
    },
    clickRules(data) {
      self.currentSelect.flowRules = data;
    },
    getLinkId() {
      self.linkId = self.linkId;
    },
    getFormList() {
      getFormData(self.listQuery).then(res => {
        self.formList = res.result.items;
      });

      GetFlowTypes()
        .then(res => {
          self.flowTypeList = res.result;
        })
        .catch(err => {});
    },
    getFlowNode() {
      getFlowNodeTypeEnum().then(res => {
        self.FlowNodeTypeEnum = res.result;
      });

      getInFlowTypeEnum().then(res => {
        self.InflowTypeEnum = res.result;
        self.currentSelect.inFlowType = self.InflowTypeEnum[0].keyId;
      });

      getOutFlowTypeEnum().then(res => {
        self.OutFlowTypeEnum = res.result;
        self.currentSelect.outFlowType = self.OutFlowTypeEnum[0].keyId;
      });

      getTaskAssignmentTypeEnum().then(res => {
        self.TaskAssignmentTypeEnum = res.result;
        self.currentSelect.taskAssignmentType =
          self.TaskAssignmentTypeEnum[0].keyId;
      });

      getTimeOutHandlingEnum().then(res => {
        self.TimeOutHandlingEnum = res.result;
        self.currentSelect.timeOutHandling = self.TimeOutHandlingEnum[0].keyId;
      });

      getFlowRoleConnectorEnum().then(res => {
        self.FlowRoleConnectorEnum = res.result;
      });

      getFlowRoleOperatorEnum().then(res => {
        self.FlowRoleOperatorEnum = res.result;
      });
    },
    linkLabelChange(value) {
      const that = this;
      const linkName = value;

      that.currentSelect.linkName = linkName;
      const conn = that.plumb.getConnections({
        source: that.currentSelect.flowNodeParentId,
        target: that.currentSelect.flowNodeChildId
      })[0];
      if (linkName !== "") {
        conn.setLabel({
          label: linkName,
          cssClass: "linkLabel"
        });
      } else {
        const labelOverlay = conn.getLabelOverlay();
        if (labelOverlay) conn.removeOverlay(labelOverlay.id);
      }
    }
  },
  watch: {
    select: {
      handler(val) {
        self.currentSelect = val;

        if (self.currentSelect.type === "sl") {
          self.linkId = self.currentSelect.id;
          self.getLinkId();
          self.activeKey = "link-attr";
        }
        if (!self.currentSelect.type) {
          self.activeKey = "flow-attr";
        }
        if (self.currentSelect.nodeName || self.currentSelect.nodeName == "") {
          self.activeKey = "node-attr";
        }
      },
      deep: true
    },
    currentSelect: {
      handler(val) {
        if (val.flowNodeType == 2) {
          if (!val.taskAssignmentType) {
            val.taskAssignmentType = 1;
          }
        }

        if (val.sponsorName) {
          self.sponsor_name = val.sponsorName;
        }
        if (!val.sponsorName) {
          self.sponsor_name = "";
        }

        if (val.flowNodeChildId) {
          self.arrRules = [];
          if (val.flowRules) {
            self.flowData.flowRules = self.flowData.flowRules.concat(
              val.flowRules
            );
          } else if (!val.flowRules && self.flowData.flowRules.length > 0) {
            for (var i = 0; i < self.flowData.flowRules.length; i++) {
              var item = self.flowData.flowRules[i];
              if (item.flowNodeMapId == val.id) {
                self.arrRules.push(item);
              }
            }
          }
        }
        self.nodeType = val;
        self.$emit("update:select", val);
      },
      deep: true
    },
    flowData: {
      handler(val) {},
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "../style/flow-attr.scss";
.flow-attr-box {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__item.is-active {
    color: #409eff !important;
  }
  .el-tabs__item.is-disabled {
    color: #333;
  }
  .el-tabs__content {
    height: calc(100% - 40px);
    overflow: auto;
    padding: 0 10px;
  }

  .el-select.el-select--small {
    width: 100%;
  }

  .el-dialog__body {
    padding: 10px 30px;
  }

  ul {
    border: #e4e4e4 1px solid;
    width: 265px;
    padding: 0 0 0 10px;
  }
  li {
    list-style: none;
  }
}

#myBiaoZhuDiv {
  position: relative;
  img {
    // border: solid 1px #000;
    display: inline-block;
    // margin: 100px 100px;
    z-index: 1;
  }
  .marker {
    position: absolute;
    border-radius: 50%;
    z-index: 999;
  }
}
</style>
<style  scoped>
img {
  width: 300px;
}

#selectImg {
  width: 60px;
  height: 60px;
  /* margin: 0 auto; */
  background-image: url("../../../assets/404_images/办公网2.png");
}
</style>
