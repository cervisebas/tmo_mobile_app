import { parse } from "node-html-parser";
import { ApiEndpoint } from "../enums/ApiEndpoint";
import { ApiMessageError } from "../enums/ApiMessageError";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { BookType } from "../enums/BookType";
import { PopularsInterface } from "../interfaces/PopularsInterface";
import { axios } from "~/common/utils/Axios";
import he from "he";

const CATEGORIES = [
  '#pills-populars',
  '#pills-populars-boys',
  '#pills-populars-girls',
];

export async function getAllPopulars(): Promise<PopularsInterface> {
  try {
    const { data } = await axios.get<string>(
      ApiEndpoint.HOME,
      {
        headers: {
          Referer: ApiEndpoint.HOME,
        },
      },
    );
    const root = parse(data);
    
    const populars: BookInfoInterface[][] = [[], [], []];

    let category_index = 0;
    for (const category of CATEGORIES) {
      const popular_array = populars[category_index++];

      const category_el = root.querySelector(category);
      const elements = category_el?.querySelectorAll('.element');

      if (!elements) {
        continue;
      }

      for (const element of elements) {
        const style = element.querySelector('style')?.innerHTML;
        const findUrl = style?.indexOf("url('");
        const findEndUrl = style?.indexOf("')", findUrl);

        const type = element
          .querySelector('.book-type')
          ?.innerText
          .toLowerCase()
          .trim();
        
        const url = element.querySelector('a')?.getAttribute('href');

        const data: BookInfoInterface = {
          url: url!,
          path: url!.slice(url!.lastIndexOf('/') + 1).trim(),
          title: he.decode(element.querySelector('h4')?.innerText ?? ''),
          picture: style?.slice(findUrl! + 5, findEndUrl) as string,
          stars: Number(element.querySelector('.score')?.innerText),
          type: type as BookType,
        };

        popular_array.push(data);
      }
    }

    return {
      populars: populars[0],
      populars_boys: populars[1],
      populars_girls: populars[2],
    };
  } catch (error) {
    console.error(error);
    throw typeof error === 'string' ? error : ApiMessageError.REQUEST;
  }
}
