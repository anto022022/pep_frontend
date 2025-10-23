"use client";

import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import AddPostBuyingRequest from "@/app/[locale]/_components/OverLay/CreateBuyingRequestDialog";
import { setIsAddPostBuyingRequestOpen } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";

import PostNeedsCard from "@/app/[locale]/_components/Cards/PostNeedsCard";
// import { useDispatch } from "react-redux";
// import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useGetBuyingRequestListQuery } from "@/app/[locale]/_store/apiReducer/buyingRequestApi";

function PostBuyingRequest() {
  const dispatch = useAppDispatch();
  const { data } = useGetBuyingRequestListQuery();

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '5rem' }}>
        {data?.data?.map((item: any, index: number) => (
          <PostNeedsCard key={index} reqData={item} />
        ))}
      </div>

      <ButtonIcon
        className={"wid-100 btn-c-dark"}
        name="Post buying request"
        onClick={() => dispatch(setIsAddPostBuyingRequestOpen(true))}
      >
        Post buying request
      </ButtonIcon>
      <AddPostBuyingRequest />
    </>
  );
}

export default PostBuyingRequest;