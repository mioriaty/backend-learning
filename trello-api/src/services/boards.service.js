import { slugify } from '~/utils/slugify';

/**
 * @typedef {Object} ReqBody
 * @property {string} title
 * @property {string} description
 */
/**
 * @param {ReqBody} reqBody
 */
const createNew = async (reqBody) => {
  try {
    // Xử lý logic đặc thù của dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    };

    // Gọi tới Model để xử lý lư bản ghi newBoard vào database

    // Làm thêm các xử lý khác với các Collection khác ...
    // Bắn email, notification về cho admin khi có 1 cái board mới được tạo
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const boardsService = {
  createNew
};