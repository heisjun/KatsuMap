"use client";
import { useState } from "react";
import { questions } from "./data";
import styles from "./typetest.module.css";
import { KatsuInfo } from "@/app/_lib/definitions";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Score {
  경양식: number;
  일식: number;
  퓨전: number;
}

const restaurantList = {
  경양식: ["금성수제돈까스", "김자순수제돈가스", "돈까스먹는용만이", "메시야"],
  일식: [
    "일월카츠",
    "하우스바이콘반",
    "돈까스 광명",
    "오제제",
    "톤제",
    "윤돈",
    "돈카스창현",
    "하쿠비",
    "마루이",
  ],
  퓨전: ["돈까스먹는용만이", "김자순수제돈가스", "메시야"],
};

const TypeTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState<Score>({ 경양식: 0, 일식: 0, 퓨전: 0 });
  const [finished, setFinished] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState<KatsuInfo | null>(null);
  const [myType, setMyType] = useState("");
  const router = useRouter();

  const onGoInfo = (postId: string) => {
    router.push(`/${postId}`);
  };

  const handleAnswer = (type: string, weight: number) => {
    setScore((prevScore) => ({
      ...prevScore,
      [type]: prevScore[type as keyof Score] + weight,
    }));

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setFinished(true);
      fetchRestaurantInfo();
    }
  };

  const fetchRestaurantInfo = async () => {
    const maxType = Object.keys(score).reduce((a, b) =>
      score[a as keyof typeof score] > score[b as keyof typeof score] ? a : b
    );
    setMyType(maxType);
    const selectedRestaurant =
      restaurantList[maxType as keyof typeof restaurantList][
        Math.floor(
          Math.random() *
            restaurantList[maxType as keyof typeof restaurantList].length
        )
      ];

    try {
      const response = await fetch(
        `/api/store/info?name=${selectedRestaurant}`
      );
      const data: KatsuInfo = await response.json();
      setRestaurantInfo(data);
    } catch (error) {
      console.error("Error fetching restaurant info:", error);
      setRestaurantInfo(null);
    }
  };

  function convertType(katuType: string) {
    if (katuType === "경양식") {
      return "근본 of 근본! 경양식 돈가스입니다";
    } else if (katuType === "일식") {
      return "바삭함의 미학! 일식 돈가스입니다";
    } else if (katuType === "퓨전") {
      return "맛의 모험가! 퓨전 돈가스입니다!";
    }
  }

  const getResult = () => {
    if (!restaurantInfo) {
      return "두구두구";
    }
    return (
      <div>
        <div className={styles.recommandSpan}>
          <div className={styles.span1}>당신에게 추천하는 돈가스는?</div>
          <div className={styles.span2}>
            {convertType(myType)?.split("!")[0]}
          </div>
          <div className={styles.span2}>
            {convertType(myType)?.split("!")[1]}
          </div>
        </div>
        <div className={styles.imageBlock}>
          <Image
            src={restaurantInfo.image_url} // 이미지 경로
            className={styles.storeImage} // 기존 스타일 클래스
            alt="돈가스 이미지" // alt 텍스트
            width={400} // 이미지의 고정 너비 또는 원본 크기에 맞는 너비 값 (필수)
            height={400} // 이미지의 고정 높이 또는 원본 크기에 맞는 높이 값 (필수)
            priority
          />
        </div>
        <div className={styles.storeTitle}>{restaurantInfo.name}</div>
        <div className={styles.storeName}>{restaurantInfo.title}</div>
        <div className={styles.storeLocation}>{restaurantInfo.address}</div>
        <button
          onClick={() => onGoInfo(restaurantInfo.post_id)}
          className={styles.storeBtn}
        >
          자세히 보러가기
        </button>
      </div>
    );
  };

  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className={styles.selectContainer}>
      <div className={styles.progressbarContainer}>
        <div
          className={styles.progressBar}
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>
      {!finished ? (
        <div>
          <h2 className={styles.question}>
            {questions[currentQuestion].question}
          </h2>
          <div className={styles.selectBlock}>
            {questions[currentQuestion].options.map(
              (option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.type, option.weight)}
                  className={styles.selectBtn}
                >
                  {option.text}
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <h2>{getResult()}</h2>
      )}
    </div>
  );
};

export default TypeTest;
