<template>
  <div style="height: 100%;">
    <el-container class="containers">
      <el-header class="select-area" style="height: 150px;" v-if="!isShowContent">
        <div class="header">
          <el-row style="padding-bottom: 8px;">
            <el-col :span="4">
              <el-checkbox-button v-model="tag.checked0" class="tag">工具</el-checkbox-button>
            </el-col>
            <el-col :span="20">
              <div v-if="tag.checked0">
                <el-button-group>
                  <el-button
                    v-for="(tool, index) in field.tools"
                    :key="index"
                    size="mini"
                    :icon="tool.icon"
                    :type="currentTool.type == tool.type ? 'primary': 'default'"
                    @click="selectTool(tool.type)"
                    style="font-size: 16px;width: 100px;"
                  ></el-button>
                </el-button-group>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-checkbox-button v-model="tag.checked1" class="tag">基础节点</el-checkbox-button>
            </el-col>
            <el-col :span="20">
              <div v-if="tag.checked1">
                <draggable
                  tag="el-row"
                  :list="field.commonPoints"
                  v-bind="{group:{ name:'flow', pull:'clone',put:false},sort:false}"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <template v-for="(commonNode, index) in field.commonPoints">
                    <el-col :span="4" :key="index">
                      <div
                        class="node-item"
                        :nodeName="commonNode.nodeName"
                        belongTo="commonPoints"
                      >
                        <i style="font-size: 16px;" :class="commonNode.icon" />
                        {{ commonNode.nodeName }}
                      </div>
                    </el-col>
                  </template>
                </draggable>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-checkbox-button v-model="tag.checked3" class="tag">泳道节点</el-checkbox-button>
            </el-col>
            <el-col :span="20">
              <div align="center">
                <draggable
                  tag="el-row"
                  :list="field.lanes"
                  :grid="{ gutter: 8, column: 2 }"
                  v-if="tag.checked3"
                  v-bind="{group:{ name:'flow', pull:'clone',put:false},sort:false}"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <el-col :span="4" v-for="(laneNode, index) in field.lanes" :key="index">
                    <div class="node-item" :type="laneNode.nodeName" belongTo="lanes">
                      <el-icon style="font-size: 16px;" :class="laneNode.icon" />
                      {{ laneNode.nodeName }}
                    </div>
                  </el-col>
                </draggable>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-header>

      <el-container>
        <el-main style="padding:0;">
          <el-container style="height: 100%;">
            <el-header class="header-option" style="height: auto;" v-if="!isShowContent">
              <!-- <el-button type="warning" @click="see">查看流程图</el-button> -->
              <el-popover title="确认要重新绘制吗？" placement="bottom" v-model="isShowPopover">
                <div style="text-align: center;">
                  <el-button size="small" @click="isShowPopover = false">取消</el-button>
                  <el-button type="primary" size="small" @click="clear">确认</el-button>
                </div>
                <el-tooltip slot="reference" content="重新绘制" placement="bottom">
                  <el-button
                    class="header-option-button"
                    size="small"
                    type="primary"
                    icon="el-icon-refresh-left"
                  ></el-button>
                </el-tooltip>
              </el-popover>
            </el-header>

            <el-main class="content" style="padding: 0;">
              <flow-area
                v-if="loadFlowArea && flowData"
                ref="flowArea"
                :browserType="browserType"
                :flowData="flowData"
                :select.sync="currentSelect"
                :selectGroup.sync="currentSelectGroup"
                :plumb="plumb"
                :isShowContent="isShowContent"
                :currentTool="currentTool"
                :isDrag="isDrag"
                @findNodeConfig="findNodeConfig"
                @selectTool="selectTool"
                @getShortcut="getShortcut"
                @saveFlow="saveFlow"
              ></flow-area>
              <vue-context-menu :contextMenuData="linkContextMenuData" @deleteLink="deleteLink"></vue-context-menu>
            </el-main>
          </el-container>
        </el-main>

        <!-- 左边侧边栏   流程属性  节点属性  连线属性 -->
        <el-aside
          style="width:350px;height:400px"
          theme="light"
          class="attr-area"
          @mousedown.stop="loseShortcut"
          v-if="!isShowContent"
        >
          <flow-attr
            :plumb="plumb"
            :flowData="flowData"
            :formTemplate="formTemplate"
            :select.sync="currentSelect"
          ></flow-attr>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import FlowArea from "./modules/FlowArea";

import jsplumb from "jsplumb";
import { jsPlumb } from "jsplumb";
import { tools, commonPoints, lanes } from "./config/basic-node-config.js";
import { flowConfig } from "./config/args-config.js";

import {
  startSvg,
  endSvg,
  commonSvg,
  freedomSvg,
  gatewaySvg,
  eventSvg,
  childFlowSvg,
  xLaneSvg,
  yLaneSvg,
  lanePoolSvg
} from "./config/basic-icon-config.js";

import { ZFSN } from "./util/ZFSN.js";
import FlowAttr from "./modules/FlowAttr";
import { getForEditFlow } from "../../api/flow";

export default {
  name: "vfd",
  components: {
    Draggable,
    jsplumb,
    flowConfig,
    FlowArea,
    FlowAttr,
    StartIcon: { template: startSvg },
    EndIcon: { template: endSvg },
    CommonIcon: { template: commonSvg },
    FreedomIcon: { template: freedomSvg },
    GatewayIcon: { template: gatewaySvg },
    EventIcon: { template: eventSvg },
    ChildFlowIcon: { template: childFlowSvg },
    XLaneIcon: { template: xLaneSvg },
    YLaneIcon: { template: yLaneSvg },
    LanePoolIcon: { template: lanePoolSvg }
  },
  props: ["schemeContent", "isEdit", "formTemplate", "isShowContent"],
  mounted() {
    const that = this;

    that.dealCompatibility();
    if (!this.isEdit) {
      this.$nextTick(() => {
        that.initJsPlumb();
        that.initFlow();
      });
    } else {
      if (this.schemeContent && this.isEdit) {
        this.flowData = this.groupSchemeContent();
        this.status = flowConfig.flowStatus.MODIFY;
        this.initJsPlumb();
        this.loadFlow();
      }
    }
    that.listenShortcut();

    // that.getFlowData()
  },
  data() {
    return {
      isDrag: false,
      loadFlowArea: false,
      isShowPopover: false,
      tag: {
        checked0: true,
        checked1: true,
        checked2: true,
        checked3: true
      },
      browserType: 3,
      plumb: "",
      field: {
        tools: tools,
        commonPoints: commonPoints,
        lanes: lanes
      },
      flowData: {
        flowName: "",
        flowTitle: "",
        formDefinitionId: "",
        formDefinitionName: "",
        starter: "",
        starterName: "",
        flowNodes: [],
        flowNodeMaps: [],
        flowRules: [
          // {
          //   sortNo: "",
          //   customPropertie: "",
          //   operator: "",
          //   value: "",
          //   connector: "",
          //   flowNodeMapId: "",
          //   id: ZFSN.getId()
          // }
        ],
        remark: "",
        topSize: "",
        leftSize: ""
      },
      status: flowConfig.flowStatus.CREATE,
      currentTool: {
        type: "drag",
        icon: "drag",
        name: "拖拽"
      },
      currentSelect: {},

      currentSelectGroup: [],
      activeShortcut: true,
      linkContextMenuData: flowConfig.contextMenu.sl,
      flowPicture: {
        url: "",
        modalVisible: false,
        closable: false,
        maskClosable: false
      },
      flowDataId: ""
    };
  },
  watch: {
    currentSelect: {
      deep: true,
      handler: function() {
        var list =
          this.currentSelect.type === "sl"
            ? this.flowData.flowNodeMaps
            : this.flowData.flowNodes;

        // console.log(list);
        if (list == undefined) {
          list = [];
        }
        var index = list.findIndex(item => {
          item.id === this.currentSelect.id;
        });
        index >= 0 && this.$set(list, index, this.currentSelect);
        // console.log(this.currentSelect);
      }
    },
    schemeContent() {
      if (this.schemeContent && this.isEdit) {
        this.flowData = this.groupSchemeContent();
        this.status = flowConfig.flowStatus.MODIFY;
        this.plumb && this.plumb.deleteEveryConnection();
        this.initJsPlumb();
        this.loadFlow();
      }
    }
  },
  methods: {
    getFlowData() {
      if (localStorage.getItem("flowId")) {
        getForEditFlow({ Id: localStorage.getItem("flowId") })
          .then(res => {
            this.flowData = res.data.result;

            this.flowData.flowNodes.forEach(item => {
              var value = eval("(" + item.sponsor + ")");

              // console.log(value);

              item.sponsor = value;
            });
            // console.log(this.flowData.flowNodes);
            localStorage.removeItem("flowId");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    groupSchemeContent() {
      const obj = Object.assign(
        {},
        typeof this.schemeContent == "string"
          ? JSON.parse(this.schemeContent)
          : this.schemeContent
      );

      return obj;
    },
    // 开始拖动时的回调函数
    handleMoveStart({ oldIndex }) {
      this.isDrag = true;
    },
    // 拖动结束时的回调函数
    handleMoveEnd(evt) {
      this.isDrag = false;
    },
    // 移动单元时的回调函数
    handleMove(evt) {
      return true;
    },
    getBrowserType() {
      const userAgent = navigator.userAgent;
      const isOpera = userAgent.indexOf("Opera") > -1;
      if (isOpera) {
        return 1;
      }
      if (userAgent.indexOf("Firefox") > -1) {
        return 2;
      }
      if (userAgent.indexOf("Chrome") > -1) {
        return 3;
      }
      if (userAgent.indexOf("Safari") > -1) {
        return 4;
      }
      if (
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera
      ) {
        alert("IE浏览器支持性较差，推荐使用Firefox或Chrome");
        return 5;
      }
      if (userAgent.indexOf("Trident") > -1) {
        alert("Edge浏览器支持性较差，推荐使用Firefox或Chrome");
        return 6;
      }
    },
    dealCompatibility() {
      const that = this;

      that.browserType = that.getBrowserType();
      if (that.browserType === 2) {
        flowConfig.shortcut.scaleContainer = {
          code: 16,
          codeName: "SHIFT(chrome下为ALT)",
          shortcutName: "画布缩放"
        };
      }
    },

    // 初始化一个画布
    initJsPlumb() {
      const that = this;

      //  实例化一个jsPlumb
      that.plumb = jsPlumb.getInstance(flowConfig.jsPlumbInsConfig);

      this.loadFlowArea = true;
      this.plumb.ready(() => {
        // debugger;
        // 从一端到另一端建立连接时，需要做一些检查，如果不符合条件，就不让链接建立
        that.plumb.bind("beforeDrop", function(info) {
          const flowNodeParentId = info.sourceId;
          const flowNodeChildId = info.targetId;

          if (flowNodeParentId === flowNodeChildId) return false;
          // 过滤出来相同的点是不能重复连线的
          const filter = that.flowData.flowNodeMaps.filter(
            link =>
              link.flowNodeParentId === flowNodeParentId &&
              link.flowNodeChildId === flowNodeChildId
          );
          if (filter.length > 0) {
            // that.$message.error("同方向的两节点连线只能有一条！");
            return false; //返回值为false时，链接建立失败
          }
          return true; //返回值为true时，链接建立成功
        });
        let conunt = 0;
        that.plumb.bind("connection", (conn, e) => {
          const connObj = conn.connection.canvas;
          const o = {};
          let id = "";
          let linkName;

          if (
            that.status === flowConfig.flowStatus.CREATE ||
            that.status === flowConfig.flowStatus.MODIFY
          ) {
            id = ZFSN.getId();
            linkName = "";
          } else if (that.status === flowConfig.flowStatus.LOADING) {
            const l = that.flowData.flowNodeMaps[conunt];
            id = l.id;
            linkName = l.linkName;
            conunt++;
          }

          connObj.id = id;
          o.type = "sl";
          o.id = id;
          o.flowNodeParentId = conn.sourceId;
          o.flowNodeChildId = conn.targetId;
          o.linkName = linkName;
          o.linkType = flowConfig.jsPlumbInsConfig.Connector[0];
          o.linkColor = flowConfig.jsPlumbInsConfig.PaintStyle.stroke;
          o.linkThickness = flowConfig.jsPlumbInsConfig.PaintStyle.strokeWidth;

          document
            .getElementById(id)
            .addEventListener("contextmenu", function(e) {
              that.showLinkContextMenu(e);
              that.currentSelect = that.flowData.flowNodeMaps.filter(
                l => l.id === id
              )[0];
            });

          document.getElementById(id).addEventListener("click", function(e) {
            const event = window.event || e;
            event.stopPropagation();
            that.currentSelect = that.flowData.flowNodeMaps.filter(
              l => l.id === id
            )[0];
            that.flowData.flowRules = that.flowData.flowRules || that.flowRules;
          });
          if (that.status !== flowConfig.flowStatus.LOADING)
            that.flowData.flowNodeMaps.push(o);
        });

        // 全局修改默认的参数
        // ConnectionsDetachable   : true,//连接是否可以使用鼠标默认分离
        that.plumb.importDefaults({
          ConnectionsDetachable: flowConfig.jsPlumbConfig.conn.isDetachable
        });
      });
    },
    listenShortcut() {
      const that = this;
      document.onkeydown = function(e) {
        const event = window.event || e;

        if (!that.activeShortcut) return;
        const key = event.keyCode;

        switch (key) {
          case flowConfig.shortcut.multiple.code:
            that.$refs.flowArea.rectangleMultiple.flag = true;
            break;
          case flowConfig.shortcut.dragContainer.code:
            that.$refs.flowArea.container.dragFlag = true;
            break;
          case flowConfig.shortcut.scaleContainer.code:
            that.$refs.flowArea.container.scaleFlag = true;
            break;
          case flowConfig.shortcut.dragTool.code:
            that.selectTool("drag");
            break;
          case flowConfig.shortcut.connTool.code:
            that.selectTool("connection");
            break;
          case 37:
            that.moveNode("left");
            break;
          case 38:
            that.moveNode("up");
            break;
          case 39:
            that.moveNode("right");
            break;
          case 40:
            that.moveNode("down");
            break;
        }

        if (event.ctrlKey) {
          if (event.altKey) {
            switch (key) {
              case flowConfig.shortcut.settingModal.code:
                that.setting();
                break;
            }
          }
        }
      };
      document.onkeyup = function(e) {
        const event = window.event || e;

        const key = event.keyCode;
        if (key === flowConfig.shortcut.dragContainer.code) {
          that.$refs.flowArea.container.dragFlag = false;
        } else if (key === flowConfig.shortcut.scaleContainer.code) {
          event.preventDefault();
          that.$refs.flowArea.container.scaleFlag = false;
        } else if (key === flowConfig.shortcut.multiple.code) {
          that.$refs.flowArea.rectangleMultiple.flag = false;
        }
      };
    },

    initFlow() {
      const that = this;

      if (that.status === flowConfig.flowStatus.CREATE) {
        that.flowData.id = ZFSN.getId();
      } else {
        that.loadFlow();
      }
    },
    loadFlow(json) {
      const that = this;
      that.status = flowConfig.flowStatus.LOADING;
      this.plumb.ready(() => {
        const flowNodeMaps = Object.assign([], that.flowData.flowNodeMaps);
        that.$nextTick(() => {
          flowNodeMaps.forEach((link, index) => {
            const conn = that.plumb.connect({
              source: link.flowNodeParentId,
              target: link.flowNodeChildId,
              anchor: flowConfig.jsPlumbConfig.anchor.default,
              connector: [
                link.linkType,
                {
                  gap: 5,
                  cornerRadius: 8,
                  alwaysRespectStubs: true
                }
              ],
              paintStyle: {
                stroke: link.linkColor,
                strokeWidth: link.linkThickness
              }
            });

            if (link.linkName !== "") {
              conn.setLabel({
                label: link.linkName,
                cssClass: "linkLabel"
              });
            }
          });
          that.currentSelect = {};
          that.currentSelectGroup = [];
          that.status = flowConfig.flowStatus.MODIFY;
        });
      });
    },
    findNodeConfig(belongTo, nodeName, callback) {
      let node = null;

      switch (belongTo) {
        case "commonPoints":
          node = commonPoints.filter(n => n.nodeName === nodeName);
          break;
        case "lanes":
          node = lanes.filter(n => n.nodeName === nodeName);
          break;
      }
      if (node && node.length >= 0) node = node[0];

      callback(node);
    },
    selectTool(type) {
      const tool = tools.filter(t => t.type === type);
      if (tool && tool.length >= 0) this.currentTool = tool[0];

      switch (type) {
        case "drag":
          this.changeToDrag();
          break;
        case "connection":
          this.changeToConnection();
          break;
      }
    },
    changeToDrag() {
      const that = this;
      this.$nextTick(() => {
        that.flowData.flowNodes.forEach(function(node, index) {
          const f = that.plumb.toggleDraggable(node.id);

          if (!f) {
            that.plumb.toggleDraggable(node.id);
          }
          if (node.nodeName !== "横向泳道" && node.nodeName !== "纵向泳道") {
            that.plumb.unmakeSource(node.id);
            that.plumb.unmakeTarget(node.id);
          }
        });
      });
    },
    changeToConnection() {
      const that = this;
      that.flowData.flowNodes.forEach(function(node, index) {
        const f = that.plumb.toggleDraggable(node.id);
        if (f) {
          that.plumb.toggleDraggable(node.id);
        }
        if (node.nodeName !== "横向泳道" && node.nodeName !== "纵向泳道") {
          that.plumb.makeSource(
            node.id,
            flowConfig.jsPlumbConfig.makeSourceConfig
          );
          that.plumb.makeTarget(
            node.id,
            flowConfig.jsPlumbConfig.makeTargetConfig
          );
        }
      });

      that.currentSelect = {};
      that.currentSelectGroup = [];
    },
    checkFlow() {
      const that = this;
      const flowNodes = that.flowData.flowNodes;

      if (flowNodes.length <= 0) {
        this.$message.error("流程图中无任何节点！");
        return false;
      }
      return true;
    },
    saveFlow() {
      const that = this;
      const flowObj = Object.assign({}, that.flowData);

      if (!that.checkFlow()) return;
      flowObj.status = flowConfig.flowStatus.SAVE;
      const d = JSON.stringify(flowObj);
      this.$message.success("保存流程成功！请查看控制台。");
      return d;
    },
    see() {
      this.flowPicture.modalVisible = true;
    },

    clear() {
      const that = this;
      that.flowData.flowNodes.forEach(function(node, index) {
        that.plumb.remove(node.id);
      });
      that.currentSelect = {};
      that.currentSelectGroup = [];
      that.flowData.flowNodes = [];
      that.flowData.flowNodeMaps = [];
      that.flowData.remarks = [];
      this.isShowPopover = false;
    },
    setting() {
      this.$refs.settingModal.open();
    },
    shortcutHelper() {
      this.$refs.shortcutModal.open();
      this.isShowPopover = false;
    },
    usingDoc() {
      window.open(this.info.gitee);
      this.isShowPopover = false;
    },
    exit() {
      alert("退出流程设计器...");
    },
    showLinkContextMenu(e) {
      const event = window.event || e;
      event.preventDefault();
      event.stopPropagation();

      const x = event.clientX;
      const y = event.clientY;
      this.linkContextMenuData.axis = { x, y };
    },
    deleteLink() {
      const that = this;

      const flowNodeParentId = that.currentSelect.flowNodeParentId;
      const flowNodeChildId = that.currentSelect.flowNodeChildId;
      that.plumb.deleteConnection(
        that.plumb.getConnections({
          source: flowNodeParentId,
          target: flowNodeChildId
        })[0]
      );
      const { flowNodeMaps } = that.flowData;
      flowNodeMaps.splice(
        flowNodeMaps.findIndex(
          link =>
            link.flowNodeParentId === flowNodeParentId &&
            link.flowNodeChildId === flowNodeChildId
        ),
        1
      );
      that.flowData.flowNodeMaps = Object.assign([], flowNodeMaps);
      that.currentSelect = {};
    },
    loseShortcut() {
      this.activeShortcut = false;
    },
    getShortcut() {
      this.activeShortcut = true;
    },
    moveNode(type) {
      const that = this;
      let m = flowConfig.defaultStyle.movePx;
      let isX = true;
      switch (type) {
        case "left":
          m = -m;
          break;
        case "up":
          m = -m;
          isX = false;
          break;
        case "right":
          break;
        case "down":
          isX = false;
      }

      if (that.currentSelectGroup.length > 0) {
        that.currentSelectGroup.forEach(function(node, index) {
          if (isX) {
            node.left += m;
          } else {
            node.top += m;
          }
        });
        that.plumb.repaintEverything();
      } else if (that.currentSelect.id) {
        if (isX) {
          that.currentSelect.left += m;
        } else {
          that.currentSelect.top += m;
        }
        that.plumb.repaintEverything();
      }
    }
  }
};
</script>

<style lang="scss">
@import "./style/flow-designer.scss";
.tag {
  .el-checkbox-button__inner {
    padding: 0;
    display: inline-block;
    width: 64px;
    height: 22px;
    line-height: 22px;
    border: 0 !important;
    font-size: 12px;
    border-radius: 4px !important;
    color: #409eff;
  }
}

button.el-button.el-button--warning {
  padding: 8px 10px;
}
.header {
  padding: 20px;
}
</style>
