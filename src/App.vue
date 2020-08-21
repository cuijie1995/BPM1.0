<template>
  <div id="app">
    <router-view v-if="IsRouterAlive" />
  </div>
</template>
<script>
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      IsRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.IsRouterAlive = false;
      this.$nextTick(function() {
        this.IsRouterAlive = true;
      });
    }
  },
  created() {
    if (localStorage.Token) {
      this.$store.dispatch("setUser", localStorage.Token);
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
html,
body {
  margin: 0;
  padding: 0;
}
</style>