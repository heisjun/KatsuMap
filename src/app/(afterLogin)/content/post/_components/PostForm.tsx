"use client";

import { useState, ChangeEvent, FormEvent, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import DaumPostcode from "react-daum-postcode";
import styles from "./postForm.module.css";
import { Map } from "react-kakao-maps-sdk";
import { ToggleBtn } from "./ToggleBtn";
import UploadForm from "./UploadForm";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { FaPenSquare } from "react-icons/fa";
type Post = {
  name: string;
  title: string;
  explain: string;
  image_urls: string;
  image_url: string;
  timeStr: string;
  timeEnd: string;
  breakStr: string;
  breakEnd: string;
  table_id: string;
};

type IMenu = {
  name: string;
  price: string;
};

const PostForm = () => {
  const postID = uuidv4();
  const router = useRouter();
  const [post, setPost] = useState<Post>({
    name: "",
    title: "",
    explain: "",
    image_urls: "",
    image_url: "",
    timeStr: "",
    timeEnd: "",
    breakStr: "",
    breakEnd: "",
    table_id: "",
  });

  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadFormRef = useRef<any>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleUploadComplete = (urls: string[]) => {
    setUploadedUrls(urls);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (uploading) return; // Prevent multiple submissions

    // Trigger the upload
    if (uploadFormRef.current) {
      setUploading(true);
      uploadFormRef.current.saveHandler(); // Call the saveHandler to upload images
    }
  };

  const finalizeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(e);

    const imgUrlsArray = uploadedUrls;
    const convertExplain = post.explain.replace("\n\n", "<br>");
    const convertTime = post.timeStr + "-" + post.timeEnd;
    const breakTime = viewBreak ? post.breakStr + "-" + post.breakEnd : "없음";
    const offTime = viewOff ? selected : "없음";
    const convertMenu = getContent
      .map((ele) => ele.name.replace(/\s+/g, "") + " " + ele.price + "원")
      .join();
    const currentTime = new Date().toISOString();
    try {
      const response = await fetch("/api/write", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postID,
          name: post.name,
          title: post.title,
          image_url: imgUrlsArray[0],
          image_urls: imgUrlsArray,
          explain: convertExplain,
          address: address,
          lat: coordinates?.lat,
          lng: coordinates?.lng,
          time: `영업시간 : ${convertTime}/브레이크 타임 : ${breakTime}/휴무일 : ${offTime}`,
          menu: convertMenu,
          table_id: post.table_id,
          createAt: currentTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      router.replace("/");
    } catch (error) {
      console.error("Error:", error);
      alert("작성 실패!");
    } finally {
      setUploading(false);
    }
  };

  const [address, setAddress] = useState("");
  const [showPostcode, setShowPostcode] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [map, setMap] = useState<any>(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 33.450701,
    lng: 126.570667,
  });

  const [viewOff, setViewOff] = useState<boolean>(false);
  const [viewBreak, setViewBreak] = useState<boolean>(false);
  const [selected, setSelected] = useState("");
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
  };

  const [getContent, setGetContent] = useState<IMenu[]>([
    { name: "", price: "" },
  ]);

  const onAddWritingItem = () => {
    setGetContent([...getContent, { name: "", price: "" }]);
  };

  const onRemoveWritingItem = useCallback(
    (i: number) => {
      setGetContent(getContent.filter((item, index) => index !== i));
    },
    [getContent]
  );

  const handleMenu = (index: number, field: string, value: string) => {
    const newContent = getContent.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setGetContent(newContent);
  };

  const handleComplete = (data: any) => {
    const fullAddress = data.address;
    var geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(fullAddress, function (result: any, status: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        const currentPos = {
          lat: result[0].y,
          lng: result[0].x,
        };
        setAddress(fullAddress);
        setCoordinates(currentPos);
      }
    });
    setShowPostcode(false);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <form
        className={styles.formContainer}
        onSubmit={(e) => {
          finalizeSubmit(e);
        }}
      >
        <div className={styles.contentContainer}>
          <div
            className={styles.contentHeader}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaPenSquare
                style={{ color: "#F8C332", fontSize: 30, marginRight: 10 }}
              />
              <div>기본 정보 입력</div>
            </div>

            <div className={isOpen ? styles.rotate : styles.default}>
              <IoIosArrowDown />
            </div>
          </div>

          <div
            className={`${styles.contentModal} ${
              isOpen ? styles.contentModalOpen : ""
            }`}
          >
            <div className={styles.contentBlock}>
              <div className={styles.contentLabel}>가게이름</div>
              <input
                type="text"
                name="name"
                value={post.name}
                onChange={handleChange}
                placeholder="가게이름을 입력하세요"
                required
              />
            </div>
            <div className={styles.contentBlock}>
              <div className={styles.contentLabel}>주소</div>
              <input
                onClick={() => setShowPostcode(true)}
                type="text"
                name="address"
                value={address}
                readOnly
                onChange={handleChange}
                required
              />
              <div>
                {showPostcode && (
                  <DaumPostcode
                    onComplete={handleComplete}
                    autoClose={false}
                    style={{
                      position: "absolute",
                      width: 400,
                      top: "200px",
                      zIndex: 1000,
                    }}
                  />
                )}
                <Map
                  center={{
                    lat: markerPosition.lat,
                    lng: markerPosition.lng,
                  }}
                  style={{ width: "100%", height: "400px", display: "none" }}
                  level={3}
                  onCreate={setMap}
                ></Map>
              </div>
            </div>
            <div className={styles.timeBlock}>
              <div className={styles.contentLabel}>영업시간</div>
              <input
                type="time"
                step="900"
                name="timeStr"
                value={post.timeStr}
                onChange={handleChange}
                required
              />
              <div className={styles.timeLine}>-</div>
              <input
                type="time"
                name="timeEnd"
                value={post.timeEnd}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.timeBlock}>
              <div className={styles.contentLabel}>브레이크타임</div>
              <ToggleBtn isOn={viewBreak} setisOn={setViewBreak} />
              {viewBreak && (
                <>
                  <input
                    type="time"
                    name="breakStr"
                    value={post.breakStr}
                    onChange={handleChange}
                    required
                  />
                  <div className={styles.timeLine}>-</div>
                  <input
                    type="time"
                    name="breakEnd"
                    value={post.breakEnd}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
            </div>
            <div className={styles.contentBlock}>
              <div className={styles.contentLabel}>휴무일</div>
              <ToggleBtn isOn={viewOff} setisOn={setViewOff} />
              {viewOff && (
                <select
                  onChange={handleSelect}
                  value={selected}
                  className={styles.selectContent}
                >
                  <option value="월요일">월요일</option>
                  <option value="화요일">화요일</option>
                  <option value="수요일">수요일</option>
                  <option value="목요일">목요일</option>
                  <option value="금요일">금요일</option>
                  <option value="토요일">토요일</option>
                  <option value="일요일">일요일</option>
                </select>
              )}
            </div>
            <div className={styles.menuBlock}>
              <div className={styles.contentLabel}>메뉴</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {getContent &&
                  getContent.map((item, i: number) => {
                    return (
                      <div key={i} className={styles.menuInput}>
                        <div>
                          <input
                            type="text"
                            name="menu"
                            value={item.name}
                            placeholder="메뉴"
                            onChange={(e) =>
                              handleMenu(i, "name", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            name="menu"
                            value={item.price}
                            placeholder="가격"
                            onChange={(e) =>
                              handleMenu(i, "price", e.target.value)
                            }
                            required
                          />
                          <span
                            style={{ position: "absolute", right: 20, top: 10 }}
                          >
                            원
                          </span>
                        </div>

                        {getContent.length !== 1 && (
                          <div onClick={() => onRemoveWritingItem(i)}>
                            <TiDeleteOutline className={styles.deleteBtn} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                <button
                  className={styles.addBtn}
                  type="button"
                  onClick={onAddWritingItem}
                >
                  추가하기
                </button>
              </div>
            </div>
          </div>
        </div>
        <UploadForm
          ref={uploadFormRef}
          onUploadComplete={handleUploadComplete}
        />
        <input
          className={styles.titleBlock}
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          placeholder="제목을 입력해주세요"
          required
        />

        <textarea
          className={styles.textArea}
          name="explain"
          value={post.explain}
          onChange={handleChange}
          placeholder="내용을 입력해주세요"
          required
        />

        <button type="submit" disabled={uploading} className={styles.submitBtn}>
          글쓰기
        </button>
        {uploading && <div>업로드 중...</div>}
      </form>
    </>
  );
};

export default PostForm;
