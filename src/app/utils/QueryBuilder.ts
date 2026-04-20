import { IQueryConfig, IqueryParams, PrismaCountArgs, PrismaFindManyArgs, PrismaModelDelegate, PrismaNumberFilter, PrismaStringFilter, PrismaWhereConditions } from "../interface/query.interface"

// T = Model Type
export class QueryBuilder<
    T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>,
> {
    private query: PrismaFindManyArgs;
    private coundQuery: PrismaCountArgs;
    private page: number = 1;
    private limit: number = 10;
    private skip: number = 0;
    private sortBy: string = "createdAt";
    private sortOrder: "asc" | "desc" = "asc";
    private selectFields: Record<string, boolean | undefined>;

    constructor(
        private model: PrismaModelDelegate,
        private queryParams: IqueryParams,
        private config: IQueryConfig
    ) {
        this.query = {
            where: {},
            include: {},
            orderBy: {},
            skip: 0,
            take: 10,
        };
        this.coundQuery = {
            where: {}
        }
    }

    search(): this {
        const { searchTerm } = this.queryParams;
        const { searchableFields } = this.config;

        // eg. doctor searchable Fields: ['user.name', 'user.email']
        if (searchTerm && searchableFields && searchableFields.length > 0) {
            const searchConditions: Record<string, unknown>[] = searchableFields.map((field) => {
                if (field.includes('.')) {
                    const parts = field.split('.');

                    if (parts.length === 2) {
                        const [relation, nestedField] = parts;

                        const stringFilter: PrismaStringFilter = {
                            contains: searchTerm,
                            mode: 'insensitive' as const,
                        }

                        return {
                            [relation]: {
                                [nestedField]: stringFilter
                            }
                        }
                    } else if (parts.length === 3) {
                        const [relation, nestedRelation, nestedField] = parts;

                        const stringFilter: PrismaStringFilter = {
                            contains: searchTerm,
                            mode: 'insensitive' as const,
                        }

                        return {
                            [relation]: {
                                [nestedRelation]: {
                                    [nestedField]: stringFilter
                                }
                            }
                        }
                    }
                }

                // direct field search
                const stringFilter: PrismaStringFilter = {
                    contains: searchTerm,
                    mode: 'insensitive' as const,
                }

                return {
                    [field]: stringFilter
                }
            })

            const whereCondition = this.query.where as PrismaWhereConditions;
            whereCondition.OR = searchConditions;

            const CountWhereCondition = this.coundQuery.where as PrismaWhereConditions;
            CountWhereCondition.OR = searchConditions;
        }

        return this;
    }

    // /doctors?searchTerm=ashiqur&page=1&sortBy=name&orderBy=asc&speciality=cardiology&appointmentFee[lt]=100 => {}
    // { speciality: cardiology, appointmentFee: { lt: 100 } }
    filter(): this {

        const { filterableFields } = this.config;
        const excludeFields = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields', 'includes'];

        const filterParams: Record<string, unknown> = {};

        Object.keys(this.queryParams).forEach((key) => {

            if (!excludeFields.includes(key)) {
                filterParams[key] = this.queryParams[key];
            }
        })

        const queryWhere = this.query.where as Record<string, unknown>;
        const countQueryWhere = this.coundQuery.where as Record<string, unknown>;

        Object.keys(filterParams).forEach((key) => {
            const value = filterParams[key];

            if (value === undefined || value === '') return;

            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);

            if (!isAllowedField) return;

            // doctor?user.name=ashiqur => { user: { name: ashiqur } }
            if (key.includes('.')) {

                const parts = key.split('.');

                if (filterableFields && !filterableFields.includes(key)) return;

                if (parts.length === 2) {
                    const [relation, nestedField] = parts;

                    if (!queryWhere[relation]) {
                        queryWhere[relation] = {};
                        countQueryWhere[relation] = {};
                    }

                    queryWhere[relation] = {
                        [nestedField]: this.parseFilterValue(value)
                    }

                    countQueryWhere[relation] = {
                        [nestedField]: this.parseFilterValue(value)
                    }

                    return;
                } else if (parts.length === 3) {
                    const [relation, nestedRelation, nestedField] = parts;

                    if (!queryWhere[relation]) {
                        queryWhere[relation] = {};
                        countQueryWhere[relation] = {};
                    }

                    queryWhere[relation] = {
                        [nestedRelation]: {
                            [nestedField]: this.parseFilterValue(value)
                        }
                    }

                    countQueryWhere[relation] = {
                        [nestedRelation]: {
                            [nestedField]: this.parseFilterValue(value)
                        }
                    }

                    return;
                }
            } else {
                // direct value when no dot notation is used
                queryWhere[key] = this.parseFilterValue(value);
                countQueryWhere[key] = this.parseFilterValue(value);
                return;
            }

            // range filter parsing
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                queryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                countQueryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                
                return;
            }

            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);
        })

        return this;
    }

    paginate(): this {

        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;

        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;

        this.query.skip = this.skip;
        this.query.take = this.limit;

        return this;
    }

    private parseFilterValue(value: unknown): unknown {
        if (value === 'true') return true;
        if (value === 'false') return false;

        if (typeof value === 'string' && !isNaN(Number(value)) && value != "") {
            return Number(value);
        }

        if (Array.isArray(value)) {
            return { in: value.map(item => this.parseFilterValue(item)) };
        }

        return value;
    }

    private parseRangeFilter(value: Record<string, string | number>): PrismaNumberFilter | PrismaStringFilter | Record<string, unknown> {
        const rangeQuery: Record<string, string | number | (string | number)[]> = {};

        Object.keys(value).forEach((operator) => {
            const operatorValue = value[operator];

            const parseValue: string | number = typeof operatorValue === 'string' && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;

            switch (operator) {
                case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                    rangeQuery[operator] = parseValue;
                    break;
                case 'in':
                case 'notIn':
                    if (Array.isArray(operatorValue)) {
                        rangeQuery[operator] = operatorValue;
                    } else {
                        rangeQuery[operator] = [parseValue]
                    }
                    break;
                default:
                    break;
            }
        });

        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
    }
}