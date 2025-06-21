export interface Order {
    orderId?: number;
    userId?: number;
    customerName?: string;
    totalAmount: number;
    status: string;
    newStatus?: string;
    orderDate?: Date;
    updatedAt?: Date;
    items?: OrderItem[];
    user?: {
        userId: number;
        username: string;
        email: string;
    };
}

export interface OrderItem {
    orderItemId?: number;
    orderId?: number;
    productId: number;
    quantity: number;
    price: number;
    unitPrice?: number;
    productName?: string;
    product?: any;
} 