import { images } from "@/constants";
import { getCurrentUser } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  Feather,
  Fontisto,
  EvilIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

interface SettingsItemProps {
  icon: ImageSourcePropType | React.JSX.Element;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  textStyle?: string;
  className?: string;
}

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  textStyle,
  className,
}: SettingsItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3 "
  >
    <View
      className={`flex flex-row items-center justify-center   gap-4 ${className} `}
    >
      <View className="size-10 w-14 h-14 bg-orange-100 rounded-full  flex items-center justify-center">
        {React.isValidElement(icon) ? (
          icon
        ) : (
          <Image source={icon as ImageSourcePropType} className="size-4" />
        )}
      </View>
      <View className="flex flex-col">
        <Text
          className={`text-sm font-rubik-medium text-gray-100  ${textStyle}`}
        >
          {subtitle}
        </Text>
        <Text
          className={`text-xl font-rubik-medium text-black-300   ${textStyle}`}
        >
          {title}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const Profile = () => {
  const { data } = useAppwrite({ fn: getCurrentUser });

  const handleLogout = async () => {};
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName=" px-7 pt-5"
      >
        <View className="custom-header">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={images.arrowBack}
              className="size-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-xl font-quicksand-bold">Profile</Text>
          <Image
            source={images.search}
            className="size-5"
            resizeMode="contain"
          />
        </View>
        <View className="flex-row justify-center flex">
          <View className="flex flex-col items-center relative ">
            <Image
              source={{ uri: data?.avatar }}
              className="size-24 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-10 right-2">
              <Feather
                name="edit-2"
                size={18}
                color="white"
                className="bg-white-200 rounded-full p-1 border-white-100 border-2"
              />
            </TouchableOpacity>
            <Text className="text-xl capitalize font-quicksand-bold">
              {data?.name}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem
            icon={<Ionicons name="person-outline" size={24} color="orange" />}
            title={data?.name}
            subtitle="Full Name"
            textStyle="capitalize w-full"
          />
          <SettingsItem
            icon={<Fontisto name="email" size={24} color="orange" />}
            title={data?.email}
            subtitle="Email"
          />
          <SettingsItem
            icon={<Feather name="phone" size={24} color="orange" />}
            title={data?.phone || "Not Available"}
            subtitle="Phone Number"
          />
          <SettingsItem
            icon={<EvilIcons name="location" size={24} color="orange" />}
            title={data?.address || "Not Available"}
            subtitle="Address 1 - (Home)"
          />
          <SettingsItem
            icon={<EvilIcons name="location" size={24} color="orange" />}
            title={data?.address || "Not Available"}
            subtitle="Address 2 - (Work)"
          />
        </View>

        <View className="flex flex-col gap-4 mt-10">
          <TouchableOpacity
            className="flex flex-row gap-4 w-full items-center justify-center text-primary bg-orange-100 py-4 border-2 border-primary rounded-full"
            onPress={handleLogout}
          >
            <Text className="text-orange-500 mr-2">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row gap-4 w-full items-center justify-center text-red-500 bg-red-100 py-3 border-2 border-red-400 rounded-full"
            onPress={handleLogout}
          >
            <SimpleLineIcons name="logout" size={24} color="red" />
            <Text className="text-red-500 mr-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

/*      */
