import { useCartStore } from "@/store/cart.store";
import { CartItemType } from "@/type";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { images } from "@/constants";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();
  const imageUrl = (item as any).image || item.image_url;

  return (
    <View
      className="cart-item"
      style={{
        elevation: 2,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      }}
    >
      <View className="flex flex-row items-center gap-x-3">
        <View className="cart-item__image">
          <Image
            source={{ uri: imageUrl || "https://via.placeholder.com/112" }}
            className="size-4/5 rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View>
          <Text className="base-bold text-dark-100">{item.name}</Text>
          <Text className="paragraph-bold text-primary mt-1">
            ${item.price}
          </Text>

          <View className="flex flex-row items-center gap-x-4 mt-2">
            <TouchableOpacity
              onPress={() => decreaseQty(item.id, item.customizations!)}
              className="cart-item__actions w-8 h-8"
            >
              <AntDesign
                name="minus"
                size={24}
                color="orange"
                className="font-quicksand-bold "
              />
            </TouchableOpacity>

            <Text className="base-bold font-extrabold text-dark-100">
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() => increaseQty(item.id, item.customizations!)}
              className="cart-item__actions w-8 h-8"
            >
              <Ionicons
                name="add"
                size={24}
                color="orange"
                className="font-quicksand-bold "
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => removeItem(item.id, item.customizations!)}
        className="flex-center"
      >
        <Image source={images.trash} className="size-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;
