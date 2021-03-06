import axios, { AxiosInstance } from "axios";

export class Axios {
  static readonly instance: AxiosInstance = axios.create({
    baseURL: "http://i3b107.p.ssafy.io:8080",
    timeout: 10000
  });
}

Axios.instance.defaults.headers.common[
  "Authorization"
] = window.sessionStorage.getItem("jwt-token");
