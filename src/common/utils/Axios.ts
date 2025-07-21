import axios_native from "axios";

export const AxiosUserAgent = 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36';

export const axios = axios_native.create({
  headers: {
    'User-Agent': AxiosUserAgent,
  },
});
