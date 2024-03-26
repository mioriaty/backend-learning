import express from 'express';
import { StatusCodes } from 'http-status-codes';

const Router = express.Router();

/** /boards */
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'API get list of boards'
    });
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({
      message: 'API create a new board'
    });
  });

export const boardRoutes = Router;