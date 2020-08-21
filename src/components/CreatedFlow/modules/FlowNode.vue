<template>
  <el-tooltip :disabled="isDisabled()" content="点击关闭 tooltip 功能">
    <div slot="content" v-if="contentHtml">
      <div v-html="contentHtml"></div>
    </div>
    <div
      v-if="node.defaultIcon == 'iconfont icon-kaishi1'"
      :id="node.id"
      class="common-circle-node node-start-bg"
      :class="{ active: isActive() }"
      :style="{ top: node.top + 'px', left: node.left + 'px',
        cursor: currentTool.type == 'drag' ? 'move' : (currentTool.type == 'connection' ? 'crosshair' :
                                                  (currentTool.type == 'zoom-in' ? 'zoom-in' :
                                                  (currentTool.type == 'zoom-out' ? 'zoom-out' : 'default')))}"
      @click.stop="selectNode"
      @contextmenu.stop="showNodeContextMenu"
    >
      <!-- <i :class="node.icon || node.defaultIcon" /> -->
      <span v-if="node.flowLinkStatus == 1" style="color:#F56C6C">{{ node.nodeName }}</span>
      <span v-if="node.flowLinkStatus == 2" style="color:#67C23A">{{ node.nodeName }}</span>
      <span v-if="node.flowLinkStatus == 3" style="color:#67C23A">{{ node.nodeName }}</span>
      <span v-if="node.flowLinkStatus == null">{{ node.nodeName }}</span>

      <!-- <div class="work_node" v-if="node.implementations">
        <div v-if="node.implementations.length > 0">
          <div class="tagg">
            <div v-for="(data,index) in node.implementations" :key="index" class="gongzuo_node">
              <div class="arrow">
                <em></em>
                <span></span>
              </div>
              <span>
                <span>{{data.executorName}} :</span>
                <span v-if="data.finishDate == '0001-01-01T00:00:00'"></span>
                <span v-else>{{data.finishDate | format}} ：</span>
                <div>{{data.comments}}</div>
              </span>
            </div>
          </div>
        </div>
      </div>-->
    </div>

    <div
      v-else-if="node.defaultIcon == 'iconfont icon-jieshu'"
      :id="node.id"
      class="common-circle-node"
      :class="{ active: isActive() }"
      :style="{ top: node.top + 'px', left: node.left + 'px',
    cursor: currentTool.type == 'drag' ? 'move' : (currentTool.type == 'connection' ? 'crosshair' :
                                                  (currentTool.type == 'zoom-in' ? 'zoom-in' :
                                                  (currentTool.type == 'zoom-out' ? 'zoom-out' : 'default'))) }"
      @click.stop="selectNode"
      @contextmenu.stop="showNodeContextMenu"
    >
      <span v-if="node.flowLinkStatus == 1" style="color:#F56C6C">{{ node.nodeName }}</span>
      <span v-if="node.flowLinkStatus == 2" style="color:#67C23A">{{ node.nodeName }}</span>
      <span v-if="node.flowLinkStatus == 3" style="color:#67C23A">{{ node.nodeName }}</span>
      <span v-if="node.flowLinkStatus == null">{{ node.nodeName }}</span>
      <!-- <div class="work_node" v-if="node.implementations">
        <div v-if="node.implementations.length > 0">
          <div class="tagg">
            <div v-for="(data,index) in node.implementations" :key="index" class="gongzuo_node">
              <div class="arrow">
                <em></em>
                <span></span>
              </div>
              <span>
                <span>{{data.executorName}} :</span>
                <span v-if="data.finishDate == '0001-01-01T00:00:00'"></span>
                <span v-else>{{data.finishDate | format}} ：</span>
                <span>{{data.comments}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>-->
    </div>
    <div
      v-else-if="node.defaultIcon == 'iconfont icon-gongzuo1'"
      :id="node.id"
      class="common-rectangle-node flex-row gongzuo"
      :class="stateClass()"
      :style="{ top: node.top + 'px', left: node.left + 'px',
    cursor: currentTool.type == 'drag' ? 'move' : (currentTool.type == 'connection' ? 'crosshair' :
                                                  (currentTool.type == 'zoom-in' ? 'zoom-in' :
                                                  (currentTool.type == 'zoom-out' ? 'zoom-out' : 'default'))) }"
      @click.stop="selectNode"
      @contextmenu.stop="showNodeContextMenu"
    >
      <span v-if="node.flowLinkStatus == 1" style="color:#F56C6C">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == 2" style="color:#67C23A">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == 3" style="color:#67C23A">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == null">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>

      <div class="work_node" v-if="node.implementations">
        <div v-if="node.implementations.length > 0">
          <div class="tagg">
            <div v-for="(data,index) in node.implementations" :key="index" class="gongzuo_node">
              <div class="arrow">
                <em></em>
                <span></span>
              </div>
              <span>
                <span v-if="data.executorName != null" class="data_name">
                  <span class="dian"></span>
                  执行人：{{data.executorName}} ；
                  <br />
                </span>
                <span v-if="data.assignUserName != null" class="data_name">
                  <span class="dian"></span>
                  分配人：{{data.assignUserName}} ；
                  <br />
                </span>

                <span v-if="data.finishDate == '0001-01-01T00:00:00'"></span>
                <span v-else class="data_name">
                  <span class="dian"></span>
                  时间：{{data.finishDate | format}} ；
                  <br />
                </span>

                <span v-if="data.comments != null" class="data_name">
                  <span class="dian"></span>
                  意见：{{data.comments}}；
                  <br />
                </span>

                <span v-if="data.flowFinishType != null" class="data_name">
                  <span class="dian"></span>
                  完成类型：{{data.flowFinishType | formatstatus}}；
                  <br />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="node.defaultIcon === 'iconfont icon-zidong1'"
      :id="node.id"
      class="common-rectangle-node flex-row"
      :class="stateClass()"
      :style="{ top: node.top + 'px', left: node.left + 'px',
    cursor: currentTool.type == 'drag' ? 'move' : (currentTool.type == 'connection' ? 'crosshair' :
                                                  (currentTool.type == 'zoom-in' ? 'zoom-in' :
                                                  (currentTool.type == 'zoom-out' ? 'zoom-out' : 'default'))) }"
      @click.stop="selectNode"
      @contextmenu.stop="showNodeContextMenu"
    >
      <span v-if="node.flowLinkStatus == 1" style="color:#F56C6C">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == 2" style="color:#67C23A">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == 3" style="color:#67C23A">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == null">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <div class="work_node" v-if="node.implementations">
        <div v-if="node.implementations.length > 0">
          <div class="tagg">
            <div v-for="(data,index) in node.implementations" :key="index" class="gongzuo_node">
              <div class="arrow">
                <em></em>
                <span></span>
              </div>
              <span>
                <span>{{data.executorName}} :</span>
                <span v-if="data.finishDate == '0001-01-01T00:00:00'"></span>
                <span v-else>{{data.finishDate | format}} ：</span>
                <span>{{data.comments}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="node.defaultIcon === 'iconfont icon-huiqian1'"
      :id="node.id"
      class="common-rectangle-node flex-row"
      :class="stateClass()"
      :style="{ top: node.top + 'px', left: node.left + 'px',
    cursor: currentTool.type == 'drag' ? 'move' : (currentTool.type == 'connection' ? 'crosshair' :
                                                  (currentTool.type == 'zoom-in' ? 'zoom-in' :
                                                  (currentTool.type == 'zoom-out' ? 'zoom-out' : 'default'))) }"
      @click.stop="selectNode"
      @contextmenu.stop="showNodeContextMenu"
    >
      <span v-if="node.flowLinkStatus == 1" style="color:#F56C6C">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == 2" style="color:#67C23A">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == 3" style="color:#67C23A">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <span v-if="node.flowLinkStatus == null">
        <i :class="node.icon || node.defaultIcon" />
        <span class="flex-item">{{ node.nodeName }}</span>
      </span>
      <div class="work_node" v-if="node.implementations">
        <div v-if="node.implementations.length > 0">
          <div class="tagg">
            <div v-for="(data,index) in node.implementations" :key="index" class="gongzuo_node">
              <div class="arrow">
                <em></em>
                <span></span>
              </div>
              <span>
                <span>{{data.executorName}} :</span>
                <span v-if="data.finishDate == '0001-01-01T00:00:00'"></span>
                <span v-else>{{data.finishDate | format}} ：</span>
                <span>{{data.comments}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vdr
      :id="node.id"
      class="common-x-lane-node"
      :class="{ laneActive: isActive() }"
      v-else-if="node.defaultIcon == 'iconfont icon-icon'"
      :w="node.width"
      :h="node.height"
      :style="{top: node.top + 'px', left: node.left + 'px',height: node.height + 'px', width: node.width + 'px',
          cursor: currentTool.type == 'zoom-in' ? 'zoom-in' : (currentTool.type == 'zoom-out' ? 'zoom-out' : 'default')}"
      v-on:resizing="onResize"
      :parent="true"
    >
      <div
        class="lane-text-div"
        :style="{ top: 0, left: 0, cursor: currentTool.type == 'drag' ? 'move' : 'default' }"
        @click.stop="selectNode"
        @contextmenu.stop="showNodeContextMenu"
      >
        <!-- <i :class="node.icon || node.defaultIcon" /> -->
        <span class="lane-text">{{ node.nodeName }}</span>
      </div>
    </vdr>

    <vdr
      v-else-if="node.defaultIcon == 'iconfont icon-zongxiang'"
      :id="node.id"
      class="common-y-lane-node"
      :class="{ laneActive: isActive() }"
      :w="node.width"
      :h="node.height"
      :style="{ top: node.top + 'px', left: node.left + 'px', height: node.height + 'px', width: node.width + 'px',
      cursor: currentTool.type == 'zoom-in' ? 'zoom-in' : (currentTool.type == 'zoom-out' ? 'zoom-out' : 'default') }"
      v-on:resizing="onResize"
    >
      <div
        class="lane-text-div"
        :style="{ cursor: currentTool.type == 'drag' ? 'move' : 'default' }"
        @click.stop="selectNode"
        @contextmenu.stop="showNodeContextMenu"
      >
        <!-- <i :class="node.icon || node.defaultIcon" /> -->
        <span class="lane-text">{{ node.nodeName }}</span>
      </div>
    </vdr>

    <div v-else></div>
  </el-tooltip>
</template>

<script>
import { flowConfig } from "../config/args-config.js";
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import { format } from "../../../utils/filter";
import { getFlowFinishTypeEnum } from "../../../api/base";

export default {
  props: [
    "select",
    "selectGroup",
    "node",
    "plumb",
    "currentTool",
    "isShowContent"
  ],
  components: {
    vdr
  },
  filters: {
    format(time) {
      let date = new Date(time);

      return format(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatstatus(str) {
      switch (str) {
        case 0:
          return "未完成";
          break;
        case 1:
          return "正常流转完成";
          break;
        case 2:
          return "退回流转完成未执行";
          break;
        case 3:
          return "转签流转完成未执行";
          break;
        case 4:
          return "串行流出未执行";
          break;
      }
    }
  },
  mounted() {
    if (this.isShowContent) {
      return;
    }
    this.registerNode();

    // this.getFlowFinishTypeEnum()
  },
  data() {
    return {
      contentHtml: "",
      currentSelect: this.select,
      currentSelectGroup: this.selectGroup
    };
  },
  methods: {
    // getData(){
    //    getFlowFinishTypeEnum().then(res => {
    //      console.log(res)
    //    })
    // },
    onResize: function(x, y, width, height) {
      this.node.width = width;
      this.node.height = height;
    },
    registerNode() {
      const that = this;

      that.node.id &&
        that.plumb.draggable(that.node.id, {
          containment: "parent",
          handle: function(e, el) {
            var possibles = el.parentNode.querySelectorAll(
              ".common-circle-node,.common-rectangle-node,.common-diamond-node,.lane-text-div"
            );
            for (var i = 0; i < possibles.length; i++) {
              if (possibles[i] === el || e.target.className === "lane-text")
                return true;
            }
            return false;
          },
          grid: flowConfig.defaultStyle.alignGridPX,
          drag: function(e) {
            if (
              that.node.nodeName === "横向泳道" ||
              that.node.nodeName === "纵向泳道"
            ) {
              that.node.left = e.pos[0];
              that.node.top = e.pos[1];
            }
            if (flowConfig.defaultStyle.isOpenAuxiliaryLine) {
              that.$emit("alignForLine", e);
            }
          },
          stop: function(e) {
            if (
              that.node.nodeName !== "横向泳道" &&
              that.node.typnodeNamee !== "纵向泳道"
            ) {
              that.node.left = e.pos[0];
              that.node.top = e.pos[1];
            }
            if (that.currentSelectGroup.length > 1) {
              that.$emit("updateNodePos");
            }
            that.$emit("hideAlignLine");
          }
        });
      that.currentSelect = { ...that.node, setInfo: this.setInfo };
      that.currentSelectGroup = [];
    },
    selectNode() {
      // alert("选中了");
      if (this.currentSelectGroup.length > 0) {
        return;
      }
      const that = this;
      that.currentSelect = this.node;
      that.$emit("isMultiple", flag => {
        if (!flag) {
          that.currentSelectGroup = [];
        } else {
          const f = that.currentSelectGroup.filter(s => s.id === that.node.id);
          if (f.length <= 0) {
            that.plumb.addToDragSelection(that.node.id);
            that.currentSelectGroup.push(that.node);
          }
        }
      });
    },
    showNodeContextMenu(e) {
      this.$emit("showNodeContextMenu", e);
      this.selectNode();
    },
    stateClass() {
      let classname = "";
      if (this.isActive()) {
        classname += "active";
      }
      if (
        this.node.setInfo !== undefined &&
        this.node.setInfo !== null &&
        this.node.setInfo.Taged !== undefined &&
        this.node.setInfo.Taged !== null
      ) {
        if (this.node.setInfo.Taged === 2) {
          classname += " node-not-bg";
        } else if (this.node.setInfo.Taged === 1) {
          classname += " node-pass-bg";
        } else {
          classname += " node-back-bg";
        }
      }

      return classname;
    },
    isActive() {
      const that = this;
      if (that.currentSelect.id === that.node.id) return true;
      const f = that.currentSelectGroup.filter(n => n.id === that.node.id);
      if (f.length > 0) return true;
      return false;
    },
    isDisabled() {
      let flag = true;

      return flag;
    }
  },
  watch: {
    select(val) {
      this.currentSelect = val;
    },
    currentSelect: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true
    },
    selectGroup(val) {
      this.currentSelectGroup = val;
    },
    currentSelectGroup: {
      handler(val) {
        // console.log(val)
        this.$emit("update:selectGroup", val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "../style/flow-node.scss";
.node-loading-bg {
  background: #5bc0de;
  color: #fff;
}
.node-not-bg {
  background: #d9534f;
  color: #fff;
}
.node-pass-bg {
  background: #5cb85c;
  color: #fff;
}
.node-back-bg {
  background: #f0ad4e;
  color: #fff;
}

.work_node {
  z-index: 10;
  position: relative;
  bottom: 150px;
  color: #000000;
  display: none;
}
.gongzuo_node {
  font-size: 10px;
  // height: 15px;
  text-align: left;
  margin-left: 10px;
  padding-top: 10px;
}

.gongzuo:hover .work_node {
  display: inline;
}

span.dian {
  display: inline-block;
  width: 5px;
  height: 5px;
  background: #000000;
  border-radius: 50%;
  margin-right: 2px;
}
span.data_name {
  display: table;
  // margin-bottom: 2px;
}
</style>
<style >
.tagg {
  width: 200px;
  /* border: 2px solid #09f; */
  position: relative;
  padding-bottom: 20px;
  background: #67c23a;
  border-radius: 10px;
}

.arrow {
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: -40px;
  left: 50px;
}

.arrow * {
  display: block;
  border-width: 20px;
  position: absolute;
  border-style: solid dashed dashed dashed;
  font-size: 0;
  line-height: 0;
}

.arrow em {
  border-color: #67c23a transparent transparent;
}

.arrow span {
  border-color: #67c23a transparent transparent;
  top: -4px;
}
</style>