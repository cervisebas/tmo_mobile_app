import { axios } from "~/common/utils/Axios";
import { ApiEndpoint } from "../enums/ApiEndpoint";
import { LibraryQueriesInterface } from "../interfaces/LibraryQueriesInterface";
import qs from "qs";
import parse from "node-html-parser";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { BookType } from "../enums/BookType";
import { ApiMessageError } from "../enums/ApiMessageError";
import { LibrarySearchInterface } from "../interfaces/LibrarySearchInterface";
import { LibraryQueries } from "../enums/LibraryQueries";
import he from "he";

export async function librarySearch(queries: LibraryQueriesInterface): Promise<LibrarySearchInterface> {
  try {
    const url = `${ApiEndpoint.LIBRARY}?${qs.stringify(queries)}`;
    const {data} = await axios.get<string>(
      url,
      {
        headers: {
          Referer: ApiEndpoint.LIBRARY,
        },
      },
    );
  
    const root = parse(data);
  
    const books: BookInfoInterface[] = [];
    
    for (const element of root.querySelectorAll('div.element[data-identifier]')) {
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
        url: url!.trim(),
        path: url!.slice(url!.lastIndexOf('/') + 1).trim(),
        title: he.decode(element.querySelector('h4')?.innerText ?? ''),
        picture: style?.slice(findUrl! + 5, findEndUrl) as string,
        stars: Number(element.querySelector('.score')?.innerText),
        type: type as BookType,
      };
  
      books.push(data);
    }

    const nextElement = root.querySelector('a[rel="next"]');
    let nextPage: number | undefined = undefined;
  
    if (nextElement) {
      const nextUrl = new URL(nextElement.getAttribute('href')!);
      const nextUrlParam = qs.parse(nextUrl.search);

      nextPage = Number(nextUrlParam[LibraryQueries.PAGE]);
    }

    return {
      url: url,
      books: books,
      nextPage: nextPage,
    };
    
  } catch (error) {
    console.error(error);
    throw typeof error === 'string' ? error : ApiMessageError.REQUEST;
  }
}
