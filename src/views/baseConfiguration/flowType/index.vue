<template>
  <div class="flow_type">
    <div class="type_header">
      <el-button type="primary" @click="addType">
        <i class="el-icon-plus"></i>添加
      </el-button>
    </div>

    <div class="type_container">
      <div class="bg-white" style="height: 100%;">
        <el-table
          :data="list"
          border
          style="width: 60%;"
          :header-cell-style="{'background-color':'azure'}"
          @selection-change="handleSelectionChange"
          :default-sort="{prop:'sortNo',order:'ascending'}"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>

          <el-table-column align="center" :label="'序号'" width="100px" sortable prop="sortNo">
            <template slot-scope="scope">
              <span>{{scope.row.sortNo}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'类别名称'">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.flowTypeName}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'操作'" width="300">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="moveUp(scope.$index, scope.row)">
                <i class="el-icon-top"></i>
              </el-button>
              <el-button type="primary" size="mini" @click="moveDown(scope.$index, scope.row)">
                <i class="el-icon-bottom"></i>
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdate(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- <el-select v-model="taskAssignmentType" placeholder="请选择">
      <el-option
        v-for="item in TaskAssignmentTypeEnum"
        :key="item.keyId"
        :label="item.text"
        :value="item.keyId"
      ></el-option>
    </el-select>-->

    <CreateOrUpdateType :dialogType="dialogType" :typeForm="typeForm" ref="childType"></CreateOrUpdateType>
  </div>
</template>

<script>
import {
  GetAllTypes,
  DeleteFlowType,
  CreatOrUpdateFlowType,
  GetFlowType
} from "../../../api/flow";
import CreateOrUpdateType from "./CreateOrUpdateType";

import Bus from "../../../components/bus";

import { getTaskAssignmentTypeEnum } from "../../../api/base";
export default {
  name: "DesignBusiness",
  components: {
    CreateOrUpdateType
  },
  data() {
    return {
      list: [],
      listLoading: false,
      typeForm: {
        icon: "",
        flowTypeName: "",
        sortNo: ""
        // sponsor: ""
      },
      dialogType: {
        show: false,
        title: "",
        option: ""
      }
      // TaskAssignmentTypeEnum: [],
      // taskAssignmentType: 1
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //上移
    moveUp(index, row) {
      var that = this;
      if (index > 0) {
        let upDate = that.list[index - 1];

        that.list.splice(index - 1, 1);
        that.list.splice(index, 0, upDate);
        row.sortNo = row.sortNo - 1;
        upDate.sortNo = upDate.sortNo + 1;
        CreatOrUpdateFlowType(row).then(res => {});
        CreatOrUpdateFlowType(upDate).then(res => {});
      } else {
        alert("已经是第一条，不可上移");
      }
    },

    //下移
    moveDown(index, row) {
      var that = this;
      if (index + 1 === that.list.length) {
        alert("已经是最后一条，不可下移");
      } else {
        let downDate = that.list[index + 1];
        that.list.splice(index + 1, 1);
        that.list.splice(index, 0, downDate);
        row.sortNo = row.sortNo + 1;
        downDate.sortNo = downDate.sortNo - 1;
        CreatOrUpdateFlowType(row).then(res => {});
        CreatOrUpdateFlowType(downDate).then(res => {});
      }
    },

    handleSelectionChange(val) {},
    getList() {
      this.listLoading = true;
      GetAllTypes()
        .then(res => {
          this.list = res.result;

          this.listLoading = false;
        })
        .catch(err => {});

      // getTaskAssignmentTypeEnum().then(res => {
      //   this.TaskAssignmentTypeEnum = res.result;
      //   // this.taskAssignmentType = this.TaskAssignmentTypeEnum[0].keyId;
      // });
    },
    // 单个删除
    deleteRow(index, row) {
      DeleteFlowType({
        id: row.id
      }).then(res => {
        this.getList();
      });
    },
    // 添加流程类别
    addType() {
      this.dialogType = {
        show: true,
        title: "添加流程类型",
        option: "create"
      };
      this.typeForm.sortNo = this.list.length + 1;
    },
    // 编辑流程类别
    handleUpdate(index, row) {
      GetFlowType({ input: row.id }).then(res => {
        this.typeForm = res.result;
      });

      this.dialogType = {
        show: true,
        title: "编辑流程类别",
        option: "update"
      };
    }
  }
};
</script>
<style  scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
.flow_type,
.type_container {
  height: calc(100% - 65px);
}

.type_header {
  text-align: right;
  margin-bottom: 10px;
  padding: 10px 0;
  background: #ffffff;
  width: 60%;
}
.type_header .el-input {
  margin-left: 10px;
}
</style>
<style>
.flow_type .el-table td,
.flow_type .el-table th {
  padding: 6px 0;
}
</style>