<template>
  <v-navigation-drawer
    v-if="isSidebarActive"
    app
    clipped
    permanent
    class="sidebar"
  >
    <!-- <div class="pt-3">
      <v-list-item-title class="text-center font-weight-bold"
        >Welcome Junho!</v-list-item-title
      >
    </div>-->
    <v-list dense>
      <sidebar-top />
      <v-divider></v-divider>
      <sidebar-feed />
      <v-divider></v-divider>
      <SidebarBoard />
      <v-divider></v-divider>
      <SidebarMypage />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapState } from "vuex";

import SidebarTop from "@/components/feeds/SidebarTop.vue";
import SidebarFeed from "@/components/feeds/SidebarFeed.vue";
import SidebarBoard from "@/components/feeds/SidebarBoard.vue";
import SidebarMypage from "@/components/pages/SidebarMypage.vue";

@Component({
  components: {
    SidebarTop,
    SidebarFeed,
    SidebarBoard,
    SidebarMypage
  },
  computed: mapState("mypageModule", ["isSidebarActive"])
})
export default class AppSidebar extends Vue {}
</script>

<style scoped>
.sidebar {
  background-color: #f6f7f8 !important;
}
</style>
