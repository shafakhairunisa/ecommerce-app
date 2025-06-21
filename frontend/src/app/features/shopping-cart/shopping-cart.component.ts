import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ImageService } from '../../core/services/image.service';
import { Cart, CartItem } from '../../core/services/cart.service';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CustomerHeaderComponent
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart: Cart | null = null;
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  
  // Confirmation dialog properties
  showConfirmation: boolean = false;
  confirmationTitle: string = '';
  confirmationMessage: string = '';
  pendingAction: (() => void) | null = null;

  cartCount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private imageService: ImageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  loadCart(): void {
    this.loading = true;
    console.log('Loading cart...');
    
    this.cartService.getCart().subscribe({
      next: (cart) => {
        console.log('Cart loaded successfully:', JSON.stringify(cart));
        this.cart = cart;
        this.loading = false;
        
        // Log cart items for debugging
        if (cart && cart.items) {
          console.log(`Cart has ${cart.items.length} items:`);
          cart.items.forEach((item, index) => {
            console.log(`Item ${index + 1}:`, JSON.stringify(item));
          });
        } else {
          console.log('Cart is empty or has no items array');
          // Ensure we have a valid items array even if backend returns none
          if (this.cart && !this.cart.items) {
            this.cart.items = [];
          }
        }
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.error = 'Failed to load your cart. Please try again later.';
        this.loading = false;
        
        // Ensure we have a valid cart object even on error
        if (!this.cart) {
          this.cart = { userId: this.cartService.getUserId(), items: [] };
        }
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number | string): void {
    // Convert string input to number if needed
    if (typeof newQuantity === 'string') {
      newQuantity = parseInt(newQuantity, 10);
    }

    // Validate inputs
    if (!item) {
      console.error('Invalid item', item);
      this.error = 'Invalid product';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    // Get the product ID using our helper method
    const productId = this.getItemProductId(item);
    
    if (isNaN(newQuantity) || newQuantity === null || newQuantity === undefined) {
      console.error('Invalid quantity', newQuantity);
      this.error = 'Invalid quantity';
      setTimeout(() => this.error = '', 3000);
      return;
    }

    // If trying to set quantity to 0 or less, directly remove the item
    if (newQuantity <= 0) {
      const originalQuantity = item.quantity;
      this.showConfirmationDialog(
        'Remove Item', 
        `Are you sure you want to remove ${item.product?.name || 'this item'} from your cart?`, 
        () => {
          // Instead of calling removeItem, directly handle the removal here
          this.loading = true;
          console.log(`Directly removing product with ID: ${productId}`);
          
          this.cartService.removeFromCart(productId).subscribe({
            next: () => {
              console.log('Item removed successfully, reloading cart');
              // Always reload the cart after removal
              this.loadCart();
              this.successMessage = 'Item removed from cart';
              setTimeout(() => this.successMessage = '', 3000);
            },
            error: (error) => {
              console.error('Error removing item:', error);
              this.error = 'Failed to remove item. Please try again.';
              setTimeout(() => this.error = '', 3000);
              this.loading = false;
              // Reset quantity on error
              item.quantity = originalQuantity;
            }
          });
        }
      );
      
      // Reset to previous quantity in case user cancels
      setTimeout(() => {
        if (this.cart?.items.find((i: CartItem) => i.cartItemId === item.cartItemId)) {
          item.quantity = originalQuantity;
        }
      }, 100);
      return;
    }

    // Check if the quantity actually changed
    if (newQuantity === item.quantity) return;

    // Check if the requested quantity exceeds available stock
    if (item.product && newQuantity > item.product.stockQuantity) {
      this.error = `Sorry, only ${item.product.stockQuantity} items available in stock.`;
      item.quantity = Math.min(item.quantity, item.product.stockQuantity);
      setTimeout(() => this.error = '', 3000);
      return;
    }

    console.log(`Updating quantity for product ${productId} to ${newQuantity}`);
    
    this.loading = true;
    this.cartService.updateCartItemQuantity(productId, newQuantity).subscribe({
      next: (updatedCart) => {
        console.log('Cart updated successfully:', JSON.stringify(updatedCart));
        this.cart = updatedCart;
        this.successMessage = 'Cart updated successfully';
        this.loading = false;
        setTimeout(() => this.successMessage = '', 3000);
        
        // If the updated cart doesn't reflect our changes, reload the cart
        const updatedItem = updatedCart.items.find((i: CartItem) => 
          i.productId === productId || (i.product && i.product.productId === productId)
        );
        
        if (!updatedItem || updatedItem.quantity !== newQuantity) {
          console.log('Cart update discrepancy detected, reloading cart');
          this.loadCart();
        }
      },
      error: (error) => {
        console.error('Error updating cart:', error);
        this.error = 'Failed to update cart. Please try again.';
        setTimeout(() => this.error = '', 3000);
        this.loading = false;
        // Reset the item quantity to its previous value on error
        this.loadCart();
      }
    });
  }

  removeItem(productId: number): void {
    if (!productId && productId !== 0) {
      console.error('Invalid product ID for removal:', productId);
      this.error = 'Invalid product';
      setTimeout(() => this.error = '', 3000);
      return;
    }
    
    console.log(`Removing product with ID: ${productId}`);
    
    // Find the product name for the confirmation message
    const item = this.cart?.items.find((i: CartItem) => 
      i.productId === productId || (i.product && i.product.productId === productId)
    );
    
    if (!item) {
      console.error(`Item with product ID ${productId} not found in cart`);
      this.error = 'Item not found in cart';
      setTimeout(() => this.error = '', 3000);
      return;
    }
    
    const productName = item?.product?.name || 'this item';
    
    this.showConfirmationDialog('Remove Item', `Are you sure you want to remove ${productName} from your cart?`, () => {
      this.loading = true;
      
      // Log the cart state before removal
      console.log('Cart before removal:', JSON.stringify(this.cart));
      
      // First, optimistically remove the item from the local cart
      if (this.cart && this.cart.items) {
        this.cart.items = this.cart.items.filter((i: CartItem) => 
          i.productId !== productId && 
          (!i.product || i.product.productId !== productId) &&
          i.cartItemId !== item.cartItemId
        );
      }
      
      this.cartService.removeFromCart(productId).subscribe({
        next: () => {
          console.log('Item removed from server, reloading cart');
          // Force reload the cart from server to ensure sync
          this.loadCart();
          this.successMessage = 'Item removed from cart';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error removing item:', error);
          this.error = 'Failed to remove item. Please try again.';
          setTimeout(() => this.error = '', 3000);
          this.loading = false;
          // Reload cart on error to ensure UI is in sync
          this.loadCart();
        }
      });
    });
  }

  // Helper method to safely get the product ID from a cart item
  getItemProductId(item: CartItem): number {
    if (item.productId !== undefined && item.productId !== null) {
      return item.productId;
    }
    
    if (item.product && item.product.productId !== undefined && item.product.productId !== null) {
      return item.product.productId;
    }
    
    console.error('Could not determine product ID from cart item:', item);
    throw new Error('Invalid cart item: missing product ID');
  }

  clearCart(): void {
    this.showConfirmationDialog('Clear Cart', 'Are you sure you want to remove all items from your cart?', () => {
      this.loading = true;
      
      this.cartService.clearCart().subscribe({
        next: () => {
          console.log('Cart cleared successfully');
          this.loadCart();
          this.successMessage = 'Cart cleared successfully';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          this.error = 'Failed to clear cart. Please try again.';
          setTimeout(() => this.error = '', 3000);
          this.loading = false;
        }
      });
    });
  }

checkout(): void {
  if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
    this.error = 'Your cart is empty';
    setTimeout(() => this.error = '', 3000);
    return;
  }
  this.router.navigate(['/customer/checkout']);
}

  continueShopping(): void {
    this.router.navigate(['/customer/dashboard']);
  }

  calculateSubtotal(): number {
    if (!this.cart || !this.cart.items) {
      return 0;
    }
    
    return this.cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  getSubtotal(): string {
    return this.calculateSubtotal().toFixed(2);
  }

  getTotal(): string {
    return this.calculateSubtotal().toFixed(2);
  }

  getProductImagePath(item: CartItem): string {
    if (!item.product) return this.imageService.getDefaultImageUrl();

    // If product has an imagePath, make sure it uses .png extension
    if (item.product.imagePath) {
      if (!item.product.imagePath.toLowerCase().endsWith('.png')) {
        const fixedPath = item.product.imagePath.replace(/\.[^.]+$/, '.png');
        return this.imageService.getSafeUrl(fixedPath);
      }
      return this.imageService.getSafeUrl(item.product.imagePath);
    }

    // Fallback to safe product image URL using category and name
    return this.imageService.getSafeProductImageUrl(
      item.product.category || '',
      item.product.name || ''
    );
  }

  showConfirmationDialog(title: string, message: string, action: () => void): void {
    this.confirmationTitle = title;
    this.confirmationMessage = message;
    this.pendingAction = action;
    this.showConfirmation = true;
  }

  confirmAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.closeConfirmationDialog();
  }

  cancelConfirmation(): void {
    this.closeConfirmationDialog();
  }

  closeConfirmationDialog(): void {
    this.showConfirmation = false;
    this.confirmationTitle = '';
    this.confirmationMessage = '';
    this.pendingAction = null;
  }

  getCartItemCount(): number {
    if (!this.cart || !this.cart.items) {
      return 0;
    }
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 