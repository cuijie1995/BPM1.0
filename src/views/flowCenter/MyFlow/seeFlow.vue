<template>
  <div class="edit_flow">
    <div class="editFlow_header">
      <el-button type="primary" @click="seeFlow">查看流程图</el-button>

      <el-button type="danger" @click="seeComment">查看意见</el-button>
    </div>

    <div class="editFlow_content">
      <el-row>
        <el-col :span="16">
          <el-card class="box-card">
            <div style="padding-right: 25px;">
              <CreatedForm
                insite="true"
                ref="createdForm"
                v-if="createdFormData.dynamicList && createdFormData.dynamicList.length > 0"
                :data="createdFormData"
                :value="defaultValue"
              ></CreatedForm>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <div class="list">
            <div v-if="listFile.length > 0">
              <el-table ref="multipleTable" :data="listFile" border>
                <el-table-column label="文件名称" align="center" prop="enclosureName">
                  <template slot-scope="scope">
                    <span>{{ scope.row.enclosureName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="150"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="downLoad(scope.row)">点击下载查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="flow_detail">
      <el-dialog title="流程详情" :visible.sync="dialogFlowVisible" :close-on-click-modal="false">
        <CreatedFlow
          ref="createdFlow"
          :form-template="currentForm"
          :isEdit="true"
          :isShowContent="isShowContent"
          :scheme-content="flowContent"
        ></CreatedFlow>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFlowVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="flow_success">
      <el-dialog
        :title="dialogopinionVisible.title"
        :visible.sync="dialogopinionVisible.show"
        :close-on-click-modal="false"
      >
        <div class="success">
          <span>请填写意见：</span>
          <el-input type="textarea" v-model="comments" style="margin-top: 15px;"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="finishTask">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="flow_executor">
      <TaskExecutor :dialogCus="dialogCus" :number="number"></TaskExecutor>
    </div>

    <div class="see_comment">
      <seeComment ref="comments" :dialogComment="dialogComment" :commentsId="commentsId"></seeComment>
    </div>
  </div>
</template>

<script>
let self;
import axios from "axios";

import CreatedFlow from "@/components/CreatedFlow";
import CreatedForm from "@/components/CreatedFlow/showForm/CreatedForm";
import TaskExecutor from "../MyFlow/taskExecutor";
import {
  getFlowData,
  FinishTask,
  BackToPreviousTask,
  AddFlowTask,
  TransferFlowTask,
  CirculateFlowTask,
  GetFlowTrackInfo
} from "../../../api/flowCenter";
import { getForEditFlow } from "../../../api/flow";

import { getAllUser } from "../../../api/user";
import { getAllRole } from "../../../api/role";
import { getAllPost } from "../../../api/post";
import { getAlltOrganizet } from "../../../api/organization";
import { getRelativeExecutorEnum } from "../../../api/enumDictionary";
import {
  UploadIForm,
  GetEnclosuresByKey,
  GetEnclosure,
  DeleteEnclosure
} from "../../../api/uplaod";

import seeComment from "./seeComment";

import Bus from "../../../components/bus";

export default {
  name: "EditMyFlow",
  components: {
    CreatedFlow,
    CreatedForm,
    TaskExecutor,
    seeComment
  },
  format(time) {
    let date = new Date(time);

    return format(date, "yyyy-MM-dd hh:mm:ss");
  },
  data() {
    return {
      dialogComment: {
        show: false,
        title: "",
        option: "create"
      },
      loading: false, // 按钮加载loading
      isShowContent: true,
      currentForm: null,
      flowContent: "", // 当前选中的流程模板
      createdFormData: {
        dynamicList: [],
        config: {}
      },
      defaultValue: {},
      dialogFlowVisible: false,
      dialogCus: {
        show: false,
        title: "",
        option: "create"
      },
      number: "",
      dialogopinionVisible: {
        show: false,
        title: "",
        option: "create"
      },
      comments: "",
      listFile: [],
      commentsList: [],
      commentsId: "",
      u8arr: "",
      prefixBase64: "data:image/png;base64,"
    };
  },
  created() {
    this.getData();
    Bus.$on("listFile", function(val) {
      self.getFile();
    });
  },
  mounted() {
    self = this;
  },
  methods: {
    seeComment() {
      this.dialogComment = {
        show: true,
        title: "查看意见",
        option: "create"
      };

      self.$refs.comments.getCommentList();
    },

    getData() {
      if (localStorage.getItem("RowNum") == 3) {
        var id = localStorage.getItem("flowInstanceId");
      } else {
        var id = localStorage.getItem("RowId");
      }

      getFlowData({ Id: id })
        .then(res => {
          self.commentsId = res.result.flowInstanceId;
          self.listId = localStorage.getItem("changeFlowId");
          localStorage.setItem("formId", res.result.formDefinition.id);
          self.createdFormData = JSON.parse(
            res.result.formDefinition.contentData
          );

          self.defaultValue =
            typeof res.result.data == "string"
              ? JSON.parse(res.result.data)
              : res.result.data;

          self.getFile();
        })
        .catch();
    },
    getFile() {
      GetEnclosuresByKey({ id: self.listId }).then(res => {
        self.listFile = res.result;
      });
    },
    seeFlow() {
      self.dialogFlowVisible = true;

      if (localStorage.getItem("RowNum") == 3) {
        var id = localStorage.getItem("flowInstanceId");
      }
      if (localStorage.getItem("RowNum") == 2) {
        var id = localStorage.getItem("RowId");
      }
      GetFlowTrackInfo({ id: id }).then(res => {
        self.flowContent = res.result;

        console.log(self.flowContent)
      });
    },
    finish() {
      self.dialogopinionVisible = {
        show: true,
        title: "完成任务",
        option: "finish"
      };

      self.comments = "";
    },
    backToPreviousTask() {
      self.dialogopinionVisible = {
        show: true,
        title: "退回",
        option: "back"
      };
      self.comments = "";
    },
    finishTask() {
      self.$refs.createdForm
        .getData()
        .then(res => {
          if (self.dialogopinionVisible.option == "finish") {
            FinishTask({
              flowData: JSON.stringify(res),
              taskId: localStorage.getItem("RowId"),
              comments: self.comments
            })
              .then(res => {
                if (res.result.resultCode == 0) {
                  self.$message({
                    message: res.result.resultText,
                    type: "success"
                  });

                  self.$router.push("/pendingFlow");
                }
                if (res.result.resultCode == 9) {
                  self.$message({
                    message: res.result.resultText,
                    type: "warn"
                  });
                }

                self.dialogopinionVisible = false;
              })
              .catch();
          }
          if (self.dialogopinionVisible.option == "back") {
            BackToPreviousTask({
              flowData: JSON.stringify(res),
              taskId: localStorage.getItem("RowId"),
              comments: self.comments
            })
              .then(res => {
                if (res.result.resultCode == 0) {
                  self.$message({
                    message: res.result.resultText,
                    type: "success"
                  });
                }
                if (res.result.resultCode == 9) {
                  self.$message({
                    message: res.result.resultText,
                    type: "warn"
                  });
                }

                self.dialogopinionVisible = false;
              })
              .catch();
          }
        })
        .catch(() => {});
    },

    addFlowTask(num) {
      self.number = num;
      self.dialogCus = {
        show: true,
        title: "选择执行人",
        option: "create"
      };
    },
    transferFlowTask(num) {
      self.number = num;

      self.dialogCus = {
        show: true,
        title: "选择执行人",
        option: "create"
      };
    },
    circulateFlowTask(num) {
      self.number = num;

      self.dialogCus = {
        show: true,
        title: "选择执行人",
        option: "create"
      };
    },
    handleClick(tab, event) {},
    base64toBlob(base64) {
      // 将base64转为Unicode规则编码
      var bstr = atob(base64);
      var n = bstr.length;
      self.u8arr = new Uint8Array(n);
      while (n--) {
        self.u8arr[n] = bstr.charCodeAt(n); // 转换编码后才可以使用charCodeAt 找到Unicode编码
      }

      return new Blob([bstr]);
    },
    downLoad(row) {
      var disLength = row.enclosureName.length;
      var shortName = row.enclosureName.substring(disLength - 4, disLength);
      GetEnclosure({ id: row.id }).then(res => {
        const data = res.result;
        if (shortName == "jpeg" || shortName == ".png" || shortName == ".jpg") {
          const imgUrl = this.prefixBase64 + data;
          let a = document.createElement("a");
          a.href = imgUrl;
          a.setAttribute("download", row.enclosureName);
          a.click();
        } else {
          var url = "";
          if (
            shortName == ".xls" ||
            shortName == "xlsx" ||
            shortName == "docx" ||
            shortName == ".doc"
          ) {
            self.base64toBlob(data);

            let blob = new Blob([self.u8arr], {
              type: "application/octet-stream"
            }); // 转化为blob对象

            url = window.URL.createObjectURL(blob);
          } else {
            url = window.URL.createObjectURL(
              new Blob([data], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              })
            );
          }

          const link = document.createElement("a");
          const fileName = row.enclosureName;
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },
    delRow(row) {
      DeleteEnclosure({ id: row.id }).then(res => {
        self.getFile();
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-card {
  width: 90%;
  margin-top: 20px;
}
</style>
<style>
.editFlow_header .el-button {
  padding: 8px 15px !important;
  font-size: 12px !important;
  margin-right: 10px !important;
  margin-left: 0 !important;
}

.editFlow_header .el-dropdown .el-button {
  margin-right: 0 !important;
}
.editFlow_header {
  padding: 15px;
}
.editFlow_header .el-dropdown {
  margin-right: 10px !important;
}
</style>
<style >
.flow_detail .el-dialog__body {
  /* height: 250px; */
  padding: 10px 20px !important;
  height: 400px !important;
}
.flow_detail .el-dialog {
  width: 80%;
}
</style>

<style >
.list {
  font-size: 12px;
}
.list .el-table td,
.list .el-table th {
  padding: 3px 0 !important;
}

.list .el-button {
  padding: 5px 10px;
  font-size: 10px;
}
.download {
  display: none;
}
.download_name {
  cursor: pointer;
  font-size: 12px;
}
.download_name:hover .download {
  display: inline;
  color: red;
}
</style>
