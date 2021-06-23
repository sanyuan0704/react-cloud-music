import { axiosInstance } from "./config";

export const getBannerRequest = <T=any>() => {
  return axiosInstance.get<T>("/banner");
};

export const getRecommendListRequest = <T=any>() => {
  return axiosInstance.get<T>("/personalized");
};

export const getHotSingerListRequest = <T=any>(count: number) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
};

export const getSingerListRequest = <T=any>(category: string, alpha: string, count: string) => {
  return axiosInstance.get<T>(
    `/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`
  );
};

export const getRankListRequest = <T=any>() => {
  return axiosInstance.get<T>(`/toplist/detail`);
};

export const getAlbumDetailRequest = <T=any>(id: string) => {
  return axiosInstance.get<T>(`/playlist/detail?id=${id}`);
};

export const getSingerInfoRequest = <T=any>(id: string) => {
  return axiosInstance.get<T>(`/artists?id=${id}`);
};

export const getHotKeyWordsRequest = <T=any>() => {
  return axiosInstance.get<T>(`/search/hot`);
};

export const getSuggestListRequest = <T=any>(query: string) => {
  return axiosInstance.get<T>(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = <T=any>(query: string) => {
  return axiosInstance.get<T>(`/search?keywords=${query}`);
};

export const getSongDetailRequest = <T=any>(id: string) => {
  return axiosInstance.get<T>(`/song/detail?ids=${id}`);
};

export const getLyricRequest = <T=any>(id: string) => {
  return axiosInstance.get<T>(`/lyric?id=${id}`);
};

// export const loginByPhoneRequest = (phone: string, password: string) => {
//   return axiosInstance.get(
//     `/login/cellphone?phone=${phone}&password=${password}`
//   );
// };

// export const sentVcodeRequest = (phone: string) => {
//   return axiosInstance.get(`/captcha/sent?phone=${phone}`);
// };

// export const loginByVcodeRequest = (phone: string, vcode: string) => {
//   return axiosInstance.get(`/captcha/verify?phone=${phone}&captcha=${vcode}`);
// };