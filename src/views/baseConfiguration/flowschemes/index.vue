<template>
  <div class="flow_column">
    <div class="flow_header">
      <el-input
        @keyup.enter.native="handleSearch"
        prefix-icon="el-icon-search"
        size="small"
        style="width: 200px; margin-bottom: 0;"
        class="filter-item"
        :placeholder="'流程名称'"
        v-model="listQuery.FlowName"
      ></el-input>
      <el-input
        @keyup.enter.native="handleSearch"
        prefix-icon="el-icon-search"
        size="small"
        style="width: 200px; margin-bottom: 0;"
        class="filter-item"
        :placeholder="'备注'"
        v-model="listQuery.Remark"
      ></el-input>
      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>
      <el-button type="primary" @click="addFlow">
        <i class="el-icon-plus"></i>添加
      </el-button>

      <!-- <el-button type="danger" @click="BatchDelete">
        <i class="el-icon-delete"></i>批量删除
      </el-button>-->
    </div>
    <div class="flow_container flow_item">
      <el-table
        ref="mainTable"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @row-click="rowClick"
      >
        <!-- <el-table-column :label="'流程图标'" align="center" width="100px">
          <template slot-scope="scope">
            <div
              class="img"
              :style="{backgroundPositionY:'-' + scope.row.topSize  + 'px'  ,backgroundPositionX:'-' +scope.row.leftSize + 'px'}"
            ></div>
          </template>
        </el-table-column>-->
        <el-table-column :label="'流程名称'" align="center" width="220px">
          <template slot-scope="scope">
            <span>{{scope.row.flowName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'执行人'" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.starterName}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'备注'" align="center" width="220px">
          <template slot-scope="scope">
            <span>{{scope.row.remark}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="'操作'"
          width="155"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import { getFlowData, deleteFlowData } from "../../../api/flow";
export default {
  name: "flowschemes",
  components: {
    Pagination
  },

  data() {
    return {
      list: null,
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        // FlowCode: "",
        FlowName: "",
        FormDefinitionName: "",
        FlowChart: "",
        Remark: ""
      },
      listLoading: false,
      flowId: ""
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },

    getList(value) {
      if (value) {
        this.listQuery.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;

      getFlowData(this.listQuery)
        .then(res => {
          this.list = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;

          this.list.forEach(element => {
            element.topSize = element.topSize - 45;
            element.leftSize = element.leftSize - 40;
          });
        })
        .catch(err => {});
    },
    handleUpdate(row, index) {
      localStorage.setItem("flowId", row.id);
      this.$router.push("/editFlow");
    },
    // 单个删除
    deleteRow(index, row) {
      deleteFlowData({ Id: row.id })
        .then(res => {
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 添加表单
    addFlow() {
      this.$router.push("/addFlow");
    },
    search() {
      getFlowData(this.listQuery)
        .then(res => {
          this.list = res.result.items;
          this.total = res.result.totalCount;
          this.listLoading = false;
        })
        .catch(err => {});
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
.flow_column {
  height: calc(100% - 36px);
}

.flow_container.flow_item {
  height: calc(100% - 52px);
}

.flow_header {
  text-align: right;
  margin-bottom: 5px;
  padding: 10px 20px 10px 0;
  background: #ffffff;
}

.flow_header .el-input {
  margin-left: 10px;
}
</style>
<style>
.flow_container.flow_item .el-table td,
.el-table th {
  padding: 5px 0;
}
.flow_container.flow_item .el-table__header-wrapper .cell {
  text-align: center;
}

.flow_column {
  height: 100%;
}
.flow_column .flow_container {
  height: calc(100% - 52px);
}

.img {
  cursor: pointer;
  width: 60px;
  height: 60px;
  /* margin-left: 10px; */
  background-image: url("../../../assets/404_images/办公网2.png");
}
</style>