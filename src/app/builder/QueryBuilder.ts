import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'sortBy', 'sortOrder', 'page', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
    this.queryModel = this.queryModel.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sortBy = this?.query?.sortBy as string;
    if (sortBy) {
      const sortOrder = this.query.sortOrder === 'desc' ? -1 : 1;
      this.queryModel = this.queryModel.sort({ [sortBy]: sortOrder });
    }
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.queryModel = this.queryModel.skip(skip).limit(limit);

    return this;
  }

  limitFields() {
    const fileds = (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.queryModel = this.queryModel.select(fileds);

    return this;
  }

  async countTotal() {
    const totalQueries = this.queryModel.getFilter();
    const total = await this.queryModel.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
    };
  }
}

export default QueryBuilder;
