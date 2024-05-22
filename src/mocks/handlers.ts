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
const User = [
  { id: "elonmusk", nickname: "Elon Musk", image: "/yRsRRjGO.jpg" },
  { id: "zerohch0", nickname: "제로초", image: "/5Udwvqim.jpg" },
  { id: "leoturtle", nickname: "레오", image: faker.image.avatar() },
];
const delay = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

export const handlers = [
  http.get("/api/katsuList", ({ request }) => {
    return HttpResponse.json([
      {
        name: "진한 사골곰탕 300g",
        explain: "100% 사골로 고은 진한 사골곰탕",
        price: 880,
        store: "실온",
        image:
          "https://mall.ourhome.co.kr//attach_file/20201118/C4A1610E7468407FA935CBF8DE2164DF.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "숯불향 우삼겹불고기덮밥 290g",
        explain: "저온 숙성 불고기, 오븐 구이 야채, 한국의 맛",
        price: 2990,
        store: "냉동",
        image:
          "https://mall.ourhome.co.kr//attach_file/20230801/7A240C661DBD44C998FB54737C867240.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "더블치즈 차돌깍두기 300g",
        explain: "치즈 듬뿍,모짜렐라,통차돌,국내산 깍두기",
        price: 2990,
        store: "냉동",
        image:
          "https://mall.ourhome.co.kr//attach_file/20230801/DFDECC1568BA46F9A96D27A52921B06C.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "전주식 소고기 오색 비빔밥 310g",
        explain: "오색 가득 토핑 듬뿍,소고기,한국의 맛",
        price: 2990,
        store: "냉동",
        image:
          "https://mall.ourhome.co.kr//attach_file/20230801/93CE10E54C6E49D1AD21BE99B8956BCC.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "육즙 가득 미니함박",
        explain: "육즙 가득 함박,토마토 로제,파스타",
        price: 2990,
        store: "냉동",
        image:
          "https://mall.ourhome.co.kr//attach_file/20230801/978E874BDB3F4C34B7970982DF974EA0.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "이탈리아식 페퍼라구 볼로네제 파스타 300g",
        explain: "매콤달콤,고기 듬뿍, 라구 소스,펜네파스타",
        price: 5680,
        store: "냉동",
        image:
          "https://mall.ourhome.co.kr//attach_file/20230801/FDC19A9261874DE58B6B50F9EEFA007E.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "통모짜 로제 떡볶이 with 파스타 320g",
        explain: "치즈 듬뿍, 떡볶이, 로제 소스, 생크림, 퓨전한식",
        price: 5680,
        store: "냉동",
        image:
          "https://mall.ourhome.co.kr//attach_file/20230809/B22F8C84573E46B0B215CB68E7BA106F.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "중화식 첨면장 불향 덮밥 290g",
        explain: "첨면장, 짜장, 계란 후라이, 고추 잡채, 중화식",
        price: 3240,
        store: "냉동",
        image:
          "https://mall.ourhome.co.kr//attach_file/20231101/5757B7683B3C42FB9F4280ACBD7E1485.jpg",
        quantity: 1,
        select: true,
      },
      {
        name: "진한 사골곰탕 400g",
        explain: "100% 사골로 고은 진한 사골곰탕",
        price: 880,
        store: "실온",
        image:
          "https://mall.ourhome.co.kr//attach_file/20201118/C4A1610E7468407FA935CBF8DE2164DF.jpg",
        quantity: 1,
        select: true,
      },
    ]);
  }),
];
