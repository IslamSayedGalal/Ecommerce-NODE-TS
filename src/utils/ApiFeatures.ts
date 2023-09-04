import { Document, Query} from "mongoose";


export interface IQuery {
    sort?: string;
    limit?: string;
    page?: string;
    fields?: string;
    populate?: string;
    keyword?: { [key: string]: string };
    [key: string]: string | string[] | { [key: string]: string } | undefined;
}


export class ApiFeature<T extends Document>{
    paginationResult:{
        totalPages:number;
        page:number;
        limit:number;
    }={ totalPages: 0, page: 0, limit: 0 };

    mongoQuery: T[] = [];
    constructor(public mongooseQuery: Query<T[], T>, public queryString: IQuery) { }


    // 1) Filtering
    filter() {
        const queryObject = { ...this.queryString };
        const excludedFields = ["sort", "limit", "page", "fields", "keyword", "populate"];

        excludedFields.forEach((el) => delete queryObject[el]);
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        if(this.mongooseQuery){
            this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        }
        return this;
    }

    // 2) Sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    // 3) Field Limiting
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    // 4) Pagination
    async paginate() {
        const { limit, page } = this.queryString;
        const pageNumber = page? +page : 1;
        const limitNumber = limit? +limit : 10;
        const skip = (pageNumber - 1) * limitNumber;
        const countQuery = this.mongooseQuery.model.find({
            ...this.mongooseQuery.getQuery(),
        });
        const total = await countQuery.countDocuments();
        const totalPages = Math.ceil(total / limitNumber);
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limitNumber);
        this.paginationResult = {
            totalPages,
            page: pageNumber,
            limit: limitNumber,
        };
        this.mongoQuery = await this.mongooseQuery;
        return this;
    }

    // 5) Populate
    populate() {
        if (this.queryString.populate) {
            const populateBy = this.queryString.populate.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.populate(populateBy);
        }
        return this;
    }

    // 6) Search
    search() {
        const { keyword } = this.queryString;
        if (keyword) {
            const keywordObj = {
                $or: Object.keys(keyword).map((key) => ({
                    [key]: { $regex: keyword[key], $options: "i" },
                })),
            } as any;
            this.mongooseQuery = this.mongooseQuery.find(keywordObj);
        }
        return this;
    }

}