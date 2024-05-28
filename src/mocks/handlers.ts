import { http, HttpResponse, StrictResponse } from "msw";
import { faker } from "@faker-js/faker";

function generateDate() {
  const lastWeek = new Date(Date.now());
  lastWeek.setDate(lastWeek.getDate() - 7);
  return faker.date.between({
    from: lastWeek,
    to: Date.now(),
  });
}
const storeData = [
  {
    name: "모모돈까스",
    title: "돈가스를 평정한 곳",
    explain:
      "한눈에 보기에도 바삭바삭하고 속이 알찬 돈까스가 나왔다. 겉바속촉이 제대로다. 안심은 많이 익히면 질기기 마련인데 적당히 튀겨서 씹는 맛과 풍미 모두 챙겼다. 정식 메뉴는 장국과 야채, 단무지 등 한 상 정갈하게 잘 나온다. 양이 그렇게 많지 않아 보이지만 다 먹으면 은근히 배가 부르다. 알고 보니 돈까스만 20년 이상 튀겨오신 사장님이 운영 중이셨고, 맛을 보니 절로 이해가 된다. 고개가 자동으로 끄덕여진다.",
    menu: [
      { menuName: "히레카츠", price: "14,000원" },
      { menuName: "로스카츠", price: "10,500원" },
    ],
    image:
      "https://www.foodinko.com/wp-content/uploads/2024/03/24d736bd-5c97-4db2-8139-d06014f12cb9.jpeg",
    location: {
      lat: 37.5208724804701,
      lng: 126.931298156696,
    },
    postId: 1,
    time: "월-토 10:00-20:00 브레이크타임 15:00-16:00",
  },
  {
    name: "최강금 돈까스",
    title: "핑크빛으로 사람 설레게 하는 돈가스",
    explain:
      "운 좋게 상등심 돈까스에 성공했다. 먹자마자 고기가 살살 녹는다. 적당한 지방층과 살코기가 어울려져 식감이 좋고 깊은 맛을 낸다. 역시 고기는 지방이 섞어줘야 된다. 최강금 돈까스가 더욱 특별한 이유에는 함초소금과 들기름에 있다. 첫 입은 소금에 찍어서 본연의 맛을 즐기고, 들기름에도 찍어 먹어본다. 소금과 들기름을 함께 먹을 땐 고소함이 압권이다. 적당히 찰진 밥과 된장국도 조화롭다. 후식으로 요거트를 주시는데 새콤달콤한 맛이 끝맺음으로 완벽하다.",
    menu: [
      { menuName: "상등심 돈까스", price: "16,000원" },
      { menuName: "히레카츠", price: "15,000원" },
      { menuName: "로스카츠", price: "14,500원" },
    ],
    image:
      "https://www.foodinko.com/wp-content/uploads/2024/03/78bcafa6-e022-410a-abfb-db2b6eb945d9.jpeg",
    location: {
      lat: 37.5499174135013,
      lng: 126.91094549376,
    },
    postId: 2,
    time: "월-일 11:30-21:00 브레이크타임 15:00-17:00",
  },
  {
    name: "하랑",
    title: "한 달에 두 번 이상 출석해야 하는곳",
    explain:
      "치즈카츠로 시작했다. 모짜렐라 치즈가 쭉쭉 늘어난다. 잘 안 굳게 만드는 기술이 있는 듯 하다. 씹을수록 고소함이 느껴진다. 부드러운 치즈가 입에서 살살 녹는다. 고기는 얇은 편이라 바삭한 튀김 옷이랑 같이 먹으면 식감이 두 배 매력있다. 치즈의 양이 많은 편이다. 6조각으로 주문했는데, 4조각이면 둘이 가서 먹기에 충분해 보인다. 안심카츠는 굉장히 부드럽다. 양도 많은 편이다. 양에 민감한 사람은 만족할 양이다. 속은 부드럽고 겉은 바삭하다. 튀김 옷이 뭔가 사과를 씹는 것 마냥 아삭거리는 식감이 있다. 굉장히 잘 튀겨낸 듯하다. 모양새는 동글한 안심 돈까스가 아닌 길쭉한 돈까스다. ",
    menu: [
      { menuName: "치즈카츠", price: "11,500원" },
      { menuName: "히레카츠", price: "10,000원" },
      { menuName: "등심카츠", price: "10,000원" },
    ],
    image:
      "https://www.foodinko.com/wp-content/uploads/2023/11/%EC%B9%98%EC%A6%88%EB%8F%88%EA%B9%8C%EC%8A%A4-%E3%85%8B.jpeg",
    location: {
      lat: 37.5118621970607,
      lng: 127.046711140828,
    },
    postId: 3,
    time: "월-금 11:00-21:00",
  },
  {
    name: "돈까스광명",
    title: "여길 처음 본다면 아직 돈가스를 모르시는 겁니다",
    explain:
      "돈가스 격전지 합정에 있는 광명입니다. 수도 없이 먹어도 질리지가 않는 돈가스입니다. 가격이 착하지만 맛은 최상을 자랑합니다. 상로스는 고소하고 육향이 가득해서 진정한 돈가스응 즐기게 해줍니다. 히레는 익힘이 완벽해서 히레에 히레 추가하셔도 좋습니다. 광명 꿀팁을 드리자면 최근 웨이팅은 오픈 30분 전이면 충분히 1등을 하실 수 있습니다. 오전과 오후에 상로스를 나눠 파시기 때문에 저녁 시간 오픈런도 추천드립니다.",
    menu: [
      { menuName: "상로스 정식", price: "15,000원" },
      { menuName: "히레 정식", price: "11,000원" },
      { menuName: "로스 정식", price: "11,500원" },
    ],
    image:
      "https://blog.kakaocdn.net/dn/bnKJiq/btqFnD5diJk/eMBODuyKRjNJ2RfQQDbp6K/img.jpg",
    location: {
      lat: 37.5500741163575,
      lng: 126.908263744799,
    },
    postId: 4,
    time: "월-토 10:00-20:00 브레이크타임 15:00-16:00",
  },
  {
    name: "일월카츠",
    title: "안국을 빛낸 위대한 돈가스다",
    explain:
      "아름다운 빛깔의 돈가스가 나왔다. 상로스와 히레는 먹기 아쉬울 정도의 비주얼이었다. 우선 상로스는 이빨을 잠시 쉬게 해도 좋을 정도의 부드러움이었다. 와사비와 함께 지방층을 즐기니 세상을 다 가진 기분이었다. 향이 아름다웠다. 일월의 대표라고 생각하는 히레는 말을 잊게 했다. 소금에 찍어 먹어서 고기의 감칠맛과 풍미를 더 느낄 수 있었다. 메뉴가 많아 식은 뒤에 먹었을 때도 맛있었다. 식은 돈가스가 맛있는 건 더 이상 설명을 안 해도 이해했으리라 믿는다.",
    menu: [
      { menuName: "상로스키츠", price: "16,000원" },
      { menuName: "히레카츠", price: "14,000원" },
      { menuName: "로스카츠", price: "14,500원" },
    ],
    image:
      "https://dw82ptradz9jo.cloudfront.net/daylog/63e390015c4ed23b84820b4a/bc2e9e68-fc0b-45a0-96d6-1797845fb083",
    location: {
      lat: 37.577311793726,
      lng: 126.985174937177,
    },
    postId: 5,
    time: "월-토 11:30-21:00 브레이크타임 15:00-17:00",
  },
  {
    name: "메시야",
    title: "고구마와 김치는 이제 돈가스로 즐기자",
    explain:
      "김치 맛집이다. 김치 소스가 잔뜩 얹어져 나왔다. 고구마김치 돈가스를 밥과 함께 즐겼다. 그리고 문뜩 김치에 밥을 비벼 먹어야 합법이라 생각했다. 밥을 리필하고 남은 김치 소스를 다 넣어 비볐다. 완벽한 피날레였다. 직원분께서 먹을 줄 안다면서 칭찬할 정도. 무조건 밥에 비벼서 먹어보는 걸 추천한다.",
    menu: [{ menuName: "고구마김치", price: "13,000원" }],
    image:
      "https://d12zq4w4guyljn.cloudfront.net/750_750_20200124053336511_photo_495a987af71c.jpg",
    location: {
      lat: 37.5500772247453,
      lng: 126.972319103874,
    },
    postId: 6,
    time: "월-금 11:00-20:00",
  },
];
const delay = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

export const handlers = [
  http.get("/api/katsuList", ({ request }) => {
    return HttpResponse.json(storeData);
  }),

  http.get(
    "/api/detail/:storeName",
    ({ request, params }): StrictResponse<any> => {
      const { storeName } = params;
      const found = storeData.find((v) => v.name === storeName);
      if (found) {
        return HttpResponse.json(found);
      }
      return HttpResponse.json(
        { message: "no_such_user" },
        {
          status: 404,
        }
      );
    }
  ),
];
