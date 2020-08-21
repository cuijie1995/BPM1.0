<template>
  <el-container class="layout-content">
    <el-aside width="200px">
      <slot name="left"></slot>
    </el-aside>

    <el-main>
      <div class="top">
        <el-breadcrumb class="breadcrumb" separator="/">
          <el-breadcrumb-item
            v-for="(item,index) in breadCrumbItems"
            :key="index"
            :to="{path:item.path}"
          >{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      breadCrumbItems: []
    };
  },
  watch: {
    $route() {
      this.initBreadCrumbItems(this.$route);
    }
  },
  created() {
    this.initBreadCrumbItems(this.$route);
  },
  methods: {
    initBreadCrumbItems(router) {
      this.breadCrumbItems = [{ path: "/" }];
      for (const index in router.matched) {
        if (router.matched[index].meta && router.matched[index].meta.title) {
          this.breadCrumbItems.push({
            path: router.matched[index].path ? router.matched[index].path : "/",
            title: router.matched[index].meta.title
          });
        }
      }
      this.breadCrumbItems = this.breadCrumbItems;
    }
  }
};
</script>
<style lang="scss" scoped>
.layout-content {
  width: 100%;
  height: calc(100% - 40px) !important;

  .el-main {
    padding: 0;

    .top {
      background: #fff;
      height: 35px;
      line-height: 35px;
      border-right: none;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      position: fixed;
      width: 100%;
      z-index: 100;

      i {
        font-size: 20px;
        cursor: pointer;
        padding-left: 16px;
        margin-right: 15px;
      }

      .breadcrumb {
        padding-left: 16px;
        margin-bottom: 0;
        width: 100%;
      }
    }

    .content {
      padding: 5px 10px 10px 10px;
      height: calc(100% - 36px);
      box-sizing: border-box;
      margin-top: 36px;
    }
  }
}
</style>