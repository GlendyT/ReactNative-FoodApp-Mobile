import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import { CustomHeaderProps } from "@/type";
import useAppwrite from "@/lib/useAppwrite";
import { getCurrentUser, updateUserLocation } from "@/lib/appwrite";
import home from "@/assets/icons/home.png";

const CustomHeader = ({ title }: CustomHeaderProps) => {
  const router = useRouter();
  const { data, refetch } = useAppwrite({ fn: getCurrentUser });
  console.log("User data:", data);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determinar si la ubicación actual es Home (dirección original)
  const isHomeLocation = data?.home === "123 Main St, Queens, NY 10001";

  const handleChangeLocation = async () => {
    if (!data?.$id || !data?.home || !data?.work) return;

    try {
      setIsLoading(true);

      await updateUserLocation(data.$id, data.home, data.work, data.home);

      await refetch();
    } catch (error) {
      console.error("Error changing location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <View className="custom-header">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={images.arrowBack}
            className="size-5"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {title && <Text className="base-semibold text-dark-100">{title}</Text>}
        <Image source={images.search} className="size-5" resizeMode="contain" />
      </View>
      <View className="flex-row justify-between pb-4">
        <View className="flex flex-col items-start justify-start">
          <Text className="text-primary font-quicksand-semibold">
            DELIVERY LOCATION
          </Text>
          <Text className="text-black font-quicksand-semibold">
            {isHomeLocation ? "Home" : "Work"}
          </Text>
        </View>

        <TouchableOpacity
          className={`bg-primary/5 px-3 py-2 rounded-full border border-primary ${isLoading ? "opacity-50" : ""}`}
          onPress={handleChangeLocation}
          disabled={isLoading}
        >
          <Text className="text-center text-primary">
            {isLoading ? "Changing..." : "Change Location"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;
