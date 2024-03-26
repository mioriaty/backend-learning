import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @type {import('express').RequestHandler}
 */
const createBoardValidation = async (req, res, next) => {
  // .strict() để bắt lỗi luôn khi có type casting
  const correctCond = Joi.object({
    title: Joi.string().required().min(5).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must be at most 50 characters',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(5).max(256).trim().strict().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 5 characters',
      'string.max': 'Description must be at most 256 characters',
      'string.trim': 'Description must not have leading or trailing whitespace'
    })
  });

  try {
    // Trả về tất cả các lỗi, default: true thì khi gặp lỗi nó sẽ trả về lỗi đấy luôn chứ ko chạy tiếp
    await correctCond.validateAsync(req.body, {
      abortEarly: false
    });

    // Validate xong thì chuyển sang controller hoặc middleware
    next();
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    });
  }
};

export const boardsValidation = {
  createBoardValidation
};