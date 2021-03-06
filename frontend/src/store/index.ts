import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import feedModule from "./FeedModule.store";
import mypageModule from "./MypageModule.store";

import { Axios } from "@/service/axios.service";

import router from "@/router";

import qs from "qs";

const STORAGE = window.sessionStorage;

Vue.use(Vuex);

export interface RootState {
  JWT: string | null;
  duplicate: boolean;
  userName: string | null;
}

const store: StoreOptions<RootState> = {
  modules: {
    feedModule,
    mypageModule
  },
  state: {
    JWT: STORAGE.getItem("jwt-token"),
    duplicate: false,
    userName: STORAGE.getItem("name")
  },
  getters: {
    isLoggedIn: state => !!state.JWT,
    config: state => ({ headers: { Authorization: `${state.JWT}` } })
  },
  mutations: {
    SET_TOKEN(state, token: string) {
      state.JWT = token;
      STORAGE.setItem("jwt-token", token);
      Axios.instance.defaults.headers.common[
        "Authorization"
      ] = window.sessionStorage.getItem("jwt-token");
    },

    SET_NAME(state, userName: string) {
      state.userName = userName;
      STORAGE.setItem("name", userName);
    },

    CHECK_DUPLICATE(state) {
      state.duplicate = true;
    }
  },
  actions: {
    postAuthData({ commit }, info) {
      Axios.instance
        .post("/api/public/login", qs.stringify(info.data), {
          withCredentials: true
        })
        .then(res => {
          commit("SET_TOKEN", res.data.data["userPassword"]);
          const scrapKey = localStorage.getItem("scrapKey");
          if (scrapKey) {
            router.push({
              name: "SelectFromOutside",
              params: { scrapKey }
            });
          } else {
            router.push("/");
          }
        })
        .catch(err => {
          console.log("err", err);
          alert("아이디 또는 비밀번호가 옳지 않습니다.");
        });
    },

    signup(context, signupData) {
      Axios.instance
        .post("/api/public/signup", signupData, {
          withCredentials: true
        })
        .then(res => {
          alert("회원가입이 완료되었습니다.");
          router.push("/login");
        })
        .catch(err => {
          console.log("err", err);
          alert("회원가입 실패입니다.");
        });
    },

    checkId({ commit }, signupData) {
      Axios.instance
        .post("/api/public/signup/checkid", qs.stringify(signupData), {
          withCredentials: true
        })
        .then(res => {
          commit("CHECK_DUPLICATE");
          alert("사용가능한 이메일 입니다.");
        })
        .catch(err => {
          alert("이미 가입된 이메일 입니다.");
        });
    },

    login({ dispatch }, loginData) {
      const info = {
        data: loginData
      };
      dispatch("postAuthData", info);
    },

    logout({ getters, commit }) {
      commit("SET_TOKEN", null);
      STORAGE.removeItem("jwt-token");
      STORAGE.removeItem("name");
      router.push("/cover");
    },

    updateUser({ commit }, userName) {
      Axios.instance
        .put("/api/user/update", qs.stringify({ userName }))
        .then(() => {
          commit("SET_NAME", userName);
          alert("닉네임이 변경되었습니다.");
          router.push("/");
        })
        .catch(err => console.log("err", err));
    },

    updateUserPassword({ dispatch }, userPassword) {
      Axios.instance
        .put("/api/update/user/password", qs.stringify(userPassword))
        .then(() => {
          alert("비밀번호가 변경되었습니다.");
          dispatch("login", {
            userId: userPassword.userId,
            userPassword: userPassword.changePassword
          });
        })
        .catch(err => {
          alert("회원정보가 옳지 않습니다.");
          console.log("err", err);
        });
    },

    deleteUser({ getters, commit }) {
      Axios.instance
        .delete("/api/user/delete")
        .then(() => {
          commit("SET_TOKEN", null);
          STORAGE.removeItem("jwt-token");
          alert("회원탈퇴가 완료되었습니다.");
          router.push("/cover");
        })
        .catch(err => console.log(err.response));
    }
  }
};

export default new Vuex.Store(store);
