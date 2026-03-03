export type KatsuInfo = {
  post_id: string;
  post_number: number;
  name: string;
  eng_name: string | null;
  title: string;
  explain: string;
  image_url: string;
  image_urls: string[];
  lat: string;
  lng: string;
  address: string;
  time: string;
  menu: string;
  is_scrap: number;
  scrap_id: string;
  table_id: string | null;
  createAt: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  provider: string | null;
  image: string | null;
  nickname: string | null;
};
