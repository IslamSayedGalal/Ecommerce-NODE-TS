import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Model } from "mongoose";
import { ApiFeature, IQuery } from "./ApiFeatures";

export const getAll = <T>(Model: Model<T>) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query as IQuery;
      const data = Model.find({});
      const { mongoQuery, paginationResult } = await new ApiFeature(data, query)
        .populate()
        .filter()
        .limitFields()
        .search()
        .sort()
        .paginate();

      res.status(StatusCodes.OK).json({
        pagination: {
          length: mongoQuery.length,
          ...paginationResult,
        },
        data: mongoQuery,
        message: "found successfully",
      });
    }
  );

export const getOne = <T>(Model: Model<T>) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const data = await Model.findById(id);
      if (!data) {
        return next(new Error("data not found"));
      }
      res.status(StatusCodes.OK).json({
        message: "found successfully",
        data,
      });
    }
  );

export const createOne = <T>(Model: Model<T>) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await Model.create(req.body);
      res.status(StatusCodes.CREATED).json({
        message: "created successfully",
        data,
      });
    }
  );

export const updateOne = <T>(Model: Model<T>) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const updatedData = await Model.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true }
      );
      if (!updatedData) {
        return next(new Error("data not found"));
      }
      res.status(StatusCodes.OK).json({
        message: "updated successfully",
        data: updatedData,
      });
    }
  );

export const deleteOne = <T>(Model: Model<T>) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const deletedData = await Model.findByIdAndDelete(id);
      if (!deletedData) {
        return next(new Error("data not found"));
      }
      res.status(StatusCodes.OK).json({
        message: "deleted successfully",
        data: deletedData,
      });
    }
  );
