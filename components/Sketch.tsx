// Sketch.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  TextStyle,
  Platform,
  Modal,
} from "react-native";

type ElementType =
  | "car_a"
  | "car_b"
  | "car_c"
  | "truck"
  | "motorcycle"
  | "bus"
  | "road_straight"
  | "road_curve"
  | "intersection"
  | "roundabout"
  | "impact"
  | "debris"
  | "skid_marks"
  | "traffic_light"
  | "stop_sign";

interface AccidentElement {
  id: string;
  type: ElementType;
  position: Animated.ValueXY;
  rotation: Animated.Value;
  zIndex: number;
  width: number;
  height: number;
  color: string;
  label: string;
  fixed?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// Responsive scaling helpers
const BASE_WIDTH = 390;
const uiScale = Math.min(1, Math.max(0.75, screenWidth / BASE_WIDTH));
const scaleValue = (v: number) => Math.max(10, Math.round(v * uiScale));

// Base element sizes; will be scaled at runtime for mobile
const BASE_ELEMENTS = {
  // Vehicles
  car_a: {
    width: 80,
    height: 40,
    color: "#dc2626",
    label: "Car A",
    zIndex: 10,
  },
  car_b: {
    width: 80,
    height: 40,
    color: "#2563eb",
    label: "Car B",
    zIndex: 10,
  },
  car_c: {
    width: 80,
    height: 40,
    color: "#16a34a",
    label: "Car C",
    zIndex: 10,
  },
  truck: {
    width: 100,
    height: 50,
    color: "#ea580c",
    label: "Truck",
    zIndex: 10,
  },
  motorcycle: {
    width: 60,
    height: 30,
    color: "#7c3aed",
    label: "Motorcycle",
    zIndex: 10,
  },
  bus: { width: 120, height: 55, color: "#f59e0b", label: "Bus", zIndex: 10 },

  // Roads
  road_straight: {
    width: 280,
    height: 50,
    color: "#374151",
    label: "Road",
    zIndex: 1,
  },
  road_curve: {
    width: 100,
    height: 100,
    color: "#374151",
    label: "Curve",
    zIndex: 1,
  },
  intersection: {
    width: 120,
    height: 120,
    color: "#374151",
    label: "Intersection",
    zIndex: 1,
  },
  roundabout: {
    width: 100,
    height: 100,
    color: "#374151",
    label: "Roundabout",
    zIndex: 1,
  },

  // Evidence & Objects
  impact: {
    width: 35,
    height: 35,
    color: "#ef4444",
    label: "Impact",
    zIndex: 8,
  },
  debris: {
    width: 30,
    height: 20,
    color: "#78716c",
    label: "Debris",
    zIndex: 5,
  },
  skid_marks: {
    width: 90,
    height: 15,
    color: "#1f2937",
    label: "Skid Marks",
    zIndex: 3,
  },
  traffic_light: {
    width: 25,
    height: 60,
    color: "#1f2937",
    label: "Traffic Light",
    zIndex: 7,
  },
  stop_sign: {
    width: 35,
    height: 35,
    color: "#dc2626",
    label: "Stop Sign",
    zIndex: 7,
  },
};

const getScaledConfig = (type: ElementType) => {
  const cfg = (BASE_ELEMENTS as any)[type];
  return {
    ...cfg,
    width: scaleValue(cfg.width),
    height: scaleValue(cfg.height),
  };
};

const snapToGrid = (value: number, grid = 5) => Math.round(value / grid) * grid;

// Safe way to read Animated values in TS
const getAnimValue = (v: any): number => {
  if (v && typeof v.__getValue === "function") return v.__getValue();
  return typeof v?._value === "number" ? v._value : 0;
};

// Enhanced Vehicle Component with proper rotation center
const VehicleShape: React.FC<{
  element: AccidentElement;
  isSelected: boolean;
}> = ({ element, isSelected }) => {
  const getVehicleStyle = () => {
    switch (element.type) {
      case "truck":
        return styles.truckStyle;
      case "motorcycle":
        return styles.motorcycleStyle;
      case "bus":
        return styles.busStyle;
      default:
        return styles.carStyle;
    }
  };

  return (
    <View
      style={[
        styles.vehicleContainer,
        {
          width: element.width,
          height: element.height,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? "#fbbf24" : "#e5e7eb",
          backgroundColor: element.color,
        },
        getVehicleStyle(),
      ]}
    >
      {/* Vehicle Body Details */}
      <View style={styles.vehicleBody}>
        {/* Windshield */}
        <View
          style={[
            styles.windshield,
            {
              backgroundColor: "#87ceeb",
              width: element.type === "motorcycle" ? "40%" : "55%",
              height: element.type === "bus" ? "25%" : "35%",
            },
          ]}
        />

        {/* Front Indicator */}
        <View
          style={[
            styles.frontIndicator,
            {
              right: element.type === "motorcycle" ? "5%" : "3%",
            },
          ]}
        />

        {/* Wheels */}
        {element.type === "motorcycle" ? (
          <>
            <View style={[styles.motorcycleWheel, { left: "10%" }]} />
            <View style={[styles.motorcycleWheel, { right: "10%" }]} />
          </>
        ) : (
          <>
            <View style={[styles.wheel, { left: "15%" }]} />
            <View style={[styles.wheel, { right: "15%" }]} />
            {(element.type === "truck" || element.type === "bus") && (
              <View style={[styles.wheel, { left: "40%" }]} />
            )}
          </>
        )}

        {/* Direction Arrow */}
        <View style={styles.directionArrow} />
      </View>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.vehicleLabel,
            { fontSize: Math.max(8, Math.round(9 * uiScale)) as any },
          ]}
        >
          {element.label}
        </Text>
      </View>
    </View>
  );
};

const DraggableElement: React.FC<{
  element: AccidentElement;
  onSelect: (id: string) => void;
  isSelected: boolean;
  canvasWidth: number;
  canvasHeight: number;
}> = ({ element, onSelect, isSelected, canvasWidth, canvasHeight }) => {
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      onSelect(element.id);
      element.position.setOffset({
        x: getAnimValue(element.position.x),
        y: getAnimValue(element.position.y),
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: element.position.x, dy: element.position.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      element.position.flattenOffset();

      // Keep element within bounds
      const newX = snapToGrid(
        Math.max(
          10,
          Math.min(
            canvasWidth - element.width - 10,
            getAnimValue(element.position.x)
          )
        )
      );
      const newY = snapToGrid(
        Math.max(
          10,
          Math.min(
            canvasHeight - element.height - 10,
            getAnimValue(element.position.y)
          )
        )
      );

      Animated.spring(element.position, {
        toValue: { x: newX, y: newY },
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }).start();
    },
  });

  // Fixed rotation around center
  const rotateInterpolation = element.rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const renderElement = () => {
    const isVehicle = [
      "car_a",
      "car_b",
      "car_c",
      "truck",
      "motorcycle",
      "bus",
    ].includes(element.type);

    if (isVehicle) {
      return <VehicleShape element={element} isSelected={isSelected} />;
    }

    const getElementStyle = () => {
      switch (element.type) {
        case "road_straight":
          return {
            backgroundColor: element.color,
            borderRadius: 6,
            borderTopWidth: 3,
            borderBottomWidth: 3,
            borderColor: "#facc15",
          };
        case "road_curve":
          return {
            backgroundColor: element.color,
            borderRadius: element.width / 2,
            borderWidth: 3,
            borderColor: "#facc15",
          };
        case "intersection":
          return {
            backgroundColor: element.color,
            borderRadius: 8,
          };
        case "roundabout":
          return {
            backgroundColor: element.color,
            borderRadius: element.width / 2,
            borderWidth: 8,
            borderColor: "#facc15",
          };
        case "impact":
          return {
            backgroundColor: element.color,
            borderRadius: element.width / 2,
            borderWidth: 2,
            borderColor: "#ffffff",
          };
        case "traffic_light":
          return {
            backgroundColor: element.color,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#374151",
          };
        case "stop_sign":
          return {
            backgroundColor: element.color,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#ffffff",
          };
        default:
          return {
            backgroundColor: element.color,
            borderRadius: 4,
          };
      }
    };

    return (
      <View
        style={[
          {
            width: element.width,
            height: element.height,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? "#fbbf24" : "transparent",
          },
          getElementStyle(),
        ]}
      >
        {/* Intersection Lines */}
        {element.type === "intersection" && (
          <>
            <View style={styles.intersectionLineH} />
            <View style={styles.intersectionLineV} />
            <View style={styles.centerDot} />
          </>
        )}

        {/* Roundabout Center */}
        {element.type === "roundabout" && (
          <View style={styles.roundaboutCenter} />
        )}

        <Text style={[styles.elementText, getTextStyle(element.type)]}>
          {getElementSymbol(element.type)}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggableElement,
        {
          zIndex: element.zIndex,
          transform: [
            { translateX: element.position.x },
            { translateY: element.position.y },
            { rotate: rotateInterpolation },
            // Center the rotation properly
            { translateX: -element.width / 2 },
            { translateY: -element.height / 2 },
          ],
          left: element.width / 2,
          top: element.height / 2,
        },
      ]}
    >
      {renderElement()}
    </Animated.View>
  );
};

const getElementSymbol = (type: ElementType) => {
  switch (type) {
    case "impact":
      return "💥";
    case "debris":
      return "⚡";
    case "skid_marks":
      return "~~~";
    case "traffic_light":
      return "🚦";
    case "stop_sign":
      return "STOP";
    case "road_straight":
      return "━━━";
    case "intersection":
      return "✚";
    case "roundabout":
      return "◯";
    default:
      return "";
  }
};

const getTextStyle = (type: ElementType): TextStyle => {
  const baseStyle: TextStyle = {
    fontSize: 8,
    fontWeight: "600" as TextStyle["fontWeight"],
  };

  switch (type) {
    case "road_straight":
    case "intersection":
    case "skid_marks":
      return { ...baseStyle, color: "#facc15" } as TextStyle;
    case "stop_sign":
      return { ...baseStyle, color: "#ffffff", fontSize: 6 } as TextStyle;
    default:
      return { ...baseStyle, color: "#ffffff" } as TextStyle;
  }
};

const Sketch: React.FC = () => {
  const [elements, setElements] = useState<AccidentElement[]>([
    {
      id: "car_a",
      type: "car_a",
      position: new Animated.ValueXY({
        x: scaleValue(100),
        y: scaleValue(200),
      }),
      rotation: new Animated.Value(0),
      ...getScaledConfig("car_a"),
    },
    {
      id: "car_b",
      type: "car_b",
      position: new Animated.ValueXY({
        x: scaleValue(200),
        y: scaleValue(250),
      }),
      rotation: new Animated.Value(90),
      ...getScaledConfig("car_b"),
    },
  ]);

  const [selectedElement, setSelectedElement] = useState<string | null>(
    "car_a"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true); // Default to showing controls
  const [showLayerManager, setShowLayerManager] = useState(false);

  const canvasHeight = isFullscreen
    ? screenHeight
    : Math.max(300, Math.min(screenHeight * 0.6, 520 * uiScale));
  const canvasWidth = screenWidth - 20;

  const rotateSelected = (degrees: number) => {
    if (!selectedElement) return;
    const element = elements.find((e) => e.id === selectedElement);
    if (element) {
      // Rotate in place without moving the element
      const newRotation =
        (getAnimValue(element.rotation) + degrees + 360) % 360;
      Animated.spring(element.rotation, {
        toValue: newRotation,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const changeZIndex = (direction: "up" | "down") => {
    if (!selectedElement) return;
    setElements(
      elements.map((e) => {
        if (e.id === selectedElement) {
          const newZIndex =
            direction === "up"
              ? Math.min(20, e.zIndex + 1)
              : Math.max(1, e.zIndex - 1);
          return { ...e, zIndex: newZIndex };
        }
        return e;
      })
    );
  };

  const moveToLayer = (zIndex: number) => {
    if (!selectedElement) return;
    setElements(
      elements.map((e) => {
        if (e.id === selectedElement) {
          return { ...e, zIndex };
        }
        return e;
      })
    );
    setShowLayerManager(false);
  };

  const addElement = (type: ElementType) => {
    const config = getScaledConfig(type);
    const newElement: AccidentElement = {
      id: `${type}_${Date.now()}`,
      type,
      position: new Animated.ValueXY({
        x: canvasWidth / 2 - config.width / 2,
        y: canvasHeight / 2 - config.height / 2,
      }),
      rotation: new Animated.Value(0),
      ...config,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;
    const element = elements.find((e) => e.id === selectedElement);
    if (element) {
      const newElement: AccidentElement = {
        ...element,
        id: `${element.type}_${Date.now()}`,
        position: new Animated.ValueXY({
          x: getAnimValue(element.position.x) + 20,
          y: getAnimValue(element.position.y) + 20,
        }),
        rotation: new Animated.Value(getAnimValue(element.rotation)),
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    }
  };

  const deleteSelected = () => {
    if (!selectedElement) return;

    Alert.alert("Delete Element", "Remove this element from the scene?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setElements(elements.filter((e) => e.id !== selectedElement));
          setSelectedElement(
            elements.find((e) => e.id !== selectedElement)?.id || null
          );
        },
      },
    ]);
  };

  const selectedEl = elements.find((e) => e.id === selectedElement);

  return (
    <View
      style={[styles.container, isFullscreen && styles.fullscreenContainer]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1e293b"
        hidden={isFullscreen}
      />

      {/* Compact Header */}
      {!isFullscreen && (
        <View style={styles.header}>
          <Text style={styles.title}>🚗 Sketch</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setShowControls(!showControls)}
            >
              <Text style={styles.headerBtnText}>
                {showControls ? "Hide" : "Tools"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setShowLayerManager(true)}
            >
              <Text style={styles.headerBtnText}>Layers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setIsFullscreen(true)}
            >
              <Text style={styles.headerBtnText}>Full</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Fullscreen Header */}
      {isFullscreen && (
        <View style={styles.fullscreenHeader}>
          <TouchableOpacity
            style={styles.exitFullscreenBtn}
            onPress={() => setIsFullscreen(false)}
          >
            <Text style={styles.exitFullscreenText}>✕ Exit Fullscreen</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Canvas */}
      <View
        style={[
          styles.canvas,
          {
            height: canvasHeight,
            marginBottom: showControls && !isFullscreen ? 80 : 10,
          },
        ]}
      >
        <View style={styles.canvasBackground}>
          {/* Grid */}
          <View style={styles.gridPattern} />

          {elements
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                onSelect={setSelectedElement}
                isSelected={selectedElement === element.id}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
              />
            ))}
        </View>
      </View>

      {/* Element Info */}
      {selectedEl && !isFullscreen && (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            <Text style={styles.infoHighlight}>{selectedEl.label}</Text> •
            Angle: {Math.round(getAnimValue(selectedEl.rotation))}° • Layer:{" "}
            {selectedEl.zIndex}
          </Text>
        </View>
      )}

      {/* Controls */}
      {showControls && !isFullscreen && (
        <View style={styles.controlsWrapper}>
          <ScrollView
            style={styles.controlsScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.controlsContent}
          >
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => rotateSelected(-15)}
              >
                <Text style={styles.quickBtnText}>↺ -15°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => rotateSelected(15)}
              >
                <Text style={styles.quickBtnText}>↻ +15°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => rotateSelected(90)}
              >
                <Text style={styles.quickBtnText}>↻ 90°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => changeZIndex("up")}
              >
                <Text style={styles.quickBtnText}>⬆ Layer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => changeZIndex("down")}
              >
                <Text style={styles.quickBtnText}>⬇ Layer</Text>
              </TouchableOpacity>
            </View>

            {/* Add Vehicles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚗 Vehicles</Text>
              <View style={styles.buttonGrid}>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).car_a.color },
                  ]}
                  onPress={() => addElement("car_a")}
                >
                  <Text style={styles.addBtnText}>Car A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).car_b.color },
                  ]}
                  onPress={() => addElement("car_b")}
                >
                  <Text style={styles.addBtnText}>Car B</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).car_c.color },
                  ]}
                  onPress={() => addElement("car_c")}
                >
                  <Text style={styles.addBtnText}>Car C</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).truck.color },
                  ]}
                  onPress={() => addElement("truck")}
                >
                  <Text style={styles.addBtnText}>Truck</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: (BASE_ELEMENTS as any).motorcycle.color,
                    },
                  ]}
                  onPress={() => addElement("motorcycle")}
                >
                  <Text style={styles.addBtnText}>Motorcycle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).bus.color },
                  ]}
                  onPress={() => addElement("bus")}
                >
                  <Text style={styles.addBtnText}>Bus</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Add Infrastructure */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🛣️ Roads & Infrastructure</Text>
              <View style={styles.buttonGrid}>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: (BASE_ELEMENTS as any).road_straight
                        .color,
                    },
                  ]}
                  onPress={() => addElement("road_straight")}
                >
                  <Text style={styles.addBtnText}>Road</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: (BASE_ELEMENTS as any).intersection
                        .color,
                    },
                  ]}
                  onPress={() => addElement("intersection")}
                >
                  <Text style={styles.addBtnText}>Intersection</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: (BASE_ELEMENTS as any).roundabout.color,
                    },
                  ]}
                  onPress={() => addElement("roundabout")}
                >
                  <Text style={styles.addBtnText}>Roundabout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: (BASE_ELEMENTS as any).traffic_light
                        .color,
                    },
                  ]}
                  onPress={() => addElement("traffic_light")}
                >
                  <Text style={styles.addBtnText}>Traffic Light</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).stop_sign.color },
                  ]}
                  onPress={() => addElement("stop_sign")}
                >
                  <Text style={styles.addBtnText}>Stop Sign</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Add Evidence */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔍 Evidence</Text>
              <View style={styles.buttonGrid}>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).impact.color },
                  ]}
                  onPress={() => addElement("impact")}
                >
                  <Text style={styles.addBtnText}>💥 Impact</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    { backgroundColor: (BASE_ELEMENTS as any).debris.color },
                  ]}
                  onPress={() => addElement("debris")}
                >
                  <Text style={styles.addBtnText}>⚡ Debris</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: (BASE_ELEMENTS as any).skid_marks.color,
                    },
                  ]}
                  onPress={() => addElement("skid_marks")}
                >
                  <Text style={styles.addBtnText}>~~~ Skids</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={duplicateSelected}
              >
                <Text style={styles.actionBtnText}>📋 Duplicate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={deleteSelected}
              >
                <Text style={styles.actionBtnText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Layer Manager Modal */}
      <Modal
        visible={showLayerManager}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLayerManager(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Layer Management</Text>
            <ScrollView>
              {[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20,
              ].map((layer) => (
                <TouchableOpacity
                  key={layer}
                  style={[
                    styles.layerItem,
                    selectedEl?.zIndex === layer && styles.selectedLayerItem,
                  ]}
                  onPress={() => moveToLayer(layer)}
                >
                  <Text style={styles.layerText}>Layer {layer}</Text>
                  {selectedEl?.zIndex === layer && (
                    <Text style={styles.currentLayerText}>Current</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowLayerManager(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Floating Controls */}
      {isFullscreen && (
        <View style={styles.floatingControls}>
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={() => rotateSelected(-15)}
          >
            <Text style={styles.floatingBtnText}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={() => rotateSelected(15)}
          >
            <Text style={styles.floatingBtnText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={() => changeZIndex("up")}
          >
            <Text style={styles.floatingBtnText}>⬆</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={() => changeZIndex("down")}
          >
            <Text style={styles.floatingBtnText}>⬇</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  fullscreenContainer: {
    backgroundColor: "#000000",
  },

  // Header
  header: {
    backgroundColor: "#1e293b",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  headerBtn: {
    backgroundColor: "#475569",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  headerBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },

  // Fullscreen Header
  fullscreenHeader: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  exitFullscreenBtn: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exitFullscreenText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Canvas
  canvas: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  canvasBackground: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    position: "relative",
  },
  gridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },

  // Elements
  draggableElement: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Vehicle Styles
  vehicleContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  carStyle: {
    borderRadius: 8,
  },
  truckStyle: {
    borderRadius: 6,
  },
  motorcycleStyle: {
    borderRadius: 12,
  },
  busStyle: {
    borderRadius: 4,
  },
  vehicleBody: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  windshield: {
    position: "absolute",
    top: "20%",
    left: "22.5%",
    borderRadius: 3,
  },
  frontIndicator: {
    position: "absolute",
    width: "6%",
    height: "30%",
    backgroundColor: "#ffffff",
    top: "35%",
    borderRadius: 2,
  },
  wheel: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#1f2937",
    borderRadius: 4,
    bottom: "20%",
  },
  motorcycleWheel: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "#1f2937",
    borderRadius: 6,
    bottom: "25%",
  },
  directionArrow: {
    position: "absolute",
    right: -6,
    top: "50%",
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftColor: "#ffffff",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    transform: [{ translateY: -4 }],
  },
  labelContainer: {
    position: "absolute",
    bottom: -18,
    width: "100%",
    alignItems: "center",
  },
  vehicleLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },

  // Element Styles
  elementText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  intersectionLineH: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#facc15",
    top: "48%",
  },
  intersectionLineV: {
    position: "absolute",
    width: 4,
    height: "100%",
    backgroundColor: "#facc15",
    left: "48%",
  },
  centerDot: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    top: "46%",
    left: "46%",
  },
  roundaboutCenter: {
    width: "60%",
    height: "60%",
    backgroundColor: "#16a34a",
    borderRadius: 50,
    position: "absolute",
  },

  // Info Bar
  infoBar: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
  },
  infoText: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
  },
  infoHighlight: {
    fontWeight: "bold",
    color: "#1d4ed8",
  },

  // Controls
  controlsWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  controlsScrollView: {
    flex: 1,
  },
  controlsContent: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 15,
  },
  quickBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 65,
  },
  quickBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  // Sections
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  addBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
  },
  addBtnText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  // Actions
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionBtn: {
    backgroundColor: "#6b7280",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 0.45,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
  },
  actionBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  // Fullscreen Floating Controls
  floatingControls: {
    position: "absolute",
    bottom: 30,
    right: 20,
    flexDirection: "column",
    gap: 10,
  },
  floatingBtn: {
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  floatingBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Layer Manager Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  layerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedLayerItem: {
    backgroundColor: "#e6f7ff",
  },
  layerText: {
    fontSize: 16,
  },
  currentLayerText: {
    fontSize: 12,
    color: "#1890ff",
    fontWeight: "bold",
  },
  closeModalBtn: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    alignItems: "center",
  },
  closeModalText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Sketch;
