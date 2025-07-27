import { AxiosError } from "axios";
import parse from "node-html-parser";
import { axios } from "~/common/utils/Axios";
import { ApiMessageError } from "../enums/ApiMessageError";

export async function getImagesOfChapter(url: string, from: string) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "Referer": from,
      },
    });
    const dom = parse(html);

    const originUrl = dom.querySelector('meta[property="og:url"]')?.getAttribute('content')!;
  
    const keyLocation = "images = JSON.parse(";
    const findJson = html.indexOf(keyLocation);
  
    if (findJson !== -1) {
      const variableLocation = "dirPath = ";
      const findVariable = html.indexOf(variableLocation);
      const dirPath = html.slice(
        findVariable +variableLocation.length + 1,
        html.indexOf(';', findVariable + 2) - 1,
      );
  
      const json = html.slice(
        findJson + keyLocation.length + 1,
        html.indexOf(");", findJson + 2) - 1,
      );
  
      const images: string[] = JSON.parse(json).map((v: string) => dirPath + v);
  
      return {images, originUrl};
    }
    const images: string[] = [];
  
    dom.querySelectorAll('.viewer-container img[data-src]').forEach(el => {
      const data_src = el.getAttribute('data-src')!;
      images.push(data_src);
    });
  
    return {images, originUrl};
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.toJSON());
    }
    console.error(error);
    throw typeof error === 'string' ? error : ApiMessageError.REQUEST;
  }
}
