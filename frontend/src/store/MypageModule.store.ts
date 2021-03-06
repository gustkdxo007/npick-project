import { Module } from "vuex";
import { RootState } from "./index";
import {
  MypageModule,
  PostDir,
  Post,
  Tag,
  AllTag
} from "@/store/MypageInterface.ts";
import { Axios } from "@/service/axios.service";
import router from "@/router";
import QueryString from "qs";

const module: Module<MypageModule, RootState> = {
  namespaced: true,

  state: {
    isSidebarActive: true,
    isCreateFolderModalActive: false,
    postDirList: [],
    postDir: null,
    allTagDir: [],
    tagDir: [],
    post: null,
    postDirId: null,
    postId: null,
    tagName: null,
    postDirName: null,
    postDirContextMenu: {
      showCtx: false,
      x: 0,
      y: 0
    },
    postContextMenu: {
      showCtx: false,
      x: 0,
      y: 0
    },
    rssChannel: 0,
    saveNews: 0,
    users: 0
  },

  getters: {},

  mutations: {
    TOGGLE_SIDEBAR(state) {
      state.isSidebarActive = !state.isSidebarActive;
    },

    TOGGLE_CREATEFOLDERMODAL(state) {
      state.isCreateFolderModalActive = !state.isCreateFolderModalActive;
    },

    SET_POSTDIR_LIST(state, postDirList: PostDir[]) {
      state.postDirList = postDirList;
    },

    SET_POSTDIR(state, postDir: Post[]) {
      state.postDir = postDir;
    },

    SELECT_POSTDIR(state, { postDirId }) {
      state.postDirId = postDirId;
    },

    SELECT_TAGDIR(state, { tagName }) {
      state.tagName = tagName;
    },

    SET_TAGDIR(state, tagDir: Post[]) {
      state.tagDir = tagDir;
    },

    SET_ALLTAGDIR(state, allTagDir: AllTag[]) {
      state.allTagDir = allTagDir;
    },

    SET_POST(state, post: Post) {
      state.post = post;
    },

    SELECT_POST(state, { postId }) {
      state.postId = postId;
    },

    SET_POSTDIR_CONTEXT_MENU(state, ctx) {
      state.postDirContextMenu.showCtx = false;
      state.postDirContextMenu = ctx;
    },

    SET_POST_CONTEXT_MENU(state, ctx) {
      state.postContextMenu.showCtx = false;
      state.postContextMenu = ctx;
    },

    SET_MAINPAGE_COUNT(state) {
      Axios.instance
        .get("api/public/count")
        .then(({ data }) => {
          state.rssChannel = data.data.rssCount;
          state.saveNews = data.data.subscribeCount;
          state.users = data.data.userCount;
        })
        .catch(err => console.error(err));
    }
  },

  actions: {
    FETCH_POSTDIR_LIST({ commit }) {
      Axios.instance
        .get("/api/postdir/find/user")
        .then(({ data }) => {
          commit("SET_POSTDIR_LIST", data.data);
        })
        .catch(err => console.error(err));
    },

    FETCH_POSTDIR({ commit }, postDirId: number) {
      const postData = {
        params: {
          postDirId
        }
      };
      Axios.instance
        .get("/api/postdir/find/postdir", postData)
        .then(({ data }) => {
          commit("SET_POSTDIR", data.data);
        })
        .catch(err => console.error(err));
    },

    FETCH_TAGDIR({ commit }, tagName: string) {
      const tagData = {
        params: {
          tagName
        }
      };
      Axios.instance
        .get("/api/post/find/tagname", tagData)
        .then(({ data }) => {
          commit("SET_TAGDIR", data.data);
        })
        .catch(err => console.error(err));
    },

    FETCH_ALLTAGDIR({ commit }) {
      Axios.instance
        .get("/api/tag/count")
        .then(({ data }) => {
          commit("SET_ALLTAGDIR", data.data);
        })
        .catch(err => console.log(err));
    },

    FETCH_POST({ commit }, postId: number) {
      const postData = {
        params: {
          postId
        }
      };
      Axios.instance
        .get("/api/post/find/postid", postData)
        .then(({ data }) => {
          commit("SET_POST", data.data);
        })
        .catch(err => console.error(err));
    },

    ADD_POSTDIR({ dispatch }, postDirName: string) {
      Axios.instance
        .post("/api/postdir/save", { postDirName })
        .then(({ data }) => {
          dispatch("FETCH_POSTDIR_LIST");
        })
        .catch(err => console.error(err));
    },

    UPDATE_POSTDIR(
      { dispatch, state },
      { postDirId, postDirName }: { postDirId: number; postDirName: string }
    ) {
      const postDirData = {
        params: {
          postDirId,
          postDirName
        }
      };
      Axios.instance
        .put("/api/postdir/update", null, postDirData)
        .then(() => {
          dispatch("FETCH_POSTDIR_LIST");
        })
        .then(() => {
          if (Number(state.postDirId) === postDirId) {
            dispatch("FETCH_POSTDIR", postDirId);
          }
        })
        .catch(err => console.error(err));
    },

    ADD_POST(
      { dispatch },
      {
        postContent,
        postDirId,
        postTitle,
        tagList
      }: {
        postContent: string;
        postDirId: number;
        postTitle: string;
        tagList: string[];
      }
    ) {
      const postData = {
        postContent,
        postDirId,
        postTitle,
        tagList
      };
      Axios.instance
        .post("/api/post/save", postData)
        .then(({ data }) => {
          dispatch("FETCH_POSTDIR", data.data.postDirId);
          dispatch("FETCH_POSTDIR_LIST");
        })
        .catch(err => console.error(err));
    },

    UPDATE_POST(
      { dispatch },
      {
        postContent,
        postDirId,
        postId,
        postTitle,
        tagList
      }: {
        postContent: string;
        postDirId: number;
        postId: number;
        postTitle: string;
        tagList: [];
      }
    ) {
      const postData = {
        postContent: postContent,
        postDirId: postDirId,
        postId: postId,
        postTitle: postTitle,
        tagList: tagList
      };
      Axios.instance
        .put("/api/post/update", postData)
        .then(({ data }) => {
          dispatch("FETCH_POSTDIR", data.data.postDirId);
          dispatch("FETCH_POSTDIR_LIST");
        })
        .catch(err => console.error(err));
    },

    DELETE_POSTDIR({ dispatch }, { postDirId, routeName, routePostDirId }) {
      const postDirData = {
        params: {
          postDirId
        }
      };
      Axios.instance
        .delete("/api/postdir/delete", postDirData)
        .then(() => {
          dispatch("FETCH_POSTDIR_LIST");
          if (
            ["PostDir", "NewPost", "NewScrapFromGoole", "EditPost"].includes(
              routeName
            ) &&
            postDirId === Number(routePostDirId)
          ) {
            router.push({ name: "Home" });
          }
        })
        .catch(err => console.error(err));
    },

    DELETE_POST(
      { dispatch },
      { postId, postDirId }: { postId: number; postDirId: number }
    ) {
      const postData = {
        params: {
          postId
        }
      };
      Axios.instance
        .delete("/api/post/delete", postData)
        .then(() => {
          dispatch("FETCH_POSTDIR", postDirId);
        })
        .catch(err => console.error(err));
    },

    SAVE_SCRAPDATA({ dispatch }, key: string) {
      const scrapData = {
        params: {
          key: key
        }
      };
      Axios.instance
        .get("/api/scrap/load", scrapData)
        .then(({ data }) => {
          localStorage.setItem("scrapData", data.data.scrap);
        })
        .catch(err => console.error(err));
    }
  }
};

export default module;
