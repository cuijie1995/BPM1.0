// console.log('url', process.env.BASE_API)
const baseUrl = 'http://192.168.0.196:8020'
export const basicComponents = [
  {
    type: 'input',
    icon: 'icon-input',
    dynamicName: '单行文本',
    options: {
      width: '100%',
      defaultValue: '',
      identification: "",
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false
    }
  },
  {
    type: 'textarea',
    icon: 'icon-diy-com-textarea',
    dynamicName: '多行文本',
    options: {
      width: '100%',
      defaultValue: '',
      identification: "",
      required: false,
      disabled: false,
      pattern: '',
      placeholder: ''
    }
  },
  {
    type: 'number',
    icon: 'icon-number',
    dynamicName: '计数器',
    options: {
      width: '',
      required: false,
      defaultValue: 0,
      identification: "",
      min: '',
      max: '',
      step: 1,
      disabled: false,
      controlsPosition: ''
    }
  },
  {
    type: 'radio',
    icon: 'icon-radio-active',
    dynamicName: '单选框组',
    options: {
      inline: true,
      defaultValue: '',
      identification: "",
      showLabel: false,
      options: [
        {
          value: 'Option 1',
          label: '选项 1'
        },
        {
          value: 'Option 2',
          label: '选项 2'
        },
        {
          value: 'Option 3',
          label: '选项 3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      disabled: false
    }
  },
  {
    type: 'checkbox',
    icon: 'icon-check-box',
    dynamicName: '多选框组',
    options: {
      inline: true,
      defaultValue: [],
      identification: "",
      showLabel: false,
      options: [
        {
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        },
        {
          value: 'Option 3'
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      disabled: false
    }
  },
  {
    type: 'time',
    icon: 'icon-time',
    dynamicName: '时间选择器',
    options: {
      defaultValue: '21:19:56',
      identification: "",
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm:ss',
      required: false,
      width: ''
    }
  },
  {
    type: 'date',
    icon: 'icon-date',
    dynamicName: '日期选择器',
    options: {
      defaultValue: '',
      identification: "",
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      width: ''
    }
  },
  {
    type: 'text',
    icon: 'icon-wenzishezhi-',
    dynamicName: '文字',
    options: {
      defaultValue: 'This is a text',
      identification: "",
      customClass: ''
    }
  },
  {
    type: 'imgupload',
    icon: 'icon-tupian',
    dynamicName: '图片/文件',
    options: {
      defaultValue: [],
      identification: "",
      required: false,
      size: {
        width: 100,
        height: 100
      },
      width: '',
      tokenFunc: 'funcGetToken',
      token: '',
      disabled: false,
      length: 8,
      multiple: false,
      isQiniu: false,
      isDelete: false,
      min: 0,
      isEdit: false,
      action: `${baseUrl}/api/services/app/Enclosure/UploadIForm`
    }
  },
  {
    type: 'select',
    icon: 'icon-select',
    dynamicName: '下拉选择框',
    options: {
      defaultValue: '',
      identification: "",
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '',
      options: [
        {
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        }, {
          value: 'Option 3'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'grid',
    icon: 'icon-grid-',
    dynamicName: '栅格布局',
    columns: [
      {
        span: 12,
        dynamicList: []
      },
      {
        span: 12,
        dynamicList: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  }
]

export const advanceComponents = [
  // {
  //   type: 'blank',
  //   icon: 'icon-zidingyishuju',
  //   options: {
  //     defaultType: 'String'
  //   }
  // },
  // {
  //   type: 'editor',
  //   icon: 'icon-fuwenbenkuang',
  //   options: {
  //     defaultValue: '',
  //     width: ''
  //   }
  // },
  // {
  //   type: 'cascader',
  //   icon: 'icon-jilianxuanze',
  //   options: {
  //     defaultValue: [],
  //     width: '',
  //     placeholder: '',
  //     disabled: false,
  //     clearable: false,
  //     remote: true,
  //     remoteOptions: [],
  //     props: {
  //       value: 'value',
  //       label: 'label',
  //       children: 'children'
  //     },
  //     remoteFunc: ''
  //   }
  // }
]

export const layoutComponents = [
  {
    type: 'grid',
    icon: 'icon-grid-',
    dynamicName: '栅格布局',
    columns: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  }
]
