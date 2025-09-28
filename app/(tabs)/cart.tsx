import CustomHeader from "@/components/CustomHeader";
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps } from "@/type";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cn from "clsx";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
import { Entypo, EvilIcons, Feather } from "@expo/vector-icons";
import { images } from "@/constants";

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {" "}
      {label}{" "}
    </Text>
    <Text className={cn("paragraph-medium text-gray-200", valueStyle)}>
      {" "}
      {value}{" "}
    </Text>
  </View>
);

const Cart = () => {
  const items = useCartStore((state) => state.items);

  // Calcular valores directamente desde items (será reactivo)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => {
    const base = item.price;
    const customPrice =
      item.customizations?.reduce((s: number, c: any) => s + c.price, 0) ?? 0;
    return total + item.quantity * (base + customPrice);
  }, 0);

  const totalCustomizations = items.reduce((total, item) => {
    const customizations = item.customizations?.length ?? 0;
    return total + customizations * item.quantity;
  }, 0);

  const hasDiscount = totalCustomizations > 5;
  const discount = hasDiscount ? subtotal * 0.05 : 0;
  const finalPrice = subtotal - discount;
  const freeShipping = subtotal > 200;
  const shippingCost = freeShipping ? 0 : 10;

  const pricingInfo = {
    subtotal,
    discount,
    finalPrice,
    freeShipping,
    hasDiscount,
    totalCustomizations,
    shippingCost,
  };

  return (
    <SafeAreaView className="bg-orange-100/5 h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => {
          // Create unique key by combining item id with customizations
          const customizationIds =
            item.customizations
              ?.map((c: any) => c.id)
              .sort()
              .join("-") || "no-custom";
          return `${item.id}-${customizationIds}`;
        }}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View className="flex-center mt-8 gap-3">
            <Image
              source={images.emptyState}
              className=""
              resizeMode="contain"
            />

            <Text className="text-2xl font-quicksand-semibold ">
              Your Cart is Empty
            </Text>
            <Text className="text-md text-gray-400">
              Try adding some items to your cart
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5 b">
              <View className="mt-6  p-5 rounded-2xl font-quicksand-bold bg-white-100">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>
                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`$${pricingInfo.subtotal.toFixed(2)} USD`}
                />

                {/* Mostrar costo de envío o envío gratis */}
                <PaymentInfoStripe
                  label="Delivery Fee"
                  value={
                    pricingInfo.freeShipping
                      ? "FREE (Order $200+)"
                      : `$${pricingInfo.shippingCost.toFixed(2)} USD`
                  }
                  valueStyle={
                    pricingInfo.freeShipping ? "!text-success" : undefined
                  }
                />

                {/* Mostrar descuento - siempre visible */}
                <PaymentInfoStripe
                  label={
                    pricingInfo.hasDiscount
                      ? `Discount (5% - ${pricingInfo.totalCustomizations} toppings)`
                      : "Discount"
                  }
                  value={`- $${pricingInfo.discount.toFixed(2)} USD`}
                  valueStyle={
                    pricingInfo.hasDiscount ? "!text-success" : "!text-gray-300"
                  }
                />

                <View className="border-t border-gray-300 my-2" />
                <PaymentInfoStripe
                  label="Total"
                  value={`$${(pricingInfo.finalPrice + (pricingInfo.freeShipping ? 0 : pricingInfo.shippingCost)).toFixed(2)} USD`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>
              <CustomButton title="Order Now" />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Cart;
