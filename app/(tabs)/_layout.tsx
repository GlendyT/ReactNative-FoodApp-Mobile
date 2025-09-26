import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { TabBarIconProps } from "@/type";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import cn from "clsx";
import { useCartStore } from "@/store/cart.store";

const TabBarIcon = ({ focused, icon, title, badge }: TabBarIconProps & { badge?: number }) => {

  return (
    <View className="tab-icon relative">
      <View className="relative">
        <Image
          source={icon}
          className="size-7"
          resizeMode="contain"
          tintColor={focused ? "#FF8C00" : "#5d5f6d"}
        />
        {badge && badge > 0 && (
          <View className="absolute -top-2 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full">
            <Text className="text-xs font-bold text-white">
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </View>
      <Text
        className={cn(
          "text-sm font-bold",
          focused ? "text-primary" : "text-dark-200"
        )}
      >
        {title}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  
  if (!isAuthenticated) return <Redirect href="/sign-in" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 80,
          position: "absolute",
          bottom: 40,
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={images.bag} 
              title="Cart"
              badge={totalItems}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={images.person}
              title="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}
