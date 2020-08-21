<template>
  <div class="img-uplaod-container" :id="uploadId">
    <el-upload
      class="upload-demo"
      action="2222"
      :multiple="true"
      :auto-upload="false"
      :before-upload="doUploads"
      :on-change="handleChange"
      :file-list="fileList"
      name="file"
      :show-file-list="false"
    >
      <div class="plus">
        <i class="el-icon-plus"></i>
      </div>
    </el-upload>

    <Model
      :visible="previewVisible"
      @on-close="previewVisible = false"
      ref="formPreview"
      width="600px"
      form
    >
      <img :src="previewUrl" alt style="display: block;width: 80%;margin: 0 auto;" />
      <template slot="action">
        <el-button size="mini" @click="previewVisible = false">关闭</el-button>
      </template>
    </Model>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import Model from "./Model";

import {
  UploadIForm,
  GetEnclosuresByKey,
  GetEnclosure,
  DeleteEnclosure
} from "../../../api/uplaod";

import Bus from "../../bus";
export default {
  components: {
    Draggable,
    Model
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    token: {
      type: String,
      default: ""
    },
    domain: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 9
    },
    isQiniu: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    meitu: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      previewVisible: false,
      previewUrl: "",
      fileList: this.value.map(item => {
        return {
          key: item.key
            ? item.key
            : new Date().getTime() + "_" + Math.ceil(Math.random() * 99999),
          url: item.url,
          isImg: item.isImg,
          percent: item.percent ? item.percent : 100,
          status: item.status ? item.status : "success"
        };
      }),
      viewer: null,
      uploadId: "upload_" + new Date().getTime(),
      editIndex: -1,
      meituIndex: -1,

      fileList: [],
      listId: ""
    };
  },
  mounted() {
    this.$emit("input", this.fileList);
    // this.getList();
  },
  methods: {
    doUploads(files) {},
    handleChange(file, fileList) {
      // console.log(fileList);
      const formData = new FormData();
      formData.append("files", file.raw);
      // formData.append("Id", localStorage.getItem("formId"));
      formData.append("Id", localStorage.getItem("changeFlowId"));

      UploadIForm(formData).then(res => {
        this.getList();
      });
    },
    removeFile(file, fileList) {
      // console.log(file);
    },
    // 获取列表
    getList() {
      GetEnclosuresByKey({ ID: localStorage.getItem("changeFlowId") }).then(
        res => {
          this.list = res.result;

          Bus.$emit("clickFile", this.list);
          Bus.$emit("listFile", this.list);

          // localStorage.removeItem("formId");
        }
      );
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler(val) {
        // console.log(val)
        // this.$emit('input', this.fileList)
      }
    }
  }
};
</script>



<style scoped>
.plus {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
}
.plus:hover {
  border-color: #409eff;
}
.plus i {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
<style>
.img-uplaod-container input[type="file"] {
  display: none;
}
</style>
