/**
 *  [limit, page, title, sort]
 */
import { Model, Document, Query, SortOrder } from "mongoose";

type QueryParams = {
  page?: string;
  limit?: string;
  sort?: string;
  title?: string;
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
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  filter(): this {
    if (this.queryParams.title) {
      const regex = new RegExp(this.queryParams.title, "i");
      this.query = this.query.where("title").regex(regex);
    }
    return this;
  }

  sort(): this {
    if (this.queryParams.sort) {
      const sortField = this.queryParams.sort.startsWith("-")
        ? this.queryParams.sort.substring(1)
        : this.queryParams.sort;
      const sortOption: Record<string, SortOrder> = {
        [sortField]: this.queryParams.sort.startsWith("-") ? -1 : 1
      };
      this.query = this.query.sort(sortOption);
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
