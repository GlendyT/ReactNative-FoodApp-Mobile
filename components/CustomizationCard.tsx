import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { CartCustomization } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";
import { MaterialIcons } from "@expo/vector-icons";

const CustomizationCard = ({
  item: { $id, name, image_url, price },
  onToggle,
  isSelected = false,
}: {
  item: CartCustomization & { $id: string };
  onToggle: (item: CartCustomization) => void;
  isSelected?: boolean;
}) => {
  const imageUrl = image_url ? `${image_url}?project=${appwriteConfig.menusCollectionId}` : '';

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
          source={{ uri: imageUrl || 'https://via.placeholder.com/112' }}
          className="size-28  "
          resizeMode="contain"
        />
      </View>

      <View className="bg-black/90 flex-row items-center justify-between px-2 pt-6 pb-2 rounded-xl mt-24 ">
        <Text className="text-white text-xs w-16">{name} </Text>

        <TouchableOpacity onPress={() => onToggle({ 
          id: $id,
          name, 
          price, 
          type: 'customization'
        })}>
          <MaterialIcons 
            name={isSelected ? "remove-circle" : "add-circle"} 
            size={24} 
            color={isSelected ? "orange" : "red"} 
          />
        </TouchableOpacity>
      </View>
      <Text> ${price} </Text>
    </View>
  );
};

export default CustomizationCard;
