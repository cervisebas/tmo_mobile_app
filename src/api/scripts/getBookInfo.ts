import { ApiEndpoint } from "../enums/ApiEndpoint";
import { ApiMessageError } from "../enums/ApiMessageError";
import { ChapterInterface } from "../interfaces/ChapterInterface";
import { GenderInterface } from "../interfaces/GenderInterface";
import { UserBookStatusList } from "../interfaces/UserBookStatus";
import { BookStatus } from "../enums/BookStatus";
import { BookType } from "../enums/BookType";
import { BookInfoInterface } from "../interfaces/BookInfoInterface";
import { axios } from "~/common/utils/Axios";
import { getUrlParams } from "~/database/utils/getUrlParams";
import { AxiosError } from "axios";
import { BookStaffInterface } from "../interfaces/BookStaffInterface";
import { extractNumberChapter } from "~/utils/extractNumberChapter";
import parse, { HTMLElement } from "node-html-parser";
import moment from "moment";
import he from "he";
import qs from "qs";

function getChapterInfo(el: HTMLElement, set_title?: string): ChapterInterface {
  const options: ChapterInterface['options'] = [];
  
  for (const item_el of el.querySelectorAll('.list-group-item')) {
    const date = moment(
      item_el.querySelector('.badge')?.innerText.trim() ?? '2012-12-12',
      'YYYY-MM-DD',
    );

    const title = item_el
      .querySelector('.text-truncate')
      ?.innerText
      .trim()
      .replace(/ {2,}/g, '  ')
      .replace(/\n/g, '')
      ?? '';

    options.push({
      date: date.toDate(),
      path: item_el.querySelector('a.btn-sm')?.getAttribute('href')!,
      title: he.decode(title),
    });
  }

  const title = el.querySelector('h4')?.innerText.trim() ?? '';
  const number = el.querySelector('span[data-chapter]')?.getAttribute('data-chapter') ?? '0';

  const use_title = set_title ?? he.decode(title);

  return {
    title: use_title,
    data_chapter: Number(number),
    options: options,
    chapter_number: extractNumberChapter(use_title),
  };
}

export async function getBookInfo(url: string, referer?: string): Promise<BookInfoInterface> {
  try {
    const { data } = await axios.get<string>(
      url,
      {
        headers: {
          Referer: referer ?? ApiEndpoint.HOME,
        },
      },
    );
    const root = parse(data);

    // ##### Chapters
    let chapters: ChapterInterface[] = [];

    if (root.querySelector('#chapters ul')) {
      for (const el of root.querySelectorAll('#chapters ul li[data-index]')) {
        chapters.push(getChapterInfo(el));
      }
    } else {
      const el = root.querySelector('.chapter-list-element ul');
      if (el) {
        chapters.push(getChapterInfo(el, 'Capítulo 0.00'));
      }
    }
    chapters = chapters.sort((a, b) => b.chapter_number - a.chapter_number);

    
    // ##### Genders
    const genders: GenderInterface[] = [];

    for (const el of root.querySelectorAll('.element-header-content-text h6')) {
      const path = el.querySelector('a')!.getAttribute('href')!;
      const pathParams = getUrlParams(path);

      genders.push({
        name: el.innerText.trim(),
        value: pathParams['genders'][0],
      });
    }

    
    // ##### Wallpaper
    const style_wallpaper = data.indexOf('.wallpaper::before');
    const start_url_wallpaper = data.indexOf("url('", style_wallpaper);
    const end_url_wallpaper = data.indexOf("')", start_url_wallpaper);

    
    // ##### User Statues
    const user_status: Record<string, UserBookStatusList['abandoned']> = {};

    for (const el of root.querySelectorAll('div[data-status]')) {
      const key = el.getAttribute('data-status')!;

      Object.assign(user_status, {
        [key]: {
          quantity: el
            .querySelector('.element-header-bar-element-number')
            ?.innerText
            ?? ''
          ,
          user_select: el.classList.contains('active'),
        },
      });
    }
    
    const stars = root
        .querySelector('.score')!
        .querySelector('span')
        ?.innerText
        ?? '';

    const title = root
      .querySelector('.element-title')
      ?.innerText
      .trim()
      .replace(/ {2,}/g, '  ')
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      ?? '';

    const subtitle = root
      .querySelector('h2.element-subtitle')
      ?.innerText
      .trim() ?? '';

    const description = root
      .querySelector('.element-description')
      ?.innerText
      .trim() ?? '';


    // Staff
    const staff_list: BookStaffInterface[] = [];
    const staff_content = Array.from(root.querySelectorAll('h2'))
      .find(el => el.textContent.trim() === 'Staff')
      ?.parentNode
      ?.parentNode;
    
    if (staff_content) {
      for (const el of staff_content.querySelectorAll('div.card')) {
        const img = el.querySelector('img');
        const name = el.querySelector('h5[title]');
        const url = name?.parentNode.getAttribute('href')?.trim();

        if ((!img && !name) || !url) {
          continue;
        }

        const url_search = new URL(url);
        const url_search_params = qs.parse(url_search.search.slice(1));

        staff_list.push({
          url: img?.parentNode.getAttribute('href')?.trim() ?? '',
          name: name?.innerText.trim() ?? '',
          picture: img?.getAttribute('src') ?? '',
          position: el.querySelector('b')?.innerText?.trim() ?? '',
          search_name: url_search_params['title'] as string,
        });
      }
    }


    return {
      url: url.trim(),
      path: url.slice(url.lastIndexOf('/') + 1).trim(),
      stars: Number(stars),
      title: he.decode(title),
      subtitle: he.decode(subtitle),
      description: he.decode(description),
      picture: root
        .querySelector('.book-thumbnail')!
        .getAttribute('src')!
      ,
      wallpaper: data.slice(start_url_wallpaper + 5, end_url_wallpaper),
      genders: genders,
      status: root
        .querySelector('.book-status.publishing')
        ?.innerText
        .toLowerCase() as BookStatus
      ,
      type: root
        .querySelector('.book-type')
        ?.innerText
        .toLowerCase()
        .trim() as BookType
      ,
      user_status: user_status as unknown as UserBookStatusList,
      chapters: chapters,
      staff: staff_list,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.toJSON());
    }
    console.error(error);
    throw typeof error === 'string' ? error : ApiMessageError.REQUEST;
  }
}