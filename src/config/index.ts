export const CONFIG = {
  DATA_FILES: {
    ITEMS: '/config/acnh-items.json',
    CATALOG: '/catalog_items.json',
    TRANSLATIONS: '/config/translations.json'
  },
  
  PAGINATION: {
    DEFAULT_PER_PAGE: 100,
    OPTIONS: [20, 40, 60, 100, 'all'] as const
  },
  
  SORT_OPTIONS: {
    NAME_ASC: 'name-asc',
    NAME_DESC: 'name-desc',
    ID_ASC: 'id-asc',
    ID_DESC: 'id-desc'
  } as const,
  
  FILTER_OPTIONS: {
    ALL: 'all',
    OWNED: 'owned',
    NOT_OWNED: 'not-owned'
  } as const
};

export const COLOR_MAP: Record<string, string> = {
  'Red': '#e74c3c',
  'Orange': '#e67e22',
  'Yellow': '#f1c40f',
  'Green': '#27ae60',
  'Blue': '#3498db',
  'Aqua': '#1abc9c',
  'Purple': '#9b59b6',
  'Pink': '#ff69b4',
  'White': '#ecf0f1',
  'Black': '#2c3e50',
  'Gray': '#95a5a6',
  'Brown': '#8b6f47',
  'Beige': '#d4c5b9',
};
