import { Image } from "expo-image";
import { Platform, StyleSheet, View, TouchableOpacity } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#2565F0", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      {/* Welcome Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Consta!</ThemedText>
        <HelloWave />
        <ThemedText style={styles.subtitle}>
          Create or join a consta to get started
        </ThemedText>
      </ThemedView>

      {/* Action Buttons Section */}
      <ThemedView style={styles.actionsContainer}>
        <View style={styles.buttonsRow}>
          {/* Create Consta Button */}
          <TouchableOpacity style={styles.primaryButton}>
            <LinearGradient
              colors={["#2565F0", "#1a56db"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonIconContainer}>
                  <Ionicons name="add-circle" size={24} color="#fff" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <ThemedText style={styles.buttonPrimaryText}>
                    Create Consta
                  </ThemedText>
                  <ThemedText style={styles.buttonSecondaryText}>
                    Start a new project
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Join Consta Button */}
          <TouchableOpacity style={styles.secondaryButton}>
            <View style={styles.buttonContent}>
              <View
                style={[styles.buttonIconContainer, styles.joinIconContainer]}
              >
                <Ionicons name="people" size={24} color="#2565F0" />
              </View>
              <View style={styles.buttonTextContainer}>
                <ThemedText style={styles.buttonPrimaryTextAlt}>
                  Join Consta
                </ThemedText>
                <ThemedText style={styles.buttonSecondaryTextAlt}>
                  Enter an invite code
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Recent Activity Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Activity
        </ThemedText>
        <ThemedView style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="time-outline" size={20} color="#64748b" />
            </View>
            <View style={styles.activityContent}>
              <ThemedText style={styles.activityText}>
                No recent activity
              </ThemedText>
              <ThemedText style={styles.activitySubtext}>
                Your activity will appear here
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </ThemedView>

      {/* Getting Started Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Getting Started
        </ThemedText>

        <ThemedView style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <ThemedText style={styles.stepNumberText}>1</ThemedText>
          </View>
          <View style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">
              Create or join a consta
            </ThemedText>
            <ThemedText>
              Start by creating your own consta or joining an existing one using
              an invite code.
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <ThemedText style={styles.stepNumberText}>2</ThemedText>
          </View>
          <View style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">
              Add your team members
            </ThemedText>
            <ThemedText>
              Invite collaborators to work together on your projects and tasks.
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <ThemedText style={styles.stepNumberText}>3</ThemedText>
          </View>
          <View style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">Start collaborating</ThemedText>
            <ThemedText>
              Manage tasks, share files, and communicate with your team in one
              place.
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>

      {/* Explore Section */}
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Explore Features</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              title="Action"
              icon="cube"
              onPress={() => alert("Action pressed")}
            />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert("Share pressed")}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert("Delete pressed")}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Discover all the features available in Consta and how to make the most of them.`}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  buttonsRow: {
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 8,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2565F0",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    padding: 20,
    borderRadius: 16,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#DBEAFE",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  joinIconContainer: {
    backgroundColor: "#DBEAFE",
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  buttonSecondaryText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  buttonPrimaryTextAlt: {
    color: "#334155",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  buttonSecondaryTextAlt: {
    color: "#64748b",
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: "#334155",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: "#334155",
    marginBottom: 2,
  },
  activitySubtext: {
    color: "#64748b",
    fontSize: 14,
  },
  stepContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  stepNumberText: {
    color: "#2565F0",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
