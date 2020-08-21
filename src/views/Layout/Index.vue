<template>
  <div class="layout">
    <LayoutHeader></LayoutHeader>
    <Content>
      <Sidebar slot="left"></Sidebar>
      <router-view slot="content"></router-view>
    </Content>
  </div>
</template>
<script>
import LayoutHeader from "./LayoutHeader.vue";
import Content from "./Content.vue";
import Sidebar from "./Sidebar.vue";
export default {
  name: "index",
  components: {
    LayoutHeader,
    Sidebar,
    Content
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #f5f7f9;
}
</style>