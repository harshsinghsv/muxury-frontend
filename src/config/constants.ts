export const APP_CONFIG = {
    name: 'Muxury',
    currency: {
        symbol: '₹',
        code: 'INR',
        locale: 'en-IN'
    },
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    },
    ui: {
        touchTargetMinSize: 44,
        mobileBreakpoint: 768,
        animationDuration: 200,
    }
};

export const COPY = {
    home: {
        hero: {
            title: "Discover Your\nModern Clothing",
            greeting: "Hi!",
            guestGreeting: "Hi there!"
        },
        promo: {
            discount: "75% Off",
            description: "On everything today",
            validUntil: "Only valid until 24 June 2024",
            cta: "Get Now"
        },
        sections: {
            categories: "Shop by Category",
            popular: "Most Popular",
            seeAll: "See All"
        }
    },
    shop: {
        title: "Category",
        allProducts: "All Products",
        searchPlaceholder: "Search...",
        desktopSearchPlaceholder: "Search collection...",
        categories: ["All", "Outerwear", "Accessories", "Men's Fashion", "Women's Fashion", "Dresses", "Suits"],
        emptyState: {
            title: "No items found",
            description: "Try adjusting your filters.",
            cta: "View All Collection"
        },
        sortOptions: ['Recommended', 'Newest', 'Lowest Price', 'Highest Price'],
        filters: {
            title: "Filter",
            sortBy: "Sort By",
            priceRange: "Price Range",
            reset: "Reset",
            apply: "Apply"
        }
    },
    productDetails: {
        title: "Detail",
        notFound: {
            title: "Product Not Found",
            description: "This item may be out of stock or removed.",
            cta: "Back to Shop"
        },
        breadcrumbs: {
            home: "Shop"
        },
        labels: {
            brand: "Leziam Fashion",
            reviews: "Reviews",
            size: "Size",
            color: "Color",
            description: "Description",
            totalPrice: "Total Price"
        },
        actions: {
            addToCart: "Add to cart",
            adding: "Adding..."
        },
        toast: {
            selectSize: "Please select a size",
            addedToCart: "Added to cart"
        }
    },
    cart: {
        title: "My Cart",
        itemsSuffix: "items",
        emptyState: {
            title: "Your cart is empty",
            description: "Looks like you haven't added anything yet. Discover our latest collection.",
            cta: "Continue Shopping"
        },
        summary: {
            title: "Order Summary",
            subtotal: "Subtotal",
            shipping: "Shipping",
            shippingCalculated: "Calculated at checkout",
            totalTax: "Total (Inc. Tax)",
            checkoutCta: "Proceed to Checkout"
        }
    },
    checkout: {
        title: "Checkout",
        backToCart: "Back to Cart",
        shippingAddress: {
            title: "Shipping Address",
            edit: "Edit",
            defaultLabel: "Default"
        },
        paymentMethod: {
            title: "Payment Method",
            change: "Change"
        },
        summary: {
            title: "Order Summary",
            subtotal: "Subtotal",
            delivery: "Delivery",
            totalPayment: "Total Payment",
            placeOrder: "Place Order",
            processing: "Processing..."
        },
        success: {
            title: "Order Confirmed",
            description: "Your beautifully crafted order will be on its way to you shortly. A confirmation email has been sent.",
            orderNumber: "Order Number",
            cta: "Back to Home"
        }
    },
    profile: {
        title: "My Account",
        signOut: "Sign Out",
        sections: {
            personalInfo: "Personal Info",
            general: "General"
        },
        orders: {
            title: "My Orders",
            emptyState: {
                title: "No orders yet",
                description: "When you place an order, it will appear here."
            },
            placedOn: "Placed on",
            item: "Item",
            items: "Items"
        },
        wishlist: {
            title: "My Wishlist",
            emptyState: {
                title: "Wishlist is empty",
                description: "Save your favorite pieces to view them later."
            }
        },
        menu: {
            profile: "Your Profile",
            changePassword: "Change Password",
            address: "Shipping Address",
            payment: "Payment Methods",
            notification: "Notification",
            settings: "Settings"
        }
    },
    auth: {
        login: {
            title: "Hi, Welcome Back!",
            emailLabel: "Email",
            passwordLabel: "Password",
            emailPlaceholder: "example@gmail.com",
            passwordHelp: "At least 6 characters",
            passwordPlaceholder: "Enter your password",
            rememberMe: "Remember Me",
            forgotPassword: "Forgot Password",
            submit: "Login",
            loading: "Logging in...",
            noAccount: "Don't have an account?",
            signUpLink: "Sign Up"
        },
        register: {
            title: "Create Account",
            nameLabel: "Full Name",
            namePlaceholder: "Harsh",
            emailLabel: "Email",
            emailPlaceholder: "example@gmail.com",
            passwordLabel: "Password",
            passwordHelp: "At least 6 characters",
            passwordPlaceholder: "Create a password",
            submit: "Create an account",
            loading: "Creating account...",
            terms: "By signing up you agree to our",
            termsLink: "Terms",
            and: "and",
            conditionsLink: "Conditions of Use",
            hasAccount: "Already have an account?",
            signInLink: "Sign In"
        }
    }
};
