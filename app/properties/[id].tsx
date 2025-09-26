import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getMenuItemDetails,
  appwriteConfig,
  getCategories,
  getCustomizationDetails,
} from "@/lib/appwrite";
import { MenuItem, Category, CartCustomization } from "@/type";
import { useCartStore } from "@/store/cart.store";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { images } from "@/constants";
import CustomizationCard from "@/components/CustomizationCard";

const Titles = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <View className=" ">
    <Text className="text-gray-100 pl-1.5 text-lg font-quicksand-semibold">
      {title}
    </Text>
    <Text className="text-xl"> {subtitle} </Text>
  </View>
);

const MenuDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menu, setMenu] = useState<MenuItem | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [customizations, setCustomizations] = useState<{
    sides: any[];
    toppings: any[];
  }>({ sides: [], toppings: [] });
  const [selectedCustomizations, setSelectedCustomizations] = useState<any[]>(
    []
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  const toggleCustomization = (customization: any) => {
    setSelectedCustomizations((prev) => {
      const exists = prev.find((item) => item.$id === customization.$id);
      if (exists) {
        return prev.filter((item) => item.$id !== customization.$id);
      } else {
        return [...prev, customization];
      }
    });
  };

  const getTotalPrice = () => {
    const basePrice = menu?.price || 0;
    const customizationsPrice = selectedCustomizations.reduce(
      (total, item) => total + item.price,
      0
    );
    return basePrice + customizationsPrice;
  };

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const [menuData, categories, customizationsData] = await Promise.all([
          getMenuItemDetails(id!),
          getCategories(),
          getCustomizationDetails(),
        ]);
        const menu = menuData as unknown as MenuItem;
        setMenu(menu);
        setCustomizations(customizationsData);

        const category = (categories as unknown as Category[]).find(
          (cat) => cat.$id === menu.categories
        );
        setCategoryName(category?.name || "");
      } catch (error) {
        console.error("Error fetching menu details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMenuDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!menu) {
    return (
      <SafeAreaView className="bg-white h-full flex-center">
        <Text>Menu not found</Text>
      </SafeAreaView>
    );
  }

  const imageUrl = `${menu.image_url}?project=${appwriteConfig.projectId}`;

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        className="px-7 pt-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="custom-header">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Image
            source={images.search}
            className="size-5"
            resizeMode="contain"
          />
        </View>
        <View className="flex relative h-64">
          <View className="flex-col gap-6 pr-52">
            <View className="flex gap-2">
              <Text className="text-3xl w-96 font-quicksand-bold">
                {menu.name}
              </Text>
              <Text className="text-xl text-gray-400 font-quicksand-medium">
                {categoryName}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const starIndex = i + 1;
                if (starIndex <= Math.floor(menu.rating)) {
                  return (
                    <AntDesign key={i} name="star" size={20} color="orange" />
                  );
                } else if (starIndex - 0.5 <= menu.rating) {
                  return (
                    <AntDesign key={i} name="star" size={20} color="orange" />
                  );
                } else {
                  return (
                    <AntDesign key={i} name="star" size={20} color="#ccc" />
                  );
                }
              })}
              <Text className="text-lg text-gray-100 font-quicksand-bold ml-2">
                {menu.rating}/5
              </Text>
            </View>
            <Text className="text-2xl text-primary font-quicksand-bold">
              $
              <Text className="text-black font-quicksand-bold">
                {getTotalPrice().toFixed(2)}
              </Text>
            </Text>

            <View className="flex flex-row gap-4">
              <Titles title="Calories" subtitle={`${menu.calories}Cal`} />
              <Titles title="Protein" subtitle={`${menu.protein}g`} />
            </View>
            <Titles title="Bun Type" subtitle="Whole Wheat" />
          </View>
          <View className="absolute -right-32 top-0 w-96 h-96">
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full rounded-lg"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
              resizeMode="cover"
            />
          </View>
        </View>
        <View className="flex flex-row items-center justify-between mt-36 mb-3 bg-orange-100 p-4 rounded-full">
          <View className="flex-row items-center gap-2">
            <FontAwesome name="dollar" size={14} color="orange" />
            <Text className="text-lg pr-2">Free Delivery</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="clock" size={24} color="orange" />
            <Text>20 - 30 mins</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <AntDesign name="star" size={20} color="orange" />
            <Text>{menu.rating}</Text>
          </View>
        </View>
        <View className="mt-2 mb-6">
          <Text className="text-lg text-justify text-gray-100 ">
            {menu.description}
          </Text>
        </View>

        <Text className="text-xl font-quicksand-bold mb-2">Toppings </Text>
        <FlatList
          data={customizations.toppings}
          keyExtractor={(item) => item.$id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-2 pb-3"
          renderItem={({ item }) => (
            <View>
              <CustomizationCard item={item as CartCustomization} />
            </View>
          )}
        />

        <Text className="text-xl font-quicksand-bold mb-2">Sides </Text>
        <FlatList
          data={customizations.sides}
          keyExtractor={(item) => item.$id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-2 pb-3"
          renderItem={({ item }) => (
            <View>
              <CustomizationCard item={item as CartCustomization} />
            </View>
          )}
        />
      </ScrollView>
      <View className="absolute bottom-12 mx-6 left-0 right-0 bg-white p-4 shadow-lg rounded-3xl">
        <View className="flex-row items-center justify-between ">
          <View className="flex-row items-center rounded-full">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <AntDesign
                name="minus"
                size={24}
                color="orange"
                className="font-quicksand-bold "
              />
            </TouchableOpacity>
            <Text className="mx-4 text-2xl font-quicksand-bold">
              {quantity}
            </Text>
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons
                name="add"
                size={24}
                color="orange"
                className="font-quicksand-bold "
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-orange-500 flex-row gap-2  p-4 rounded-full"
            onPress={() => {
              if (menu) {
                for (let i = 0; i < quantity; i++) {
                  addItem({
                    id: menu.$id,
                    name: menu.name,
                    price: menu.price,
                    image: menu.image_url,
                    customizations: selectedCustomizations.map((item) => ({
                      id: item.$id,
                      name: item.name,
                      price: item.price,
                    })),
                  });
                }
                router.back();
              }
            }}
          >
            <Image
              source={images.bag}
              className="size-6 mb-1"
              resizeMode="contain"
              tintColor="white"
            />

            <Text className="text-white text-center text-lg font-quicksand-bold">
              Add to Cart ${(getTotalPrice() * quantity).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MenuDetail;
