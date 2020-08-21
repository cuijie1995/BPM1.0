<template>
  <div class="my_flow">
    <div class="flow_header">
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'流程名称'"
        v-model="listQuery.FlowInstanceName"
      ></el-input>
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'节点名称'"
        v-model="listQuery.FlowTaskLinkName"
      ></el-input>
      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>
      <el-button type="warning" @click="seeFlow">流程跟踪</el-button>
    </div>
    <div class="flow_item">
      <el-table
        :data="flowList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>

        <el-table-column :label="'流程执行人'" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.executorName}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'流程名称'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.flowInstanceName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'开始时间'" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creationTime | format}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'节点名称'" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.flowTaskLinkName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'任务来源'" width="90px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.flowTaskType | filterStatus}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="'操作'"
          width="120"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">执行</el-button>
            <!-- <el-button size="mini" type="danger" @click="closeRow(scope.$index, scope.row)">关闭</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="listQuery.MaxResultCount"
        @pagination="getList"
      />
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
  </div>
</template>

<script>
import { getAllOfUserData } from "../../api/flowCenter";
import { getForEditFlow } from "../../api/flow";
import pagination from "@/components/Pagination/index";
import CreatedFlow from "@/components/CreatedFlow";
import { GetFlowTrackInfo } from "../../api/flowCenter";
import { format } from "../../utils/filter";

export default {
  filters: {
    filterStatus(str) {
      switch (str) {
        case 1:
          return "分配";
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
    }
  },
  name: "PendingFlow",
  components: { pagination, CreatedFlow },
  data() {
    return {
      flowList: [],
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        FlowInstanceName: "",
        FlowNodeName: "",
        FlowTaskLinkName: "",
        AssignUserName: "",
        FinishStatus: false
      },
      listLoading: false,
      isShowContent: true,
      currentForm: null,
      flowContent: "", // 当前选中的流程模板
      defaultValue: {},
      dialogFlowVisible: false,
      flowId: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.flowId = val;
    },
    seeFlow() {
      if (this.flowId.length == 1) {
        this.dialogFlowVisible = true;
        GetFlowTrackInfo({ id: this.flowId[0].flowInstanceId }).then(res => {
          this.flowContent = res.result;
        });
        return false;
      } else if (this.flowId.length == 0) {
        this.$message.error("请选中一个流程");
        return false;
      } else {
        this.$message.error("只能选中一个流程");
        return false;
      }
    },
    getList(value) {
      if (value) {
        this.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      getAllOfUserData(this.listQuery)
        .then(res => {
          this.flowList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    },

    handleUpdate(row) {
      localStorage.setItem("flowInstanceId", row.flowInstanceId);
      localStorage.setItem("RowId", row.id);
      localStorage.setItem("flowTaskLinkId", row.flowTaskLinkId);

      this.$router.push("/editMyFlow");
    },
    closeRow(row, index) {},
    search() {
      getAllOfUserData(this.listQuery)
        .then(res => {
          this.flowList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    }
  }
};
</script>
<style scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.flow_header {
  text-align: right;
  padding: 10px;
}
.flow_header .el-input {
  margin-left: 10px;
}
</style>

<style>
.flow_item .el-table td,
.flow_item .el-table th {
  padding: 5px 0 !important;
}
.flow_detail .el-dialog__body {
  padding: 10px 20px !important;
  height: 400px !important;
}
.flow_detail .el-dialog {
  width: 80%;
  margin-top: 4vh !important;
}
</style>