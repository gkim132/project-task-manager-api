import { Model, Document, Query } from "mongoose";

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

  constructor(model: Model<T>, queryParams: QueryParams) {
    this.query = model.find();
    this.queryParams = queryParams;
    this.model = model;
  }

  paginate(): this {
    const page = parseInt(this.queryParams.page ?? "1");
    const limit = parseInt(this.queryParams.limit ?? "10");

    if (isNaN(page) || page < 1) {
      throw new Error("Page must be a positive number");
    }
    if (isNaN(limit) || limit < 1) {
      throw new Error("Limit must be a positive number");
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
    const allowedSortFields = ["title", "status", "createdAt"];

    if (this.queryParams.sort) {
      let sortField = this.queryParams.sort.startsWith("-")
        ? this.queryParams.sort.substring(1)
        : this.queryParams.sort;

      if (!allowedSortFields.includes(sortField)) {
        this.query = this.query.sort("-createdAt");
        return this;
      }

      const sortOrder = this.queryParams.sort.startsWith("-") ? -1 : 1;
      this.query = this.query.sort({ [sortField]: sortOrder });
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
