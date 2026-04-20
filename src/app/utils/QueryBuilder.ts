import { IQueryConfig, IqueryParams, PrismaCountArgs, PrismaFindManyArgs, PrismaModelDelegate, PrismaStringFilter, PrismaWhereConditions } from "../interface/query.interface"

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
}