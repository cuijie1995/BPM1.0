<template>
  <div class="my_flow">
    <div class="flow_header">
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'委托人'"
        v-model="listQuery.DelegateUserName"
      ></el-input>
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'被委托人'"
        v-model="listQuery.PrincipalName"
      ></el-input>
      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>
      <el-button type="warning" @click="create">添加</el-button>
    </div>
    <div class="flow_item">
      <el-table :data="dataList" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="委托人" width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.delegateUserName}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'被委托人'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.principalName}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'开始有效期'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staDate | format}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'结束有效期'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.staDate | format}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'活动状态'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isActive | filterActive}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="'操作'"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="closeRow(scope.row)">关闭</el-button>
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

    <addTask :dialogCreate="dialogCreate" :dataForm="dataForm"></addTask>
  </div>
</template>

<script>
import {
  GetAllDelegateTask,
  GetDelegateTask,
  CloseDelegateTask
} from "../../../api/flowCenter";
import pagination from "@/components/Pagination/index";
import { format } from "../../../utils/filter";
import addTask from "./addTask";

export default {
  filters: {
    format(time) {
      let date = new Date(time);
      return format(date, "yyyy-MM-dd hh:mm:ss");
    },
    filterActive(str) {
      switch (str) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    }
  },
  name: "DelegatedTask",
  components: {
    pagination,
    addTask
    //    CreatedFlow
  },
  data() {
    return {
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        DelegateUserName: "",
        PrincipalName: "",
        StaDate: "",
        EndDate: ""
      },
      listLoading: false,
      dataList: [],
      dialogCreate: {
        show: false,
        title: "",
        option: "create"
      },
      dataForm: {
        delegateUserId: "",
        delegateUserName: "",
        principalId: "",
        principalName: "",
        staDate: "",
        endDate: "",
        isActive: true,
        flow: "",
        delegateTaskDetails: []
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    create() {
      this.dialogCreate = {
        show: true,
        title: "添加委托任务",
        option: "create"
      };
    },
    getList(value) {
      if (value) {
        this.listQuery.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      GetAllDelegateTask(this.listQuery)
        .then(res => {
          this.dataList = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch();
    },
    closeRow(row, index) {
      CloseDelegateTask({ input: row.id }).then(res => {
        this.$message.success("关闭成功");
        this.getList();
      });
    },
    search() {
      GetAllDelegateTask(this.listQuery)
        .then(res => {
          this.dataList = res.result.items;
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
  /* height: 250px; */
  padding: 10px 20px !important;
  height: 400px !important;
}
.flow_detail .el-dialog {
  width: 80%;
  margin-top: 4vh !important;
}
</style>