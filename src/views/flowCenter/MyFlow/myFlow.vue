<template>
  <div class="my_flow">
    <div class="flow_header">
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'模板名称'"
        v-model="listQuery.FlowDefinitionName"
      ></el-input>
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'流程标题'"
        v-model="listQuery.mainTitle"
      ></el-input>

      <el-select v-model="listQuery.FlowStatus" placeholder="流程状态" style="width: 150px;">
        <el-option label="正常" :value="1"></el-option>
        <el-option label="挂起" :value="2"></el-option>
        <el-option label="关闭" :value="3"></el-option>
        <el-option label="完成" :value="4"></el-option>
      </el-select>

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

        <!-- <el-table-column :label="'模板名称'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.flowDefinitionName}}</span>
          </template>
        </el-table-column>-->

        <el-table-column :label="'启动时间'" width="190px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.flowStartDate | format}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'启动人'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creater}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'流程标题'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.mainTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'流程状态'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.flowStatus | filterStatus}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="'操作'"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="closeRow( scope.row)">关闭</el-button>
            <!-- <el-button size="mini" type="success" @click="closeRow(scope.$index, scope.row)">挂起</el-button> -->
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
import { getMyFlow, CloseInstance } from "../../../api/flowCenter";
import { getForEditFlow } from "../../../api/flow";
import pagination from "@/components/Pagination/index";
import { format } from "../../../utils/filter";

import CreatedFlow from "@/components/CreatedFlow";
import { GetFlowTrackInfo } from "../../../api/flowCenter";

export default {
  name: "MyFlow",
  components: { pagination, CreatedFlow },
  filters: {
    filterStatus(str) {
      switch (str) {
        case 1:
          return "正常";
          break;
        case 2:
          return "挂起";
          break;
        case 3:
          return "关闭";
          break;
        case 4:
          return "完成";
          break;
      }
    },
    format(time) {
      let date = new Date(time);

      return format(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  data() {
    return {
      flowList: [],
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        MainTitle: "",
        FlowStatus: "",
        FlowDefinitionName: "",
        MinFlowStartDate: "",
        MaxFlowStartDate: ""
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
        GetFlowTrackInfo({ id: this.flowId[0].id }).then(res => {
          console.log(res);
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
        this.listQuery.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      getMyFlow(this.listQuery)
        .then(res => {
          this.flowList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    },

    handleUpdate(row, index) {
      localStorage.setItem("RowId", row.id);
      localStorage.setItem("RowNum", 2);

      this.$router.push("/seeFlow");
    },
    closeRow(row) {
      CloseInstance({ id: row.id }).then(res => {
        this.getList();
      });
    },
    search() {
      getMyFlow(this.listQuery)
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
  margin-right: 10px;
}
</style>

<style>
.flow_item .el-table td,
.flow_item .el-table th {
  padding: 5px 0 !important;
}
.flow_header .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.flow_detail .el-dialog__body {
  /* height: 250px; */
  padding: 10px 20px !important;
  height: 400px !important;
}
.flow_detail .el-dialog {
  width: 80%;
  margin-top: 4vh !important;
}
</style>