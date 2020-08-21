<template>
  <div class="flex-column">
    <div class="filter-container">
      <el-input
        size="mini"
        style="width: 200px;"
        class="filter-item"
        :placeholder="'名称'"
        v-model="listQuery.Name"
      ></el-input>
      <el-button type="primary" @click="search">
        <i class="el-icon-search"></i>查找
      </el-button>
      <el-button type="primary" @click="addDynamic">
        <i class="el-icon-plus"></i>添加
      </el-button>

      <el-button type="danger" @click="BatchDelete">
        <i class="el-icon-delete"></i>批量删除
      </el-button>
      <el-button @click="preview">
        <i class="el-icon-view"></i>预览
      </el-button>
    </div>

    <div class="app-container flex-item">
      <div class="bg-white" style="height: 100%;">
        <el-table
          :data="list"
          border
          style="width: 100%;"
          :header-cell-style="{'background-color':'azure'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>

          <!-- <el-table-column align="center" :label="'流程代号'">
            <template slot-scope="scope">
              <span>{{scope.row.code}}</span>
            </template>
          </el-table-column>-->

          <el-table-column align="center" :label="'名称'">
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'表单类别'" width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.formType}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'描述'">
            <template slot-scope="scope">
              <span class="link-type">{{scope.row.remark}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'操作'" width="160">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="updateDynamic(scope.$index, scope.row)"
              >编辑</el-button>
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

    <div class="preview_model">
      <el-dialog
        :visible.sync="centerDialogVisible"
        :close-on-click-modal="false"
        width="60%"
        center
      >
        <div class="preview_data" v-for="(data,index) in previewData" :key="index">
          <span class="preview_dynamicName">{{data.dynamicName}} ：</span>
          <span class="preview_options">{{data.options.defaultValue}}</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index";
import {
  getFormData,
  deleteFormData,
  batchDeleteFormData
} from "../../../api/form";

export default {
  name: "forms",
  components: {
    Pagination
  },
  data() {
    return {
      multipleSelection: [],
      list: [],
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        Code: "",
        Name: ""
      },
      listLoading: false,
      centerDialogVisible: false,
      previewData: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(value) {
      if (value) {
        this.listQuery.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }

      this.listLoading = true;
      getFormData(this.listQuery)
        .then(res => {
          this.list = [];
          this.total = res.result.totalCount;
          this.listLoading = false;
          for (let index = 0; index < res.result.items.length; index++) {
            const item = res.result.items[index];
            if (item.formType === 2) {
              item.formType = "开发者表单";
              this.list.push(item);
            }
            if (item.formType === 1) {
              item.formType = "自定义表单";
              this.list.push(item);
            }
          }
        })
        .catch(err => {});
    },
    // 单个删除
    deleteRow(index, row) {
      deleteFormData({
        Code: row.code,
        Name: row.name,
        Id: row.id
      }).then(res => {
        this.getList();
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.previewData = JSON.parse(
        this.multipleSelection[0].contentData
      ).dynamicList;
    },
    // 预览
    preview() {
      this.centerDialogVisible = true;
    },
    // 批量删除
    BatchDelete() {
      let arr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        arr.push(this.multipleSelection[i].id);
      }
      batchDeleteFormData(JSON.stringify(arr)).then(res => {
        console.log(res);
        this.getList();
      });
    },
    // 添加表单
    addDynamic() {
      localStorage.removeItem("formId");
      this.$router.push("/dynamicform");
    },
    // 编辑表单
    updateDynamic(index, row) {
      localStorage.setItem("formId", row.id);
      this.$router.push("/dynamicform");
    },
    search() {
      getFormData(this.listQuery)
        .then(res => {
          this.list = [];
          this.total = res.result.totalCount;
          this.listLoading = false;
          for (let index = 0; index < res.result.items.length; index++) {
            const item = res.result.items[index];
            if (item.formType === 2) {
              item.formType = "开发者表单";
              this.list.push(item);
            }
            if (item.formType === 1) {
              item.formType = "自定义表单";
              this.list.push(item);
            }
          }
        })
        .catch(err => {});
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
.flex-column,
.app-container.flex-item {
  height: calc(100% - 65px);
}

.filter-container {
  text-align: right;
  margin-bottom: 10px;
  padding: 10px 0;
  background: #ffffff;
}
.filter-container .el-input {
  margin-left: 10px;
}
.preview_data {
  padding: 5px;
}
/* span.preview_dynamicName{
  margin-right: 10px;
} */
</style>
<style>
.flex-column .el-table td,
.flex-column .el-table th {
  padding: 6px 0;
}

.preview_model .el-dialog--center .el-dialog__body {
  padding: 0 25px 25px 30px !important;
}
.preview_model .el-dialog__wrapper {
  margin-top: 100px;
}
</style>