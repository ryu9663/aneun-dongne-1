// const { Post, Like, sequelize, Sequelize } = require("../../../models");

// module.exports = async (userId, areacode, sigungucode, tag, searchWord) => {
//   console.log("하팅", areacode, sigungucode, tag, searchWord);
//   console.log("하팅2", tag);
//   let result = [];
//   await Post.findAll({
//     raw: true,
//     attributes: [
//       "id",
//       "post_addr1",
//       "post_addr2",
//       "post_areacode",
//       "post_contentid",
//       "post_contenttypeid",
//       "post_firstimage",
//       "post_firstimage2",
//       "post_mapx",
//       "post_mapy",
//       "post_sigungucode",
//       "post_title",
//       "post_wtmx",
//       "post_wtmy",
//       "post_tags",
//     ],
//     include: [
//       {
//         model: Like,
//         attributes: [[sequelize.literal("COUNT(`Likes`.`id`)"), "likeCount"], "like_user_id"],
//       },
//     ],
//     group: "post_contentid",
//     order: [
//       [sequelize.literal("COUNT(`Likes`.`id`)"), "DESC"],
//       ["post_readcount", "DESC"],
//     ],
//     where: {
//       [Sequelize.Op.and]: [
//         { post_tags: { [Sequelize.Op.substring]: `${tag}` } },
//         { post_title: { [Sequelize.Op.substring]: `${searchWord}` } },
//         { post_areacode: areacode },
//       ],
//     },
//   })
//     .then((data) => {
//       console.log("데이터 잘들어왔니?", data);
//       result = data.filter((el) => {
//         if (sigungucode === "null") {
//           return true;
//         } else if (sigungucode === el.post_sigungucode) {
//           return true;
//         } else {
//           return false;
//         }
//       });
//       for (let i = 0; i < result.length; i++) {
//         result[i].isLiked = false;
//         if (result[i]["Likes.like_user_id"] === userId) {
//           result[i].isLiked = true;
//         }
//         delete result[i]["Likes.like_user_id"];
//       }
//       result.splice(100);
//     })
//     .catch((err) => console.log(err));
//   return result;
// };
const { Post, Like, sequelize, Sequelize } = require("../../../models");

module.exports = async (userId, areacode, sigungucode, tag, searchWord) => {
  console.log("하팅", areacode, sigungucode, tag, searchWord);
  console.log("하팅 태그", tag);
  let result = [];
  await Post.findAll({
    attributes: [
      "id",
      "post_addr1",
      "post_addr2",
      "post_areacode",
      "post_contentid",
      "post_contenttypeid",
      "post_firstimage",
      "post_firstimage2",
      "post_mapx",
      "post_mapy",
      "post_sigungucode",
      "post_title",
      "post_wtmx",
      "post_wtmy",
      "post_tags",
    ],
    include: [
      {
        model: Like,
        attributes: ["like_user_id"],
        group: "Posts.post_contentid",
      },
    ],
    where: {
      post_title: { [Sequelize.Op.substring]: `${searchWord}` },
      post_areacode: areacode,
    },
  })
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        result.push(data[i].dataValues);
        let result2 = result[i].Likes.map((el) => {
          return el.dataValues.like_user_id;
        });
        result[i].like_user_ids = result2;
        result[i].isLiked = false;
        if (result[i].like_user_ids.includes(userId)) {
          result[i].isLiked = true;
        }
        result[i].likeCount = result[i].Likes.length;
        // delete result[i].like_user_ids;
      }
      result = result.filter((el) => {
        if (sigungucode === "null" || sigungucode === 0) {
          return true;
        } else if (sigungucode === el.post_sigungucode) {
          return true;
        } else {
          return false;
        }
      });
      result = result.filter((el) => {
        if (tag === "") {
          return true;
        } else if (el.post_tags !== null) {
          return el.post_tags.includes(tag);
        } else {
          return false;
        }
      });
      result.sort(function (a, b) {
        return b.likeCount - a.likeCount;
      });
      result.splice(30);
      // console.log("지역선택한 돋보기버튼클릭", result);
    })
    .catch((err) => console.log("에러", err));
  return result;
};
