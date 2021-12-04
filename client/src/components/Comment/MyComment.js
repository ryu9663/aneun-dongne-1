import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MyHashTag from "../HashTag/MyHashTag";
import { useRecoilState, useSetRecoilState } from "recoil";
import { defaultcomments, updatecomment } from "../../recoil/recoil";
const CommentWrapper = styled.div`
  width: 100%;
`;
const Comment = styled.div`
  position: relative;
  display: flex;
  border: 1px gray solid;
  height: 200px;
  margin: 10px;
`;
const Profile = styled.div`
  position: relative;
  /* background-color: red; */
  width: 80px;
  height: 140px;
  margin: 40px;
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  position: absolute;
  /* background-color: white; */
`;

const NickName = styled.span`
  /* background-color: yellowgreen; */
  position: absolute;
  bottom: 5px;
  text-align: center;
  width: 100%;
`;

const ContentBox = styled.div`
  margin-top: 30px;
  position: relative;
  width: 480px;
  height: 140px;
  > button {
    position: absolute;
    right: -10px;
    top: 20px;
    width: 80px;
    border: none;
    height: 40px;
    background-color: rgb(192, 251, 255);
    background-image: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.9) 0,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0) 100%
    );
    transition: all 0.5s ease;
    border-radius: 20px;
  }

  button:hover {
    transform: scale(1.1);
  }

  button:active {
    transform: scale(1.1);
  }
`;

const Content = styled.input`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 370px;
  height: 60px;
  padding-left: 10px;
  padding-right: 10px;
`;

const HashTagWrapper = styled.div`
  /* display: flex; */
  position: absolute;
  /* background-color: pink; */
  width: 370px;
  height: 50px;
  bottom: 10px;
  left: 10px;
  white-space: nowrap;
  border: none;
`;
const Date = styled.div`
  position: absolute;
  bottom: 5px;
  right: 10px;
`;

function MyComment() {
  const [pending, setPending] = useState(false);
  const [something, setSomething] = useState("");
  const [text, setText] = useState("");
  const [updateComment, setUpdateComment] = useRecoilState(updatecomment);
  const [tags, setTags] = useState([]);
  const [defaultComment, setDefaultComment] = useRecoilState(defaultcomments);

  //이게 응답이라고 생각
  const myComment = { img: "/people3.png", nickname: "김코딩", comment: "", tags: [], date: "DB에서 날라오겠지" };
  const writeSomething = (e) => {
    setSomething(e.target.value);
  };

  const registerMyComment = (something) => {
    console.log(something);
    setUpdateComment(false); //창 내리기 하려고 만들었는데 왜 안됨 -> DetailPage-index 랑 연결
    // axios들어가야함
    setText(something);
    setPending(true);
  };

  useEffect(() => {
    if (pending) {
      setUpdateComment(true);
      if (text.length > 0) {
        //엔터키 누르면 두번렌더링되서 한번 빈칸나오는거 우선 이렇게 해놨는데 임시방편임
        //이렇게하면 댓글안쓰면 댓글입력하세요 메시지 나오게를 못함
        setDefaultComment([{ ...myComment, ...{ text, tags } }, ...defaultComment]);
      }
      console.log(defaultComment);
      setPending(false);
      setTags([]);
      setSomething("");
    }
  }, [pending]);

  useEffect(() => {}, []);
  return (
    <CommentWrapper>
      <Comment>
        <Profile>
          <ProfileImg src={myComment.img}></ProfileImg>
          <NickName>{myComment.nickname}</NickName>
        </Profile>
        <ContentBox>
          <Content
            type="text"
            value={something}
            placeholder="댓글을 입력하슈"
            onChange={(e) => writeSomething(e)}
            onKeyUp={(e) => {
              if (e.key === "Enter") registerMyComment(something);
            }}
          ></Content>
          <button onClick={() => registerMyComment(something)}>작성하기</button>
          <HashTagWrapper>
            <MyHashTag tags={tags} setTags={setTags} />
          </HashTagWrapper>
        </ContentBox>
        <Date>작성날짜 : {myComment.date}</Date>
      </Comment>
    </CommentWrapper>
  );
}

export default MyComment;
