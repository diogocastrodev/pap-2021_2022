import { ProductSellType } from "@src/graphql/graphql";

export type SectionType = {
    id: string | number;
    image: string;
    title: string;
    titleExtraInfo?: string;
    price: number;
    description: string;
    location: string;
    post_date: string;
    sellType: ProductSellType;
}