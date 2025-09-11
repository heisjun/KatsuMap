# KatsuMap 
<img src="https://github.com/user-attachments/assets/4b30bb0d-4f25-4cef-aed1-d093acdacaee?raw=true" width="500" height="auto"/>

맛집 인스타그램의 특성상 검색 기능과 해당 위치를 바로 확일할 수 있으면 좋겠다는 생각을 했습니다. 돈가스 맛집리스트를 지역별, 종류별로 정렬할 수 있게 하고 요즘 돈까스집들은 웨이팅 프로그램을 쓰는데 그 프로그램과 연동할 수 있다면 연동하여 웨이팅 현황들을 확인하고, 내 주변 돈까스 맛집까지 볼 수 있게끔 개발을 진행했습니다.
## 개발기간 & 개발환경 & 구성원

24.05 ~ 24.09


NextJs, TypeScript, CSS-MODULE, Tanstack-Query, Next-Auth, Vercel, PostgreSQL


개인프로젝트

## 주요기능 및 구현내용
<img src="https://github.com/user-attachments/assets/e0bb6f12-e413-458e-9321-59d42bc0bf29?raw=true" width="1000" height="auto"/>
<img src="https://github.com/user-attachments/assets/e0a89771-f5d7-4496-880a-2f663cd9647d?raw=true" width="1000" height="auto"/>
<img src="https://github.com/user-attachments/assets/d2fe843b-4ccd-4a30-9eb5-38ec5f8d75ea?raw=true" width="1000" height="auto"/>
<img src="https://github.com/user-attachments/assets/a64aa44d-6108-454d-82ce-1d891caaca62?raw=true" width="1000" height="auto"/>
<img src="https://github.com/user-attachments/assets/3799557e-74c6-4880-8dc5-f6ed374006c5?raw=true" width="1000" height="auto"/>
<img src="https://github.com/user-attachments/assets/bbb7be41-2759-445e-a4fc-6a5ce5ed002c?raw=true" width="1000" height="auto"/>

- **로그인 & 회원정보 페이지 구현**
    - [사용자 인증 기능을 간편하고 안전하게 구현하기위해 next-auth를 이용한 로그인 기능 구현](https://www.notion.so/Next-Auth-5157977ea4fb422e94b4f85c73f5de55?pvs=4)
    - [로그인 여부에 따른 화면 구성을 위해 useSession을 이용하여 화면을 다르게 구현](https://www.notion.so/useSession-1bcc624bc4fb468e807c0bfdab5b6ffa?pvs=4)
- **돈가스 가게 정보 페이지 구현**
    - [사용자에게 즉각적인 스크랩 피드백을 주기위해  useMutation을 이용한 Optimistic Update 구현](https://www.notion.so/useMutation-Optimistic-Update-214cd82504974afe90ea4b9bcc498f4e?pvs=4)
    - [사용자 편의를 위해 웹&모바일 환경에서 스와이프 가능한 이미지캐러셀 구현](https://www.notion.so/cf7f636767624c52afbd419c3aaddba7?pvs=4)
    - [react-use-gesture 와 react-spring을 이용한 반응형 스와이프 모달창 구현](https://www.notion.so/react-use-gesture-react-spring-0860c148bb484bfcb6d2b6601a9a49af?pvs=4)
    - [가게들을 인기순/최신순으로 정렬하는 쿼리문 설계 및 구현](https://www.notion.so/6a8140119cb1465aa3359f56a32d4bac?pvs=4)
    - [각 사용자의 스크랩 여부에 따른 가게 정보를 출력하는 쿼리문 설계 및 구현](https://www.notion.so/KatsuInfo-d212b23a4a57411a98f74501d596cd5a?pvs=4)
    - [가게들을 북마크 할 수 있는 쿼리문 설계 및 구현](https://www.notion.so/f329c8e366ed4b2082de4201dc8aa991?pvs=4)
    - [키워드를 통해 원하는 검색결과를 확인할 수 있는 쿼리문 설계 및 구현](https://www.notion.so/fd2019e7e7ff4e9a98348c326ef0a32a?pvs=4)
- **카카오맵 API & 캐치테이블 API 관련 기능 구현**
    - [카카오맵을 이용하여 전체 가게리스트들을 한 번에 확인할 수 있는 기능 구현](https://www.notion.so/890bec5df002483aa5c90d65f11fdf64?pvs=4)
    - [카카오맵을 이용해 현재 위치좌표를 확인하는 기능 구현](https://www.notion.so/7edce736c5184995a3764fef980bea8e?pvs=4)
    - [캐치테이블API를 활용하여 특정 가게의 웨이팅 현황 확인할 수 있는 기능 구현](https://www.notion.so/API-ef6e1d1951564401b34e18bab9e923e9?pvs=4)
    

## 프로젝트를 진행하며 느낀점
매번 React를 이용한 CSR 방식의 개발을 하며 항상 SEO최적화와 초기 렌더링 속도의 한계를 경험해왔습니다. 이번 프로젝트를 기획할 때에도 사용자들이 검색을 통한 유입과 사용자 경험에 매우 중요하다고 판단하여 NextJS의 SSR 방식을 이용하여 SEO를 최적화 하고, 성능이 중요한 웹 애플리케이션에서 빠른 로딩 속도를 유지할 수 있게 만들었습니다. 또한 서버리스 아키텍처 구조로 진행된 만큼 직접 DB를 설계하고 API를 명세하는 과정에서 데이터 구조를 최적화하는 방법과 확장성과 유지보수를 고려한 테이블 구조를 설계하는것이 중요하다는 것을 느꼈고, 각 엔드포인트의 목적과 데이터 요청/응답 형식을 명확히 정의했습니다. 이 과정에서 RESTful API의 설계 원칙을 따르며, 효율적이고 직관적인 API를 제공하고자 했습니다. 서버리스 아키텍처는 초기 설정은 간편하지만, 확장성과 성능을 고려한 설계가 필수적이라는 점을 알게 되었습니다. 또한, 데이터베이스 설계와 API 명세 작성이 프로젝트의 전반적인 성공에 얼마나 중요한지 다시 한번 느꼈습니다.
