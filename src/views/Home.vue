<template>
  <div class="home">
    <div class="home-content" v-for="(list,index) in typeList" :key="index">
      <div class="title" v-if="list.flowDefinitions.length > 0">{{list.flowTypeName}}</div>

      <div class="content" v-if="list.flowDefinitions.length > 0">
        <div class="row">
          <div
            class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
            v-for="(item,i) in list.flowDefinitions"
            :key="i"
          >
            <div @click="addFlow(item)" class="aaaaa">
              <div
                class="img"
                :style="{backgroundPositionY:'-' + item.topSize  + 'px'  ,backgroundPositionX:'-' +item.leftSize + 'px'}"
              ></div>
              <div class="name">{{item.flowName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetFlowTypes } from "../api/flow";
import { GetEnclosure } from "../api/uplaod";
export default {
  name: "home",
  components: {},
  data() {
    return {
      typeList: [],
      backgroundStyle: ""
    };
  },
  created() {
    if (localStorage.Token) {
      this.$store.dispatch("setUser", localStorage.Token);
    }
  },
  mounted() {
    this.getType();
  },

  methods: {
    addFlow(item) {
      this.$router.push({ name: "addMyFlow", params: { item: item } });
    },
    getType() {
      GetFlowTypes().then(res => {
        this.typeList = res.result;

        this.typeList.forEach((item, index) => {
          item.flowDefinitions.forEach(element => {
            // var a = element.leftSize + "px";
            // var b = element.topSize + "px";
            // element.size = a + "\xa0" + b;

            element.topSize = element.topSize - 45;
            element.leftSize = element.leftSize - 40;
          });
        });
      });
    }
  }
};
</script>
<style scoped lang="scss">
.title {
  font-weight: 600;
  padding: 15px;
}
.content {
  padding: 0 0 15px 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e6e6e6;
  .name {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    cursor: pointer;
    margin: 5px 0 10px 0;
  }
  .aaaaa {
    text-align: center;
  }
  .img {
    cursor: pointer;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    background-image: url("../assets/404_images/办公网2.png");
  }
}
</style>