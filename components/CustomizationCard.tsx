import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { CartCustomization } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { MaterialIcons } from "@expo/vector-icons";

const CustomizationCard = ({
  item: { id, name, image_url, price, type },
}: {
  item: CartCustomization;
}) => {
  const imageUrl = `${image_url}?project=${appwriteConfig.menusCollectionId}`;
  return (
    <View className="flex w-32 px-1 h-full">
      <View
        className="bg-white-100 absolute left-1.5 z-10  rounded-xl h-28 w-28 items-center justify-center "
        style={
          Platform.OS === "android"
            ? { elevation: 10, shadowColor: "#898989" }
            : {}
        }
      >
        <Image
          source={{ uri: imageUrl }}
          className="size-28  "
          resizeMode="contain"
        />
      </View>

      <View className="bg-black/90 flex-row items-center justify-between px-2 pt-6 pb-2 rounded-xl mt-24 ">
        <Text className="text-white text-xs w-16">{name} </Text>

        <TouchableOpacity>
          <MaterialIcons name="add-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text> ${price} </Text>
    </View>
  );
};

export default CustomizationCard;
