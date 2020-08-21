<template>
  <el-scrollbar class="el-scrollbar">
    <el-menu class="el-menu-slide" :default-active="$router.menuPath" router :unique-opened="true">
      <el-menu-item index="/home">
        <img src="../../assets/404_images/首页-选中.png" alt />
        <span slot="title">首页</span>
      </el-menu-item>
      <template v-for="item in rouetrList">
        <div v-if="item.rootId == '00000000-0000-0000-0000-000000000000' && !item.children">
          <!-- <router-link :to="item.menuPath"> -->
          <el-menu-item :index="item.menuPath">
            <template slot="title">
              <img :src="item.icon" alt />
              <span slot="title">{{item.nodeName}}</span>
            </template>
          </el-menu-item>
          <!-- </router-link> -->
        </div>

        <el-submenu
          v-if="item.rootId == '00000000-0000-0000-0000-000000000000' && item.children"
          :index="item.menuPath"
        >
          <template slot="title">
            <img :src="item.icon" alt />
            <span slot="title">{{item.nodeName}}</span>
          </template>

          <template v-for="child in item.children">
            <!-- <router-link :to="child.menuPath" :key="child.nodeName"> -->
            <el-menu-item :index="child.menuPath">
              <template slot="title">
                <img :src="child.icon" alt class="aaaa" />
                <span slot="title">{{child.nodeName}}</span>
              </template>
            </el-menu-item>
            <!-- </router-link> -->
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
export default {
  name: "SideBar",
  data() {
    return {
      rouetrList: []
    };
  },
  computed: {
    routers() {
      return this.$store.state.routers;
    }
  },
  mounted() {
    setTimeout(() => {
      this.rouetrList = this.routers;
      // console.log(this.rouetrList);
    }, 1000);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
  border-right: 1px solid #e6e6e6;
  background: #fff;

  .el-menu-slide {
    border-right: none;

    i {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
  }
}
.el-submenu__title {
  font-size: 13px;
}
.el-menu-item,
.el-submenu__title {
  height: 40px;
  line-height: 40px;
}
.el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
  font-size: 12px;
}

img {
  width: 15px;
  height: 15px;
  margin-right: 10px;
}
</style>
<style >
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.el-scrollbar a:hover {
  text-decoration: none;
  color: none;
}

.el-menu-item.is-active {
  color: #409eff !important;
  background: rgb(238, 241, 246) !important;
}
</style>