<template>
  <div class="see_comment">
    <el-dialog
      :title="dialogComment.title"
      :visible.sync="dialogComment.show"
      :close-on-click-modal="false"
    >
      <div class="comment">
        <!-- <el-input
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
        </el-button>-->
      </div>
      <el-table
        :data="commentsList"
        border
        fit
        highlight-current-row
        v-loading="listLoading"
        style="width: 100%;"
      >
        <el-table-column :label="'执行人'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.executorName}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'执行时间'" width="190px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creationTime | format}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'完成时间'" width="190px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.finishDate | format}}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'意见'" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.comments}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="listQuery.MaxResultCount"
        @pagination="getCommentList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPersonnelGroup()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { GetAllComments } from "../../../api/flowCenter";
import { format } from "../../../utils/filter";
import Pagination from "../../../components/Pagination/index";

export default {
  name: "personnelGroup",
  props: {
    dialogComment: Object,
    commentsId: String
  },
  components: {
    Pagination
  },
  filters: {
    format(time) {
      let date = new Date(time);
      return format(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  data() {
    return {
      commentsList: [],
      total: 0,
      page: 1,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 10,
        FlowInstanceId: "",
        FlowNodeName: "",
        FlowTaskLinkName: "",
        AssignUserName: ""
        // FinishStatus: false
      },
      listLoading: false
    };
  },
  mounted() {},
  methods: {
    getCommentList(value) {
      if (value) {
        this.page = value.page;
        this.listQuery.SkipCount = (value.page - 1) * 10;
      }
      this.listLoading = true;
      this.listQuery.FlowInstanceId = this.commentsId;
      GetAllComments(this.listQuery).then(res => {
        this.commentsList = res.result.items;
        this.total = res.result.totalCount;
        this.listLoading = false;
      });
    },
    search() {
      this.listLoading = true;
      this.listQuery.FlowInstanceId = this.commentsId;
      GetAllComments(this.listQuery).then(res => {
        this.commentsList = res.result.items;
        this.total = res.result.totalCount;
        this.listLoading = false;
      });
    },
    submitPersonnelGroup() {
      this.dialogComment.show = false;
    }
  }
};
</script>
<style>
.see_comment .el-table td,
.see_comment .el-table th {
  padding: 5px 0 !important;
}
.see_comment .el-dialog {
  width: 60%;
}
.see_comment .el-dialog__body {
  padding: 10px 20px;
}
.see_comment .el-dialog__header {
  height: 35px;
  line-height: 35px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  background-color: #f8f8f8;
  padding: 0 20px;
  font-weight: 600;
}
.see_comment .el-dialog__title {
  line-height: 34px;
  font-size: 14px;
  color: #333;
}
.see_comment .el-dialog__headerbtn {
  top: 0;
}
</style>
<style scoped>
.el-button {
  padding: 6px 10px;
  font-size: 12px;
  margin-left: 20px;
}
</style>