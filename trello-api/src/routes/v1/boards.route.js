import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { boardsController } from '~/controllers/boards.controller';
import { boardsValidation } from '~/validations/boards.validation';

const Router = express.Router();

/** /boards */
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'API get list of boards'
    });
  })
  .post(boardsValidation.createBoardValidation, boardsController.createNew);

export const boardRoutes = Router;