import { Model, Document, Query } from "mongoose";
import BaseError from "./baseError";
import { IUserRequest } from "../middleware/authMiddleware";

const ALLOWED_SORT_FIELDS = ["title", "status", "createdAt"];

type QueryParams = {
  page?: string;
  limit?: string;
  sort?: string;
  title?: string;
  status?: string;
};

export default class QueryBuilder<T extends Document> {
  query: Query<T[], T>;
  queryParams: QueryParams;
  model: Model<T>;

  constructor(model: Model<T>, req: IUserRequest) {
    this.query =
      req.user.role === "admin"
        ? model.find()
        : model.find({ createdBy: req.user._id });
    this.queryParams = req.query;
    this.model = model;
  }

  paginate(): this | any {
    const page = parseInt(this.queryParams.page ?? "1");
    const limit = parseInt(this.queryParams.limit ?? "10");
    if (isNaN(page) || page < 1) {
      throw new BaseError("Page must be a positive number", 400);
    }
    if (isNaN(limit) || limit < 1) {
      throw new BaseError("Limit must be a positive number", 400);
    }
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  filter(): this {
    if (this.queryParams.title) {
      const regex = new RegExp(this.queryParams.title, "i");
      this.query = this.query.where("title").regex(regex);
    }
    if (this.queryParams.status) {
      const status = this.queryParams.status.split(",");
      this.query = this.query.where("status").in(status);
    }

    return this;
  }

  sort(): this {
    if (this.queryParams.sort) {
      const isDescending = this.queryParams.sort.startsWith("-");
      const sortField = this.queryParams.sort.replace("-", "");

      if (!ALLOWED_SORT_FIELDS.includes(sortField)) {
        this.query = this.query.sort("-createdAt");
        return this;
      }

      this.query = this.query.sort({ [sortField]: isDescending ? -1 : 1 });
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  async getPaginationMetadata(): Promise<{
    currentPage: number;
    limit: number;
    totalPages: number;
    totalDocuments: number;
  }> {
    const page = parseInt(this.queryParams.page ?? "1", 10);
    const limit = parseInt(this.queryParams.limit ?? "10", 10);
    const totalDocuments = await this.model.countDocuments(
      this.query.getFilter()
    );
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      currentPage: page,
      limit,
      totalPages,
      totalDocuments
    };
  }
}
