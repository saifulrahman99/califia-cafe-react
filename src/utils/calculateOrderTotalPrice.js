export function calculateOrderTotalPrice(cart) {
    return cart.reduce((total, menu) => {
        // Hitung harga menu utama (menu price * quantity)
        const menuTotal = menu.price * menu.qty;

        // Hitung harga semua topping dalam menu (topping price * quantity)
        const toppingTotal = menu.toppings.reduce((sum, topping) => {
            return sum + topping.price * topping.qty;
        }, 0);

        // Tambahkan harga menu + harga topping ke total keseluruhan
        return total + menuTotal + toppingTotal;
    }, 0);
}