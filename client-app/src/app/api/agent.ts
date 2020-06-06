import { IActivity } from "./../models/activity";
import axios, { AxiosResponse } from "axios";
import { history } from "../..";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, (error) => {
  const { status, data, config } = error.response;
  if(error.message === 'Network Error' && !error.respone) {
      toast.error('Network error');
  }
  if (status === 404) {
    history.push("/notfound");
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/invalidguidnotfound");
  }
  if (status === 500) {
    toast.error("Server error - check the terminal for more info!");
  }
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const request = {
  get: (url: string) => axios.get(url).then(sleep(500)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(500)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(500)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(500)).then(responseBody),
};

const Activities = {
  list: (): Promise<IActivity[]> => request.get("/activities"),
  details: (id: string) => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post("/activities", activity),
  update: (activity: IActivity) =>
    request.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del(`/activities/${id}`),
};

export default {
  Activities,
};