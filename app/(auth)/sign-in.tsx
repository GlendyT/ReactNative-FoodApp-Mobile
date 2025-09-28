import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import LoginSuccess from "@/components/LoginSuccess";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const { fetchAuthenticatedUser } = useAuthStore();

  const submit = async () => {
    const { email, password } = form;
    if (!email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await signIn({
        email,
        password,
      });
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      {showSuccess ? (
        <LoginSuccess onGoHome={() => {
          fetchAuthenticatedUser();
          router.replace("/(tabs)");
        }} />
      ) : (
        <>
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don&apos;t have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
        </>
      )}
    </View>
  );
};

export default SignIn;
