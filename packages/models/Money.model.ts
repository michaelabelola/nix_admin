
export type Money = {
    amount: number;
    currencyCode: string;
};

export type Money_RangedQuery = {
    "amount"?: {
        "start"?: number,
        "end"?: number,
        "value"?: number
    },
    "currencyCode"?: string
}
