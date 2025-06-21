export interface Product {
    productId?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stockQuantity: number;
    imageUrl?: string;
    imagePath?: string;

    onSale?: boolean;
    originalPrice?: number;
    createdAt?: string | Date;
}



export interface ProductFilter {
    query?: string;
    category?: string;
    sortOrder?: string;
} 