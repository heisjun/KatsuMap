"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IKatsuInfo } from "@/model/KatsuInfo";
import { getSingleKatsuInfo } from "../_lib/getSingleKatsuInfo";
import BasicMap from "../../_component/Map";

interface Props {
  postId: string;
}
export default function KatsuDetail({ postId }: Props) {
  const { data: store, error } = useQuery<
    IKatsuInfo,
    Object,
    IKatsuInfo,
    [_1: string, _2: string]
  >({
    queryKey: ["store", postId],
    queryFn: getSingleKatsuInfo,
    //staleTime: 0,
    //gcTime: 300 * 1000,
  });

  if (error) {
    return <div>데이터없음</div>;
  }
  if (!store) {
    return null;
  }

  return (
    <div>
      <div>{store.name}</div>
      <img src={store.image_url} />
      <div>{store.explain}</div>
      <BasicMap store={store} />
      <div>웨이팅 확인</div>
    </div>
  );
}
