export const tools = [
  {
    type: 'drag',
    icon: 'el-icon-rank',
    defaultIcon: 'el-icon-rank',
    name: '拖拽'
  },
  {
    type: 'connection',
    icon: 'iconfont icon-Connection',
    defaultIcon: 'iconfont icon-Connection',
    name: '连线'
  }
]

export const commonPoints = [
  {
    // type: 'StartNode',
    nodeName: '开始节点',
    icon: 'iconfont icon-kaishi1',
    defaultIcon: 'iconfont icon-kaishi1',
    belongTo: 'commonPoints'
  },
  {
    // type: 'WorkNode',
    nodeName: '工作节点',
    icon: 'iconfont icon-gongzuo1',
    defaultIcon: 'iconfont icon-gongzuo1',
    belongTo: 'commonPoints'
  },
  // {
  //   // type: 'AutoNode',
  //   nodeName: '自动节点',
  //   icon: 'iconfont icon-zidong1',
  //   defaultIcon: 'iconfont icon-zidong1',
  //   belongTo: 'commonPoints'
  // },
  // {
  //   // type: 'MeetingNode',
  //   nodeName: '会签节点',
  //   icon: 'iconfont icon-huiqian1',
  //   defaultIcon: 'iconfont icon-huiqian1',
  //   belongTo: 'commonPoints'
  // },
  {
    // type: 'EndNode',
    nodeName: '结束节点',
    icon: 'iconfont icon-jieshu1',
    defaultIcon: 'iconfont icon-jieshu',
    belongTo: 'commonPoints'
  }
]



export const lanes = [
  {
    // type: 'x-lane',
    nodeName: '横向泳道',
    icon: 'iconfont icon-icon',
    defaultIcon: 'iconfont icon-icon',
    belongTo: 'lanes'
  },
  {
    // type: 'y-lane',
    nodeName: '纵向泳道',
    icon: 'iconfont icon-zongxiang',
    defaultIcon: 'iconfont icon-zongxiang',
    belongTo: 'lanes'
  }
]
