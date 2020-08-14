import { Module } from "vuex";
import { RootState } from "./index";
import {
  FeedModule,
  Article,
  FeedList,
  Rss,
  Feed,
  Board,
  News
} from "./Feed.interface";
import { Axios } from "@/service/axios.service";
import router from "@/router";

const module: Module<FeedModule, RootState> = {
  namespaced: true,
  state: {
    rssList: [],
    feedList: [],
    boardList: [],
    article: null,
    feed: null,
    board: null,
    news: null,
    subscribeId: null,
    articleList: [],
    subsContextMenu: {
      showCtx: false,
      x: 0,
      y: 0
    },
    feedContextMenu: {
      showCtx: false,
      x: 0,
      y: 0
    },
    boardContextMenu: {
      showCtx: false,
      x: 0,
      y: 0
    }
  },

  getters: {},

  mutations: {
    SET_FEED_LIST(state, feedList: FeedList[]) {
      state.feedList = feedList;
    },

    ADD_FEED(state, feed: FeedList) {
      state.feedList.push(feed);
    },

    SET_FEED(state, feed: FeedList) {
      state.feed = feed;
    },

    SET_BOARD_LIST(state, boardList: Board[]) {
      state.boardList = boardList;
    },

    SET_BOARD(state, board: Board) {
      state.board = board;
    },

    SET_NEWS(state, news: News) {
      state.news = news;
    },

    SET_RSS_LIST(state, rssList: Rss[]) {
      state.rssList = rssList;
    },

    SET_SELECTED_SUBSCRIPTION(state, subscribeId: number) {
      state.subscribeId = subscribeId;
    },

    SELECT_ARTICLE(state, article: Article) {
      state.article = article;
    },

    SET_SUB_CONTEXT_MENU(state, ctx) {
      state.subsContextMenu.showCtx = false;
      state.feedContextMenu.showCtx = false;
      state.boardContextMenu.showCtx = false;
      state.subsContextMenu = ctx;
    },

    SET_FEED_CONTEXT_MENU(state, ctx) {
      state.feedContextMenu.showCtx = false;
      state.subsContextMenu.showCtx = false;
      state.boardContextMenu.showCtx = false;
      state.feedContextMenu = ctx;
    },

    SET_BOARD_CONTEXT_MENU(state, ctx) {
      state.feedContextMenu.showCtx = false;
      state.subsContextMenu.showCtx = false;
      state.boardContextMenu.showCtx = false;
      state.boardContextMenu = ctx;
    }
  },
  actions: {
    FETCH_FEED_LIST({ commit }) {
      Axios.instance
        .get("/api/feed/list")
        .then(({ data }) => commit("SET_FEED_LIST", data.data))
        .catch(err => console.error(err));
    },

    FETCH_RSS({ commit }) {
      Axios.instance
        .get("/api/rss/list/all")
        .then(({ data }) => commit("SET_RSS_LIST", data.data))
        .catch(err => console.error(err));
    },

    FETCH_FEED({ commit }, feedId: number) {
      Axios.instance
        .get("/api/feed/feedid", { params: { feedId } })
        .then(({ data }) => commit("SET_FEED", data.data))
        .catch(err => console.error(err));
    },

    FETCH_BOARD_LIST({ commit }) {
      Axios.instance
        .get("/api/board/find/all")
        .then(({ data }) => commit("SET_BOARD_LIST", data.data))
        .catch(err => console.error(err));
    },

    ADD_FEED({ dispatch }, feedName) {
      Axios.instance
        .post("/api/feed/save", { feedName })
        .then(({ data }) => {
          dispatch("FETCH_FEED_LIST");
          return { feedName: data.data.feedName, feedId: data.data.feedId };
        })
        // .then(({ feedId }) => {
        //   router.push({ name: "Feed", params: { feedId } });
        // })
        .catch(err => console.error(err));
    },

    UPDATE_FEED({ dispatch, state }, { feedId, feedName }) {
      const updateData = {
        params: {
          feedId,
          feedName
        }
      };
      Axios.instance
        .put("/api/feed/put", null, updateData)
        .then(() => {
          dispatch("FETCH_FEED_LIST");
        })
        .then(() => {
          if (state.feed && state.feed.feedId === feedId) {
            dispatch("FETCH_ARTICLE_LIST_IN_FEED", feedId);
          }
        })
        .catch(err => console.error(err));
    },

    DELETE_FEED({ dispatch }, feedId) {
      Axios.instance
        .delete("/api/feed/delete", { params: { feedId } })
        .then(() => dispatch("FETCH_FEED_LIST"))
        .catch(err => console.error(err));
    },

    SUBSCRIBE_RSS({ dispatch }, { feedId, rss }: { feedId: number; rss: Rss }) {
      const feedData = {
        params: {
          feedId
        }
      };
      const subscribeData = {
        rss,
        subscribeName:
          rss.rssName ||
          ["동아경제", "노컷경제", "칸경제", "", "칸IT"][rss.rssId - 1],
        feedId
      };

      let deleteId: number | null = null;

      Axios.instance
        .get("/api/subscribe/find/feed", feedData)
        .then(({ data }) => {
          if (
            data.data.length &&
            data.data.some((el: Feed) => {
              deleteId = el.subscribeId;
              return el.rss.rssId === rss.rssId;
            })
          ) {
            // subscribe 취소
            const deleteData = {
              params: {
                subscribeId: deleteId
              }
            };
            Axios.instance
              .delete("/api/subscribe/delete", deleteData)
              .then(() => dispatch("FETCH_FEED_LIST"))
              .catch(err => console.error(err));
          } else {
            // subscribe
            Axios.instance
              .post("/api/subscribe/save", subscribeData)
              .then(() => dispatch("FETCH_FEED_LIST"))
              .catch(err => console.error(err));
          }
        });
    },

    FETCH_ARTICLE_LIST({ state, commit }, subscribeId) {
      Axios.instance
        .get("/api/rss/item/subscribe", { params: { subscribeId } })
        .then(({ data }) => {
          commit("SET_SELECTED_SUBSCRIPTION", subscribeId);
          state.articleList = data.data;
        })
        .catch(err => console.error(err));
    },

    FETCH_ARTICLE_LIST_IN_FEED({ state, dispatch }, feedId) {
      Axios.instance
        .get("/api/rss/item/feed", { params: { feedId } })
        .then(({ data }) => {
          dispatch("FETCH_FEED", feedId);
          state.articleList = data.data;
        })
        .catch(err => console.error(err));
    },

    UPDATE_SUBSCRIBE(
      { dispatch, state },
      { feedId, subscribeId, subscribeName }
    ) {
      const updateData = {
        params: {
          feedId,
          subscribeId,
          subscribeName
        }
      };
      Axios.instance
        .put("/api/subscribe/update", null, updateData)
        .then(() => dispatch("FETCH_FEED_LIST"))
        .then(() => {
          if (state.subscribeId === subscribeId) {
            dispatch("FETCH_ARTICLE_LIST", subscribeId);
          }
        })
        .catch(err => console.error(err));
    },

    UNFOLLOW_SUBSCRIPTION({ dispatch }, subscribeId: number) {
      Axios.instance
        .delete("/api/subscribe/delete", { params: { subscribeId } })
        .then(() => dispatch("FETCH_FEED_LIST"))
        .catch(err => console.error(err));
    },

    FOLLOW_SUBSCRIPTION({ dispatch }, { feedId, rssId, subscribeName }) {
      Axios.instance
        .post("/api/subscribe/save", { feedId, rssId, subscribeName })
        .then(() => dispatch("FETCH_FEED_LIST"))
        .catch(err => console.error(err));
    },

    ADD_BOARD({ dispatch }, boardName) {
      Axios.instance
        .post("/api/board/save", { boardName })
        .then(() => dispatch("FETCH_BOARD_LIST"))
        .catch(err => console.error(err));
    },

    FETCH_ARTICLE_LIST_IN_BOARD({ commit }, boardId) {
      Axios.instance
        .get("/api/board/find/id", { params: { boardId } })
        .then(({ data }) => commit("SET_BOARD", data.data))
        .catch(err => console.error(err));
    },

    UPDATE_BOARD({ dispatch, state }, { boardId, boardName }) {
      Axios.instance
        .put("/api/board/update", null, { params: { boardId, boardName } })
        .then(() => dispatch("FETCH_BOARD_LIST"))
        .then(() => {
          if (state.board && state.board.boardId === boardId) {
            dispatch("FETCH_ARTICLE_LIST_IN_BOARD", boardId);
          }
        })
        .catch(err => console.error(err));
    },

    DELETE_BOARD({ dispatch }, boardId) {
      Axios.instance
        .delete("/api/board/delete", { params: { boardId } })
        .then(() => dispatch("FETCH_BOARD_LIST"))
        .catch(err => console.error(err));
    },

    SAVE_IN_BOARD({ dispatch }, { boardId, article, from }) {
      let data = {};
      if (from) {
        data = {
          boardId,
          newsDate: new Date(article.newsDate),
          newsDescription: article.newsDescription,
          newsLink: article.newsLink,
          newsTitle: article.newsTitle,
          userId: null,
          userNo: null
        };
      } else {
        data = {
          boardId,
          newsDate: article.pubDate || new Date(),
          newsDescription: article.description.substr(0, 190),
          newsLink: article.link,
          newsTitle: article.title,
          userId: null,
          userNo: null
        };
      }

      Axios.instance
        .post("/api/news/save", data)
        .then(() => dispatch("FETCH_BOARD_LIST"))
        .catch(err => console.error(err));
    },

    DELETE_IN_BOARD({ dispatch }, newsId) {
      Axios.instance
        .delete("/api/news/delete", { params: { newsId } })
        .then(() => dispatch("FETCH_BOARD_LIST"))
        .catch(err => console.error(err));
    },

    FETCH_ARTICLE_IN_BOARD({ commit }, newsId) {
      Axios.instance
        .get("/api/news/find/id", { params: { newsId } })
        .then(({ data }) => commit("SET_NEWS", data.data))
        .catch(err => console.error(err));
    }
  }
};

export default module;
