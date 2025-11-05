import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 88,
            paddingBottom: 34,
            paddingTop: 8,
            paddingHorizontal: 16,
          },
          android: {
            height: 80,
            paddingBottom: 6,
            paddingTop: 6,
            paddingHorizontal: 10,
            elevation: 8,
          },
          default: {
            height: 70,
            paddingBottom: 6,
            paddingTop: 6,
            paddingHorizontal: 16,
          },
        }),
        tabBarItemStyle: {
          paddingVertical: 4,
          marginHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          textTransform: 'capitalize',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/home.png")}
              style={{ 
                width: 30, 
                height: 30,
                // tintColor: focused ? Colors[colorScheme ?? "light"].tint : Colors[colorScheme ?? "light"].tabIconDefault,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="claims"
        options={{
          title: "Claims",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/claim (1).png")}
              style={{ 
                width: 38, 
                height: 30,
                
                // tintColor: focused ? Colors[colorScheme ?? "light"].tint : Colors[colorScheme ?? "light"].tabIconDefault,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="policy"
        options={{
          title: "Policy",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/job (1).png")}
              style={{ 
                width: 30, 
                height: 30,
                // tintColor: focused ? Colors[colorScheme ?? "light"].tint : Colors[colorScheme ?? "light"].tabIconDefault,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

       <Tabs.Screen
        name="career"
        options={{
          title: "Career",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/job (1).png")}
              style={{ 
                width: 30, 
                height: 30,
                // tintColor: focused ? Colors[colorScheme ?? "light"].tint : Colors[colorScheme ?? "light"].tabIconDefault,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          title: "Support",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/help-desk.png")}
              style={{ 
                width: 30, 
                height: 30,
                // tintColor: focused ? Colors[colorScheme ?? "light"].tint : Colors[colorScheme ?? "light"].tabIconDefault,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("../../assets/images/profile.png")}
              style={{ 
                width: 24, 
                height: 24,
                tintColor: focused ? Colors[colorScheme ?? "light"].tint : Colors[colorScheme ?? "light"].tabIconDefault,
              }}
              resizeMode="contain"
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}