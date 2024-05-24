interface Menu {
  menuName: string;
  price: string;
}
export interface IKatsuInfo {
  name: string;
  title: string;
  explain: string;
  menu: Menu[];
  image: string;
  location: {
    lat: string;
    lng: string;
  };
  postId: string;
  time: string;
}
