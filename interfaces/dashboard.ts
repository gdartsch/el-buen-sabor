import { IOrder } from "./order";
import { IProduct } from "./products";

export interface DashboardSummaryResponse {
    numberOfOrders: number;
    paidOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithNoInventory: number;
    lowInventory: number;
    notPaidOrders: number;
    products: any;
    orders: any;
    ingredients: any;
}