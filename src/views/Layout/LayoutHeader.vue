<template>
  <div class="layout-header">
    <el-row>
      <el-col :xs="10" :sm="12" :md="14" :lg="16" :xl="18">
        <div class="system-info">
          <img class="logo" src="@/assets/未标题-1.png" alt />
        </div>
      </el-col>
      <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
        <el-dropdown @command="userCommand" class="system-user">
          <span class="userinfo-inner">
            <img src="@/assets/admin.jpg" alt />
            {{userName}} ，欢迎您登录！！！
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item command="usercenter">个人中心</el-dropdown-item> -->
            <el-dropdown-item divided command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: ""
    };
  },
  computed: {},
  mounted() {
    this.userCommand();

    this.userName = localStorage.getItem("userName");
  },
  methods: {
    userCommand(command) {
      if (command == "logout") {
        localStorage.clear();
        this.$router.replace("/login");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.layout-header {
  background: #495060;
  line-height: 40px;
  height: 40px;
}
.system-info {
  text-align: left;
  .logo {
    /* width: 40px; */
    /* height: 40px; */
    border-radius: 50px;
    // margin-top: 12px;
    margin-left: 20px;
    margin-right: 10px;
    float: left;
    position: relative;
    height: 40px;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    color: azure;
    line-height: 64px;
  }
}
.system-user {
  text-align: right;
  float: right;
  padding-right: 16px;
  height: 40px;

  .userinfo-inner {
    color: #fff;
    font-size: 16px;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin: 0px 0px 10px 10px;
      float: right;
    }
  }
}
.el-row {
  height: 40px;
  line-height: 40px;
}
</style>