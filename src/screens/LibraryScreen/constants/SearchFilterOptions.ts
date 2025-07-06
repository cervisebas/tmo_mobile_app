import { LibraryGenders } from '~/api/enums/LibraryGenders';
import { LibraryCheck, LibraryDemography, LibraryFilterby, LibraryOrderDir, LibraryOrderItems, LibraryType } from '~/api/enums/LibraryQueries';

// Search Options
export const LibraryFilterbyOptions = [
  {
    label: 'Título',
    value: LibraryFilterby.TITLE,
  },
  {
    label: 'Autor',
    value: LibraryFilterby.AUTHOR,
  },
  {
    label: 'Compañia',
    value: LibraryFilterby.COMPANY,
  },
];

export const LibraryOrderByOptions = [
  {
    label: 'Me gusta',
    value: LibraryOrderItems.LIKES_COUNT,
  },
  {
    label: 'Alfabético',
    value: LibraryOrderItems.ALPHABETICALLY,
  },
  {
    label: 'Puntuación',
    value: LibraryOrderItems.SCORE,
  },
  {
    label: 'Creación',
    value: LibraryOrderItems.CREATION,
  },
  {
    label: 'Fecha estreno',
    value: LibraryOrderItems.RELEASE_DATE,
  },
  {
    label: 'Núm. Capítulos',
    value: LibraryOrderItems.NUM_CHAPTERS,
  },
];

export const LibraryOrderDirOptions = [
  {
    label: 'Ascendente',
    value: LibraryOrderDir.ASC,
  },
  {
    label: 'Descendente',
    value: LibraryOrderDir.DESC,
  },
];

// Filters
export const LibraryTypeOptions = [
  {
    label: 'Ver todo',
    value: LibraryType.ALL,
  },
  {
    label: 'Manga',
    value: LibraryType.MANGA,
  },
  {
    label: 'Manhua',
    value: LibraryType.MANHUA,
  },
  {
    label: 'Manhwa',
    value: LibraryType.MANHWA,
  },
  {
    label: 'Novela',
    value: LibraryType.NOVEL,
  },
  {
    label: 'One shot',
    value: LibraryType.ONE_SHOT,
  },
  {
    label: 'Doujinshi',
    value: LibraryType.DOUJINSHI,
  },
  {
    label: 'Oel',
    value: LibraryType.OEL,
  },
];

export const LibraryDemographyOptions = [
  {
    label: 'Ver todo',
    value: LibraryDemography.ALL,
  },
  {
    label: 'Seinen',
    value: LibraryDemography.SEINEN,
  },
  {
    label: 'Shoujo',
    value: LibraryDemography.SHOUJO,
  },
  {
    label: 'Shounen',
    value: LibraryDemography.SHOUNEN,
  },
  {
    label: 'Josei',
    value: LibraryDemography.JOSEI,
  },
  {
    label: 'Kodomo',
    value: LibraryDemography.KODOMO,
  },
];

export const LibraryCheckOptions = [
  {
    label: 'Ver todo',
    value: LibraryCheck.ALL,
  },
  {
    label: 'Si',
    value: LibraryCheck.YES,
  },
  {
    label: 'No',
    value: LibraryCheck.NO,
  },
];

// Genders
export const LibraryGenderOptions = [
  {
    label: 'Acción',
    value: LibraryGenders.ACTION,
  },
  {
    label: 'Aventura',
    value: LibraryGenders.ADVENTURE,
  },
  {
    label: 'Comedia',
    value: LibraryGenders.COMEDY,
  },
  {
    label: 'Drama',
    value: LibraryGenders.DRAMA,
  },
  {
    label: 'Recuentos de la vida',
    value: LibraryGenders.SLICE_OF_LIFE,
  },
  {
    label: 'Ecchi',
    value: LibraryGenders.ECCHI,
  },
  {
    label: 'Fantasia',
    value: LibraryGenders.FANTASY,
  },
  {
    label: 'Magia',
    value: LibraryGenders.MAGIC,
  },
  {
    label: 'Sobrenatural',
    value: LibraryGenders.SUPERNATURAL,
  },
  {
    label: 'Horror',
    value: LibraryGenders.HORROR,
  },
  {
    label: 'Misterio',
    value: LibraryGenders.MYSTERY,
  },
  {
    label: 'Psicológico',
    value: LibraryGenders.PSYCHOLOGICAL,
  },
  {
    label: 'Romance',
    value: LibraryGenders.ROMANCE,
  },
  {
    label: 'Ciencia Ficción',
    value: LibraryGenders.SCIENCE_FICTION,
  },
  {
    label: 'Thriller',
    value: LibraryGenders.THRILLER,
  },
  {
    label: 'Deporte',
    value: LibraryGenders.SPORTS,
  },
  {
    label: 'Girls Love',
    value: LibraryGenders.GIRLS_LOVE,
  },
  {
    label: 'Boys Love',
    value: LibraryGenders.BOYS_LOVE,
  },
  {
    label: 'Harem',
    value: LibraryGenders.HAREM,
  },
  {
    label: 'Mecha',
    value: LibraryGenders.MECHA,
  },
  {
    label: 'Supervivencia',
    value: LibraryGenders.SURVIVAL,
  },
  {
    label: 'Reencarnación',
    value: LibraryGenders.REINCARNATION,
  },
  {
    label: 'Gore',
    value: LibraryGenders.GORE,
  },
  {
    label: 'Apocalíptico',
    value: LibraryGenders.APOCALYPTIC,
  },
  {
    label: 'Tragedia',
    value: LibraryGenders.TRAGEDY,
  },
  {
    label: 'Vida Escolar',
    value: LibraryGenders.SCHOOL_LIFE,
  },
  {
    label: 'Historia',
    value: LibraryGenders.HISTORY,
  },
  {
    label: 'Militar',
    value: LibraryGenders.MILITARY,
  },
  {
    label: 'Policiaco',
    value: LibraryGenders.POLICE,
  },
  {
    label: 'Crimen',
    value: LibraryGenders.CRIME,
  },
  {
    label: 'Superpoderes',
    value: LibraryGenders.SUPERPOWERS,
  },
  {
    label: 'Vampiros',
    value: LibraryGenders.VAMPIRES,
  },
  {
    label: 'Artes Marciales',
    value: LibraryGenders.MARTIAL_ARTS,
  },
  {
    label: 'Samurái',
    value: LibraryGenders.SAMURAI,
  },
  {
    label: 'Género Bender',
    value: LibraryGenders.GENDER_BENDER,
  },
  {
    label: 'Realidad Virtual',
    value: LibraryGenders.VIRTUAL_REALITY,
  },
  {
    label: 'Ciberpunk',
    value: LibraryGenders.CYBERPUNK,
  },
  {
    label: 'Musica',
    value: LibraryGenders.MUSIC,
  },
  {
    label: 'Parodia',
    value: LibraryGenders.PARODY,
  },
  {
    label: 'Animación',
    value: LibraryGenders.ANIMATION,
  },
  {
    label: 'Demonios',
    value: LibraryGenders.DEMONS,
  },
  {
    label: 'Familia',
    value: LibraryGenders.FAMILY,
  },
  {
    label: 'Extranjero',
    value: LibraryGenders.ALIEN,
  },
  {
    label: 'Niños',
    value: LibraryGenders.KIDS,
  },
  {
    label: 'Realidad',
    value: LibraryGenders.REALITY,
  },
  {
    label: 'Telenovela',
    value: LibraryGenders.SOAP_OPERA,
  },
  {
    label: 'Guerra',
    value: LibraryGenders.WAR,
  },
  {
    label: 'Oeste',
    value: LibraryGenders.WESTERN,
  },
  {
    label: 'Traps',
    value: LibraryGenders.TRAPS,
  }
];
