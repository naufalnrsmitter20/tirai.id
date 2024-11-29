export interface PaginationMetadata {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMetadata;
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <T, K>(
  // eslint-disable-next-line no-unused-vars
  model: any,
  // eslint-disable-next-line no-unused-vars
  options?: PaginateOptions,
  // eslint-disable-next-line no-unused-vars
  args?: K,
) => Promise<PaginatedResult<T>>;

/**
 * Creates a pagination function for querying paginated data from a model.
 *
 * @param {PaginateOptions} defaultOptions - Default pagination options including `page` and `perPage`.
 * @returns {PaginateFunction} A function that can be used to paginate data for a given model.
 *
 * @template T The type of the data being queried.
 * @template K The type of the optional arguments passed to the model methods.
 *
 * @example
 * const paginate = paginator({ perPage: 10 });
 * const result = await paginate<User, Prisma.UserFindManyArgs>(prisma.user, { page: 2 }, { where: { isActive: true } });
 * console.log(result.data); // Array of users
 * console.log(result.meta); // Pagination metadata
 */
export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, options, args: any = { where: undefined }) => {
    const page = Number(options?.page ?? defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage ?? defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};
