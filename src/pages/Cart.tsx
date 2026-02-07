import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowLeft, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 100;

const Cart = () => {
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity, subtotal, tax, shipping, total } = useCart();
    const [couponCode, setCouponCode] = useState("");

    const isEmpty = items.length === 0;
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
        if (newQuantity > 0) {
            updateQuantity(productId, size, newQuantity);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <Header />

            <main className="container mx-auto px-4 lg:px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

                {isEmpty ? (
                    <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
                        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some products to get started</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFB700] hover:bg-[#FFA500] text-gray-900 font-semibold rounded-sm transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-10 gap-6">
                        {/* Cart Items - 70% */}
                        <div className="lg:col-span-7">
                            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                                    <div className="col-span-6">PRODUCT</div>
                                    <div className="col-span-2 text-center">PRICE</div>
                                    <div className="col-span-2 text-center">QUANTITY</div>
                                    <div className="col-span-2 text-right">SUBTOTAL</div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <div
                                            key={`${item.product.id}-${item.selectedSize}`}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4"
                                        >
                                            {/* Product Info */}
                                            <div className="md:col-span-6 flex gap-4">
                                                <Link
                                                    to={`/product/${item.product.id}`}
                                                    className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden"
                                                >
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        to={`/product/${item.product.id}`}
                                                        className="font-medium text-gray-900 hover:text-[#FFB700] line-clamp-2"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Size: <span className="font-medium">{item.selectedSize}</span>
                                                    </p>
                                                    <button
                                                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                                                        className="text-sm text-red-600 hover:underline mt-2 flex items-center gap-1"
                                                    >
                                                        <Trash2 size={14} />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="md:col-span-2 flex md:justify-center items-center">
                                                <span className="md:hidden text-sm text-gray-600 mr-2">Price:</span>
                                                <span className="font-semibold text-gray-900">${item.product.price}</span>
                                            </div>

                                            {/* Quantity */}
                                            <div className="md:col-span-2 flex md:justify-center items-center">
                                                <span className="md:hidden text-sm text-gray-600 mr-2">Quantity:</span>
                                                <div className="flex items-center border border-gray-300 rounded-sm">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.selectedSize, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="md:col-span-2 flex md:justify-end items-center">
                                                <span className="md:hidden text-sm text-gray-600 mr-2">Subtotal:</span>
                                                <span className="font-bold text-gray-900">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Continue Shopping */}
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 text-[#FFB700] hover:underline font-medium mt-4"
                            >
                                <ArrowLeft size={16} />
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Order Summary - 30% */}
                        <div className="lg:col-span-3">
                            <div className="bg-white border border-gray-200 rounded-sm p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                                {/* Coupon */}
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Have a coupon?
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#FFB700]"
                                        />
                                        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Free Shipping Progress */}
                                {amountToFreeShipping > 0 && (
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                                        <p className="text-sm text-blue-900 mb-2">
                                            Add <span className="font-bold">${amountToFreeShipping.toFixed(2)}</span> more for FREE shipping!
                                        </p>
                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-gray-900">
                                            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between mb-6">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full py-3 bg-[#FFB700] hover:bg-[#FFA500] text-gray-900 font-bold rounded-sm transition-colors mb-3"
                                >
                                    Proceed to Checkout
                                </button>

                                {/* Payment Methods */}
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-2">We Accept</p>
                                    <div className="flex justify-center gap-2 flex-wrap">
                                        {["Visa", "Mastercard", "PayPal", "Amex"].map((method) => (
                                            <span key={method} className="px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
