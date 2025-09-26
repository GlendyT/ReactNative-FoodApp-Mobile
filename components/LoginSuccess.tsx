import CustomButton from "@/components/CustomButton";
import React from "react";
import { Text, View } from "react-native";

interface LoginSuccessProps {
  onGoHome: () => void;
}

const LoginSuccess = ({ onGoHome }: LoginSuccessProps) => {
  return (
    <View className="justify-center items-center py-10">
      <View className="bg-green-100 p-4 rounded-full mb-6">
        <Text className="text-3xl text-green-600">✓</Text>
      </View>
      <Text className="text-xl font-quicksand-bold text-center mb-4">
        Login Successful!
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        Welcome back! You have successfully logged in.
      </Text>
      <CustomButton title="Go to Homepage" onPress={onGoHome} />
    </View>
  );
};

export default LoginSuccess;
