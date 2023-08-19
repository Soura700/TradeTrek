import React from "react";

const Cart = () => {
  return (
    <div class="liton__shoping-cart-area mb-120">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="shoping-cart-inner">
              <div class="shoping-cart-table table-responsive">
                <table class="table">
                  <tbody id="cartproducts">
                    <tr class="cart-coupon-row">
                      <td colspan="6">
                        <div class="cart-coupon">
                          <input
                            type="text"
                            name="cart-coupon"
                            placeholder="Coupon code"
                          />
                          <button
                            type="submit"
                            class="btn theme-btn-2 btn-effect-2"
                          >
                            Apply Coupon
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="submit"
                          class="btn theme-btn-2 btn-effect-2-- disabled"
                        >
                          Update Cart
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="shoping-cart-total mt-50" id="cart-table">
                <h4>Cart Totals</h4>
                <table class="table">
                  <tbody>
                    <tr>
                      <td>Cart Subtotal</td>
                      <td>$618.00</td>
                    </tr>
                    <tr>
                      <td>Shipping and Handing</td>
                      <td>$15.00</td>
                    </tr>
                    <tr>
                      <td>Vat</td>
                      <td>$00.00</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Order Total</strong>
                      </td>
                      <td>
                        <strong>$633.00</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="btn-wrapper text-right">
                  <a href="checkout.html" class="theme-btn-1 btn btn-effect-1">
                    Proceed to checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
