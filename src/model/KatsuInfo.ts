export interface IKatsuInfo {
  post_id: string;
  name: string;
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
}
