import { ApiEndpoint } from "../enums/ApiEndpoint";
import { ApiMessageError } from "../enums/ApiMessageError";
import parse from "node-html-parser";
import { ChapterInterface } from "../interfaces/ChapterInterface";
import moment from "moment";
import { GenderInterface } from "../interfaces/GenderInterface";
import { UserBookStatus } from "../interfaces/UserBookStatus";
import { BookStatus } from "../enums/BookStatus";
import { BookType } from "../enums/BookType";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { axios } from "~/common/utils/Axios";

export async function getBookInfo(url: string): Promise<BookInfoInterface> {
  try {
    const { data } = await axios.get<string>(
      url,
      {
        headers: {
          Referer: ApiEndpoint.HOME,
        },
      },
    );
    const root = parse(data);

    // ##### Chapters
    const chapters: ChapterInterface[] = [];
    
    for (const el of root.querySelectorAll('#chapters ul li[data-index]')) {
      const options: ChapterInterface['options'] = [];

      for (const item_el of el.querySelectorAll('.list-group-item')) {
        const date = moment(
          item_el.querySelector('.badge')?.innerText.trim()!,
          'YYYY-MM-DD',
        );

        options.push({
          date: date.toDate(),
          path: item_el.querySelector('a.btn-sm')?.getAttribute('href')!,
          title: item_el
            .querySelector('.text-truncate')!
            .innerText
            .trim()
            .replace(/ {2,}/g, '  ')
            .replace(/\n/g, ''),
        });
      }

      chapters.push({
        title: el.querySelector('h4')!.innerText.trim(),
        options: options,
      });
    }

    
    // ##### Genders
    const genders: GenderInterface[] = [];

    for (const el of root.querySelectorAll('.element-header-content-text h6')) {
      genders.push({
        name: el.innerText.trim(),
        path: el
          .querySelector('a')!
          .getAttribute('href')!,
      });
    }

    
    // ##### Wallpaper
    const style_wallpaper = data.indexOf('.wallpaper::before');
    const start_url_wallpaper = data.indexOf("url('", style_wallpaper);
    const end_url_wallpaper = data.indexOf("')", start_url_wallpaper);

    
    // ##### User Statues
    const user_status: Record<string, UserBookStatus['abandoned']> = {};

    for (const el of root.querySelectorAll('div[data-status]')) {
      const key = el.getAttribute('data-status')!;

      Object.assign(user_status, {
        [key]: {
          quantity: el
            .querySelector('.element-header-bar-element-number')!
            .innerText,
          user_select: el.classList.contains('active'),
        },
      });
    }
    
    const stars = root
        .querySelector('.score')!
        .querySelector('span')!
        .innerText;

    return {
      url: url,
      path: url.slice(url.lastIndexOf('/') + 1),
      stars: Number(stars),
      title: root
        .querySelector('.element-title')!
        .innerText
        .trim()
        .replace(/ {2,}/g, '  ')
        .replace(/\n/g, '')
        .replace(/\t/g, '')
      ,
      subtitle: root
        .querySelector('h2.element-subtitle')!
        .innerText
        .trim()
      ,
      description: root
        .querySelector('.element-description')!
        .innerText
        .trim()
      ,
      picture: root
        .querySelector('.book-thumbnail')!
        .getAttribute('src')!
      ,
      wallpaper: data.slice(start_url_wallpaper + 5, end_url_wallpaper),
      genders: genders,
      status: root
        .querySelector('.book-status.publishing')!
        .innerText
        .toLowerCase() as BookStatus
      ,
      type: root
        .querySelector('.book-type')!
        .innerText
        .toLowerCase()
        .trim() as BookType
      ,
      user_status: user_status as unknown as UserBookStatus,
      chapters: chapters,
    };
  } catch (error) {
    console.error(error);
    throw typeof error === 'string' ? error : ApiMessageError.REQUEST;
  }
}