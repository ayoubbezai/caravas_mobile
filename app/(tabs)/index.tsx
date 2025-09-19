import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
// import {Logo} from "@/assets/logo.svg";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [joinDigits, setJoinDigits] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // refs for inputs
  const inputsRef = useRef<(TextInput | null)[]>([]);

  // Generate a random 6-digit code
  const generateCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(newCode);
    setTimeLeft(600);
    setIsActive(true);

    // Fade in animation for code display
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Handle join with code
  const handleJoin = () => {
    const joinCode = joinDigits.join("");
    if (joinCode.length !== 6) {
      shakeInput();
      Alert.alert("Invalid Code", "Please enter a 6-digit code");
      return;
    }
    Alert.alert("Joining", `Joining Consta with code: ${joinCode}`);
    // router.push('/some-join-screen');
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          // Fade out animation for code display
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setCode(""));
          Alert.alert(
            "Code Expired",
            "The 6-digit code has expired. Please generate a new one."
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Shake animation for invalid input
  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle digit input
  const handleDigitChange = (text: string, index: number) => {
    const newDigits = [...joinDigits];
    newDigits[index] = text.replace(/[^0-9]/g, "").slice(-1); // only last digit
    setJoinDigits(newDigits);

    if (text && index < 5) {
      inputsRef.current[index + 1]?.focus();
    } else if (!text && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !joinDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isJoinReady = joinDigits.every((d) => d !== "");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#2565F0", dark: "#1D3D47" }}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.appTitle}>
              Consta
            </ThemedText>
            <ThemedText style={styles.appTagline}>
              Connect instantly with secure codes
            </ThemedText>
          </View>

          {/* Welcome Section */}
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.welcomeText}>
              Welcome to Consta!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Create or join a consta to get started
            </ThemedText>
          </ThemedView>

          {/* Action Buttons Section */}
          <ThemedView style={styles.actionsContainer}>
            <View style={styles.buttonsRow}>
              {/* Create Consta Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={generateCode}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#2565F0", "#1a56db"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <View style={styles.iconContainer}>
                      <ThemedText style={styles.buttonIcon}>+</ThemedText>
                    </View>
                    <View style={styles.buttonTextContainer}>
                      <ThemedText style={styles.buttonPrimaryText}>
                        Create Consta
                      </ThemedText>
                      <ThemedText style={styles.buttonSecondaryText}>
                        Generate a QR code with 6-digit code
                      </ThemedText>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Display generated code and timer */}
              {code ? (
                <Animated.View
                  style={[styles.codeContainer, { opacity: fadeAnim }]}
                >
                  <ThemedText style={styles.codeLabel}>
                    Your 6-digit code:
                  </ThemedText>
                  <ThemedText style={styles.codeText}>{code}</ThemedText>
                  <View style={styles.timerContainer}>
                    <ThemedText style={styles.timerText}>
                      Expires in: {formatTime()}
                    </ThemedText>
                  </View>
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: `${(timeLeft / 600) * 100}%` },
                      ]}
                    />
                  </View>
                </Animated.View>
              ) : null}

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>OR</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              {/* Join Consta Section */}
              <View style={styles.secondaryButton}>
                <View style={styles.buttonContent}>
                  <View style={styles.iconContainerAlt}>
                    <ThemedText style={styles.buttonIconAlt}>→</ThemedText>
                  </View>
                  <View style={styles.buttonTextContainer}>
                    <ThemedText style={styles.buttonPrimaryTextAlt}>
                      Join Consta
                    </ThemedText>
                    <ThemedText style={styles.buttonSecondaryTextAlt}>
                      Enter your 6-digit code
                    </ThemedText>
                  </View>
                </View>

                {/* 6-digit input */}
                <Animated.View
                  style={[
                    styles.digitsRow,
                    { transform: [{ translateX: shakeAnim }] },
                  ]}
                >
                  {joinDigits.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={(el) => (inputsRef.current[idx] = el)}
                      style={[styles.digitBox, digit && styles.digitBoxFilled]}
                      value={digit}
                      onChangeText={(text) => handleDigitChange(text, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      keyboardType="numeric"
                      maxLength={1}
                      returnKeyType="next"
                      selectTextOnFocus
                    />
                  ))}
                </Animated.View>

                {/* Join Button */}
                <TouchableOpacity
                  style={[
                    styles.joinButton,
                    isJoinReady
                      ? styles.joinButtonActive
                      : styles.joinButtonDisabled,
                  ]}
                  onPress={handleJoin}
                  disabled={!isJoinReady}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.joinButtonText}>
                    Join Consta
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>

          {/* Footer */}
          <ThemedView style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Secure • Fast • Reliable
            </ThemedText>
          </ThemedView>
        </ParallaxScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    paddingTop: 10,
  },
  welcomeText: {
    textAlign: "center",
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
    gap: 20,
    paddingHorizontal: 16,
  },
  primaryButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#2565F0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonGradient: {
    padding: 24,
    borderRadius: 20,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#EFF6FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconContainerAlt: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  buttonIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonIconAlt: {
    color: "#2565F0",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  buttonSecondaryText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
  },
  buttonPrimaryTextAlt: {
    color: "#334155",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  buttonSecondaryTextAlt: {
    color: "#64748b",
    fontSize: 14,
  },
  codeContainer: {
    backgroundColor: "#F0F9FF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0369A1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
    fontWeight: "500",
  },
  codeText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0369A1",
    letterSpacing: 8,
    marginBottom: 16,
    fontVariant: ["tabular-nums"],
  },
  timerContainer: {
    marginBottom: 12,
  },
  timerText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#E0F2FE",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0369A1",
    borderRadius: 3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#94A3B8",
    fontWeight: "600",
  },
  digitsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  digitBox: {
    width: 50,
    height: 60,
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    backgroundColor: "#fff",
    color: "#1E40AF",
  },
  digitBoxFilled: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2565F0",
  },
  joinButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  joinButtonActive: {
    backgroundColor: "#2565F0",
  },
  joinButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: "#94A3B8",
    letterSpacing: 1,
  },
});
