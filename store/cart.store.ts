import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";

function areCustomizationsEqual(
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
): boolean {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

    return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (item) => {
        const customizations = item.customizations ?? [];

        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
        );

        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [...get().items, { ...item, quantity: 1, customizations }],
            });
        }
    },

    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
        });
    },

    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((total, item) => {
            const base = item.price;
            const customPrice =
                item.customizations?.reduce(
                    (s: number, c: CartCustomization) => s + c.price,
                    0
                ) ?? 0;
            return total + item.quantity * (base + customPrice);
        }, 0),

    // Verificar si el envío es gratis (total mayor a 300)
    isFreeShipping: () => {
        const total = get().getTotalPrice();
        return total > 200;
    },

    // Calcular el total de toppings/sides en el carrito
    getTotalCustomizations: () =>
        get().items.reduce((total, item) => {
            const customizations = item.customizations?.length ?? 0;
            return total + (customizations * item.quantity);
        }, 0),

    // Verificar si aplica descuento por toppings (más de 5 toppings/sides)
    hasCustomizationDiscount: () => {
        const totalCustomizations = get().getTotalCustomizations();
        return totalCustomizations > 5;
    },

    // Calcular el precio final con descuentos aplicados
    getFinalPrice: () => {
        let total = get().getTotalPrice();
        
        // Aplicar descuento del 5% si hay más de 5 toppings/sides
        if (get().hasCustomizationDiscount()) {
            total = total * 0.95; // 5% de descuento
        }
        
        return total;
    },

    // Obtener información completa de pricing
    getPricingInfo: () => {
        const subtotal = get().getTotalPrice();
        const hasDiscount = get().hasCustomizationDiscount();
        const discount = hasDiscount ? subtotal * 0.05 : 0;
        const finalPrice = get().getFinalPrice();
        const freeShipping = get().isFreeShipping();
        const totalCustomizations = get().getTotalCustomizations();

        return {
            subtotal,
            discount,
            finalPrice,
            freeShipping,
            hasDiscount,
            totalCustomizations,
            shippingCost: freeShipping ? 0 : 50, // Asumiendo costo de envío de 50
        };
    },
}));