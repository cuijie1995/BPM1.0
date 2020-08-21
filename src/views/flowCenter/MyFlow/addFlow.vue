<template>
  <div class="add_flow">
    <div class="createPost-container">
      <span style=" font-size: 12px;">流程模板：</span>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="表单" name="first">
          <el-row>
            <el-col :span="17">
              <div class="createPost-main-container">
                <CreatedForm insite="true" ref="createdForm" :data="createdFormData" :value="{}"></CreatedForm>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="list" v-if="listFile.length > 0">
                <el-table ref="multipleTable" :data="listFile" border>
                  <el-table-column label="文件名称" align="center" prop="enclosureName">
                    <template slot-scope="scope">
                      <span @click="downLoad(scope.row)" class="download_name">
                        {{ scope.row.enclosureName }}
                        <span class="download">点击下载查看</span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                    width="100"
                    class-name="small-padding fixed-width"
                  >
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" @click="delRow(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>

          <div class="footer">
            <el-button type="success" size="small" @click="preservation">保存</el-button>
            <el-button type="success" size="small" @click="submit">提交</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="流程" name="second">
          <div class="createPost-main-container">
            <div class="flow-form-content" style="height: 300px;">
              <CreatedFlow
                ref="createdFlow"
                :form-template="currentForm"
                :isEdit="true"
                :isShowContent="isShowContent"
                :scheme-content="flowContent"
              ></CreatedFlow>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史数据" name="third">
          <div class="createPost-main-container history">
            <div class="flow_header">
              <el-input
                size="mini"
                style="width: 100px;"
                class="filter-item"
                placeholder="流程名称"
                v-model="exportExcelData.mainTitle"
              ></el-input>
              <el-date-picker
                size="mini"
                v-model="exportExcelData.staCreationTime"
                type="date"
                format="yyyy-MM-dd"
                placeholder="最早创建时间"
              ></el-date-picker>
              <el-date-picker
                size="mini"
                v-model="exportExcelData.endCreationTime"
                type="date"
                format="yyyy-MM-dd"
                placeholder="最晚创建时间"
              ></el-date-picker>
              <el-date-picker
                size="mini"
                v-model="exportExcelData.staFlowStartDate"
                type="date"
                format="yyyy-MM-dd"
                placeholder="最早启动时间"
              ></el-date-picker>
              <el-date-picker
                size="mini"
                v-model="exportExcelData.endFlowStartDate"
                type="date"
                format="yyyy-MM-dd"
                placeholder="最晚启动时间"
              ></el-date-picker>
              <el-button type="primary" size="small" @click="search">
                <i class="el-icon-search"></i>查找
              </el-button>

              <el-button type="warning" size="small" @click="exportData">导出数据</el-button>
            </div>
            <el-table :data="historyData" border fit highlight-current-row style="width: 100%;">
              <el-table-column :label="'创建时间'" width="130px" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.creationTime | format}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="'创建人'" width="70px" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.creationUserName}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="'启动时间'" width="130px" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.flowStartDate | format}}</span>
                </template>
              </el-table-column>

              <el-table-column :label="'流程标题'" width="100px" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.mainTitle}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="'流程状态'" width="70px" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.flowStatus | filterStatus}}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="(col,index) in tableList"
                :key="index"
                :prop="col.token"
                :label="col.name"
              >
                <template slot-scope="scope">
                  <span class="dataFont">{{scope.row.formData[col.token]}}</span>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="page"
              :limit.sync="exportExcelData.maxResultCount"
              @pagination="GetHistoricalData"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index";
import CreatedFlow from "@/components/CreatedFlow";
import CreatedForm from "@/components/Formcreated/components/CreatedForm";
import {
  getFlowData,
  getForEditFlow,
  GetAttributeEnum,
} from "../../../api/flow";
import {
  CreateOrUpdate,
  StartFlowInstance,
  GetAllHistoricalData,
  ExportExcel,
} from "../../../api/flowCenter";
import { getDetailFormData } from "../../../api/form";
import {
  UploadIForm,
  GetEnclosuresByKey,
  GetEnclosure,
  DeleteEnclosure,
} from "../../../api/uplaod";

import Bus from "../../../components/bus";

import { format } from "../../../utils/filter";

let self;

export default {
  filters: {
    filterStatus(str) {
      switch (str) {
        case 1:
          return "正常";
          break;
        case 2:
          return "加签";
          break;
        case 3:
          return "转签";
          break;
        case 4:
          return "传阅";
          break;
      }
    },
    format(time) {
      let date = new Date(time);

      return format(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  name: "AddMyFlow",
  components: {
    CreatedFlow,
    CreatedForm,
    pagination,
  },
  data() {
    return {
      isShowContent: true,
      currentForm: null,
      flowList: [], // 选择的流程模板列表
      currentScheme: "",
      createdFormData: {
        list: [],
        config: {},
      },
      flowContent: "", // 当前选中的流程模板
      postFormData: "",
      list: "",
      FlowId: "",
      activeName: "second",
      listFile: [],
      FormId: "",
      curguid: "",
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        // FlowDefinitionId: "",
        StaCreationTime: "",
        EndCreationTime: "",
        StaFlowStartDate: "",
        EndFlowStartDate: "",
        MainTitle: "",
        FlowStatus: "",
        FormData: "",
      },
      listLoading: false,
      historyData: [],
      exportExcelData: {
        flowDefinitionId: "",
        staCreationTime: "",
        endCreationTime: "",
        staFlowStartDate: "",
        endFlowStartDate: "",
        mainTitle: "",
        // flowStatus: 1,
        formData: "",
        skipCount: 0,
        maxResultCount: 10,
      },
      u8arr: "",
      prefixBase64: "data:image/png;base64,",
      tableList: [],
      formName: "",
      formValue: "",
    };
  },
  created() {
    Bus.$on("clickFile", function (val) {
      self.getFile();
    });
  },
  mounted() {
    self = this;

    self.onSchemeChange();
    self.GetHistoricalData();
  },
  methods: {
    search() {
      self.exportExcelData.flowDefinitionId = self.$route.params.item.id;
      GetAllHistoricalData(self.exportExcelData).then((res) => {
        self.historyData = res.result.items;
        self.total = res.result.totalCount;
        self.listLoading = false;

        self.historyData.forEach((element) => {
          element.formData = JSON.parse(element.formData);
        });

        self.historyData.forEach((item) => {
          for (const key in item.formData) {
            if (key.substring(0, 9) == "imgupload") {
              delete item.formData[key];
            }
          }
        });
      });
    },
    GetHistoricalData(value) {
      self.exportExcelData.flowDefinitionId = self.$route.params.item.id;
      if (value) {
        this.page = value.page;
        this.exportExcelData.skipCount = (value.page - 1) * 10;
      }
      self.listLoading = true;
      GetAllHistoricalData(self.exportExcelData).then((res) => {
        self.historyData = res.result.items;
        self.total = res.result.totalCount;
        self.listLoading = false;

        self.historyData.forEach((element) => {
          element.formData = JSON.parse(element.formData);
        });

        self.historyData.forEach((item) => {
          for (const key in item.formData) {
            if (key.substring(0, 9) == "imgupload") {
              delete item.formData[key];
            }
          }
        });
      });
    },
    getFile() {
      if (self.curguid) {
        GetEnclosuresByKey({ ID: self.curguid }).then((res) => {
          self.listFile = res.result;
        });
      }
    },
    handleClick(tab, event) {},
    onSchemeChange() {
      self.FlowId = self.$route.params.item.id;

      self.curguid = "";
      for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        self.curguid += id;
        if (i == 8 || i == 12 || i == 16 || i == 20) self.curguid += "-";
      }
      localStorage.setItem("changeFlowId", self.curguid);
      // 预览流程

      getForEditFlow({ id: self.$route.params.item.id }).then((res) => {
        self.flowContent = res.result;

        console.log(self.flowContent);
      });

      self.currentScheme = Object.assign({}, this.$route.params.item);

      // 预览表单
      getDetailFormData({ Id: self.currentScheme.formDefinitionId })
        .then((res) => {
          localStorage.setItem("formId", res.result.id);
          self.FormId = res.result.id;
          self.list = {};
          self.createdFormData = JSON.parse(res.result.contentData);

          self.getFile();
        })
        .catch((err) => {
          console.log(err);
        });

      GetAttributeEnum({ id: self.currentScheme.formDefinitionId }).then(
        (res) => {
          self.tableList = res.result;

          self.tableList.forEach((item, index) => {
            if (item.token.substring(0, 9) == "imgupload") {
              self.tableList.splice(index, 1);
            }
          });
        }
      );
    },
    preservation() {
      self.$refs.createdForm
        .getData()
        .then((res) => {
          self.postFormData = JSON.stringify(res);

          CreateOrUpdate({
            formDefinitionId: self.currentScheme.formDefinitionId,
            dataString: self.postFormData,
            id: self.curguid,
          })
            .then((res) => {
              self.$message({
                message: res.result.resultText,
                type: "success",
              });
              self.$router.push("/myFlow");
            })
            .catch();
        })
        .catch(() => {
          self.loading = false;
        });
    },
    submit() {
      self.$refs.createdForm
        .getData()
        .then((res) => {
          self.postFormData = JSON.stringify(res);

          CreateOrUpdate({
            formDefinitionId: self.currentScheme.formDefinitionId,
            dataString: self.postFormData,
            id: self.curguid,
          })
            .then((res) => {
              StartFlowInstance({
                bussinessID: res.result.id,
                flowDefinitionId: self.FlowId,
                flowData: self.postFormData,
              })
                .then((res) => {
                  self.$message({
                    message: res.result.resultText,
                    type: "success",
                  });
                  self.$router.push("/myFlow");
                })
                .catch();
            })
            .catch();
        })
        .catch(() => {
          self.loading = false;
        });
    },
    downLoad(row) {
      var disLength = row.enclosureName.length;
      var shortName = row.enclosureName.substring(disLength - 4, disLength);
      GetEnclosure({ id: row.id }).then((res) => {

        console.log(res)
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
              type: "application/octet-stream",
            }); // 转化为blob对象

            url = window.URL.createObjectURL(blob);
          } else {
            url = window.URL.createObjectURL(
              new Blob([data], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
      DeleteEnclosure({ id: row.id }).then((res) => {
        self.getFile();
      });
    },
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
    exportData() {
      self.exportExcelData.flowDefinitionId = self.$route.params.item.id;
      ExportExcel(self.exportExcelData, { responseType: "arraybuffer" }).then(
        (res) => {
          self.base64toBlob(res.result.fileByte);

          let blob = new Blob([self.u8arr], {
            type: "application/octet-stream",
          }); // 转化为blob对象

          let filename = res.result.excelName || "filename.xls"; // 判断是否使用默认文件名
          if (typeof window.navigator.msSaveBlob !== "undefined") {
            window.navigator.msSaveBlob(blob, filename);
          } else {
            var blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
            var tempLink = document.createElement("a"); // 创建一个a标签
            tempLink.style.display = "none";
            tempLink.href = blobURL;
            tempLink.setAttribute("download", filename); // 给a标签添加下载属性
            if (typeof tempLink.download === "undefined") {
              tempLink.setAttribute("target", "_blank");
            }
            document.body.appendChild(tempLink); // 将a标签添加到body当中
            tempLink.click(); // 启动下载
            document.body.removeChild(tempLink); // 下载完毕删除a标签
            window.URL.revokeObjectURL(blobURL);
          }
        }
      );
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
iframe {
  border: 0;
}
.createPost-container {
  margin: 10px;
  padding: 10px;
  background-color: white;
  min-height: 100%;

  .createPost-main-container {
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 40px;
  }

  .createPost-main-container.history {
    margin-top: 10px;
  }
}

.flow-form-content {
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}
.footer {
  text-align: center;
  padding: 20px 0;
}

.add_flow {
  .el-tabs__header {
    width: 500px;
  }
  .created-form-content {
    width: 50%;
  }
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

<style >
.list {
  font-size: 12px;
}
.list .el-table td,
.list .el-table th {
  padding: 3px 0 !important;
  font-size: 10px !important;
}

.history .el-table td,
.history .el-table th {
  padding: 5px 0 !important;
}
</style>
<style>
.history .el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.history .flow_header {
  /* text-align: right; */
  padding: 10px;
}
.history .flow_header .el-input {
  margin-left: 10px;
}

.history .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 150px !important;
}

.history .cell {
  font-size: 11px;
}
</style>
