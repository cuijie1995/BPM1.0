<template>
  <div class="form_item">
    <el-form-item :label="formData.name" :prop="formData.model">
      <template v-if="formData.type == 'input'">
        <el-input
          v-if="formData.options.dataType == 'number' || formData.options.dataType == 'integer' || formData.options.dataType == 'float'"
          :type="formData.options.dataType"
          v-model.number="dataModel"
          :style="{width: formData.options.width}"
          :disabled="true"
        ></el-input>
        <el-input
          v-else
          :type="formData.options.dataType"
          v-model="dataModel"
          :disabled="true"
          :style="{width: formData.options.width}"
        ></el-input>
      </template>

      <template v-if="formData.type == 'textarea'">
        <el-input
          type="textarea"
          :rows="5"
          v-model="dataModel"
          :disabled="true"
          :style="{width: formData.options.width}"
        ></el-input>
      </template>

      <template v-if="formData.type == 'number'">
        <el-input-number
          v-model="dataModel"
          :style="{width: formData.options.width}"
          controls-position="right"
          :disabled="true"
        ></el-input-number>
      </template>

      <template v-if="formData.type == 'radio'">
        <el-radio-group
          v-model="dataModel"
          :style="{width: formData.options.width}"
          :disabled="true"
        >
          <el-radio
            :style="{display: formData.options.inline ? 'inline-block' : 'block'}"
            :label="item.value"
            v-for="(item, index) in (formData.options.remote ? formData.options.remoteOptions : formData.options.options)"
            :key="index"
          >
            <template v-if="formData.options.remote">{{item.label}}</template>
            <template v-else>{{formData.options.showLabel ? item.label : item.value}}</template>
          </el-radio>
        </el-radio-group>
      </template>

      <template v-if="formData.type == 'checkbox'">
        <el-checkbox-group
          v-model="dataModel"
          :style="{width: formData.options.width}"
          :disabled="true"
        >
          <el-checkbox
            :style="{display: formData.options.inline ? 'inline-block' : 'block'}"
            :label="item.value"
            v-for="(item, index) in (formData.options.remote ? formData.options.remoteOptions : formData.options.options)"
            :key="index"
          >
            <template v-if="formData.options.remote">{{item.label}}</template>
            <template v-else>{{formData.options.showLabel ? item.label : item.value}}</template>
          </el-checkbox>
        </el-checkbox-group>
      </template>

      <template v-if="formData.type == 'time'">
        <el-time-picker
          v-model="dataModel"
          readonly
          :disabled="true"
          :value-format="formData.options.format"
          :style="{width: formData.options.width}"
        ></el-time-picker>
      </template>

      <template v-if="formData.type=='date'">
        <el-date-picker
          v-model="dataModel"
          :type="formData.options.type"
          readonly
          :disabled="true"
          :value-format="formData.options.timestamp ? 'timestamp' : formData.options.format"
          :format="formData.options.format"
          :style="{width: formData.options.width}"
        ></el-date-picker>
      </template>

      <template v-if="formData.type =='rate'">
        <el-rate v-model="dataModel" :disabled="true"></el-rate>
      </template>

      <template v-if="formData.type == 'color'">
        <el-color-picker v-model="dataModel" :disabled="true"></el-color-picker>
      </template>

      <template v-if="formData.type == 'select'">
        <el-select
          v-model="dataModel"
          :disabled="true"
          :multiple="formData.options.multiple"
          :style="{width: formData.options.width}"
        >
          <el-option
            v-for="item in (formData.options.remote ? formData.options.remoteOptions : formData.options.options)"
            :key="item.value"
            :value="item.value"
            :label="formData.options.showLabel || formData.options.remote?item.label:item.value"
          ></el-option>
        </el-select>
      </template>

      <template v-if="formData.type=='switch'">
        <el-switch v-model="dataModel" :disabled="true"></el-switch>
      </template>

      <template v-if="formData.type=='slider'">
        <el-slider
          v-model="dataModel"
          :disabled="true"
          :step="formData.options.step"
          :show-input="formData.options.showInput"
          :range="formData.options.range"
          :style="{width: formData.options.width}"
        ></el-slider>
      </template>

      <template v-if="formData.type === 'imgupload'">
        <Upload
          v-model="dataModel"
          :disabled="formData.options.disabled"
          :style="{'width': formData.options.width}"
          :width="formData.options.size.width"
          :height="formData.options.size.height"
          :token="formData.options.token"
          :domain="formData.options.domain"
          :multiple="formData.options.multiple"
          :length="formData.options.length"
          :is-qiniu="formData.options.isQiniu"
          :is-delete="formData.options.isDelete"
          :min="formData.options.min"
          :is-edit="formData.options.isEdit"
          :action="formData.options.action"
        ></Upload>
      </template>

      <template v-if="formData.type == 'editor'">
        <vue-editor v-model="dataModel" :style="{width: formData.options.width}"></vue-editor>
      </template>

      <template v-if="formData.type == 'cascader'">
        <el-cascader
          v-model="dataModel"
          :disabled="formData.options.disabled"
          :clearable="formData.options.clearable"
          :placeholder="formData.options.placeholder"
          :style="{width: formData.options.width}"
          :options="formData.options.remoteOptions"
        ></el-cascader>
      </template>

      <template v-if="formData.type == 'text'">
        <span>{{dataModel}}</span>
      </template>
    </el-form-item>
  </div>
</template>

<script>
import Upload from "./ImageUpload";
export default {
  props: ["formData", "models", "rules", "remote"],
  components: {
    Upload
  },
  data() {
    return {
      dataModel: this.models[this.formData.model],
      value1: ""
    };
  },
  created() {
    if (
      this.formData.options.remote &&
      this.remote[this.formData.options.remoteFunc]
    ) {
      this.remote[this.formData.options.remoteFunc](data => {
        this.formData.options.remoteOptions = data.map(item => {
          return {
            value: item[this.formData.options.props.value],
            label: item[this.formData.options.props.label],
            children: item[this.formData.options.props.children]
          };
        });
      });
    }
    if (this.formData.type === "imgupload" && this.formData.options.isQiniu) {
      this.remote[this.formData.options.tokenFunc](data => {
        this.formData.options.token = data;
      });
    }
  },
  methods: {},
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        // console.log(val)
        this.models[this.formData.model] = val;
        this.$emit("update:models", {
          ...this.models,
          [this.formData.model]: val
        });
      }
    },
    models: {
      deep: true,
      handler(val) {
        // console.log(val)
        this.dataModel = val[this.formData.model];
      }
    }
  }
};
</script>