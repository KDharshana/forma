import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  accent?: string;
  content?: React.ReactNode;
}

export interface CarouselProps {
  /** Array of slides to display */
  slides: CarouselSlide[];
  /** Controlled active slide index */
  activeIndex?: number;
  /** Initial slide index for uncontrolled state */
  defaultActiveIndex?: number;
  /** Callback fired when active slide changes */
  onIndexChange?: (index: number) => void;
  /** Accent color for tags and dots */
  accent?: string;
  /** Width of each slide card (defaults to 280) */
  cardWidth?: number;
  /** Whether to show navigation controls at bottom (defaults to true) */
  showControls?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom slide card style */
  slideStyle?: StyleProp<ViewStyle>;
}

export function Carousel({
  slides,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onIndexChange,
  accent = colors.lime,
  cardWidth = 280,
  showControls = true,
  style,
  slideStyle,
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const isControlled = controlledIndex !== undefined;
  const currentIndex = isControlled ? controlledIndex : internalIndex;

  const [containerWidth, setContainerWidth] = useState(cardWidth);
  const slideWidth = Math.min(
    Math.max(120, cardWidth),
    Math.max(120, containerWidth),
  );
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(x / (slideWidth + 12));
    if (
      nextIndex >= 0 &&
      nextIndex < slides.length &&
      nextIndex !== currentIndex
    ) {
      if (!isControlled) {
        setInternalIndex(nextIndex);
      }
      onIndexChange?.(nextIndex);
    }
  };

  const goTo = (index: number) => {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    scrollRef.current?.scrollTo({
      x: target * (slideWidth + 12),
      animated: true,
    });
    if (!isControlled) {
      setInternalIndex(target);
    }
    onIndexChange?.(target);
  };

  useEffect(() => {
    const validIndex = Math.min(currentIndex, Math.max(0, slides.length - 1));
    scrollRef.current?.scrollTo({
      x: validIndex * (slideWidth + 12),
      animated: false,
    });
  }, [slides.length, slideWidth, currentIndex]);

  if (!slides.length) {
    return (
      <View style={[s.emptyContainer, style]}>
        <Text style={s.emptyText}>No slides available.</Text>
      </View>
    );
  }

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      style={[s.container, style]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={slideWidth + 12}
        decelerationRate="fast"
        contentContainerStyle={s.scrollContent}
      >
        {slides.map((slide, idx) => {
          const isCurrent = idx === currentIndex;

          return (
            <View
              key={slide.id}
              style={[
                s.slideCard,
                { width: slideWidth },
                isCurrent && s.activeSlide,
                slideStyle,
              ]}
            >
              <View style={s.cardTop}>
                {slide.tag && (
                  <View
                    style={[
                      s.tagBadge,
                      { backgroundColor: slide.accent || accent },
                    ]}
                  >
                    <Text numberOfLines={1} style={s.tagText}>
                      {slide.tag}
                    </Text>
                  </View>
                )}
                <Text style={s.indexNumber}>
                  {String(idx + 1).padStart(2, "0")}
                </Text>
              </View>

              <View style={s.cardBody}>
                <Text numberOfLines={2} style={s.slideTitle}>
                  {slide.title}
                </Text>
                {slide.subtitle && (
                  <Text numberOfLines={3} style={s.slideSubtitle}>
                    {slide.subtitle}
                  </Text>
                )}
                {slide.content}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {showControls && (
        <View style={s.controlsRow}>
          <Text
            accessibilityLiveRegion="polite"
            style={s.statusText}
          >
            Slide {currentIndex + 1} of {slides.length}
          </Text>

          <View style={s.arrowsContainer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous slide"
              accessibilityState={{ disabled: currentIndex === 0 }}
              disabled={currentIndex === 0}
              onPress={() => goTo(currentIndex - 1)}
              style={({ pressed, hovered }: any) => [
                s.arrowBtn,
                currentIndex === 0 && s.disabledArrow,
                (hovered || pressed) &&
                  currentIndex > 0 && { backgroundColor: colors.canvas },
                pressed && currentIndex > 0 && { opacity: 0.75 },
                {
                  outlineWidth: 0,
                  outlineColor: "transparent",
                  ...(Platform.OS === "web"
                    ? ({
                        cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                        outlineStyle: "none",
                      } as any)
                    : {}),
                },
              ]}
            >
              <Icon name="chevronLeft" size={14} color={colors.ink} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next slide"
              accessibilityState={{
                disabled: currentIndex === slides.length - 1,
              }}
              disabled={currentIndex === slides.length - 1}
              onPress={() => goTo(currentIndex + 1)}
              style={({ pressed, hovered }: any) => [
                s.arrowBtn,
                currentIndex === slides.length - 1 && s.disabledArrow,
                (hovered || pressed) &&
                  currentIndex < slides.length - 1 && {
                    backgroundColor: colors.canvas,
                  },
                pressed && currentIndex < slides.length - 1 && { opacity: 0.75 },
                {
                  outlineWidth: 0,
                  outlineColor: "transparent",
                  ...(Platform.OS === "web"
                    ? ({
                        cursor:
                          currentIndex === slides.length - 1
                            ? "not-allowed"
                            : "pointer",
                        outlineStyle: "none",
                      } as any)
                    : {}),
                },
              ]}
            >
              <Icon name="chevronRight" size={14} color={colors.ink} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },
  scrollContent: {
    paddingVertical: 10,
    gap: 12,
  },
  slideCard: {
    backgroundColor: colors.paper,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    justifyContent: "space-between",
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0px 6px 20px rgba(35, 38, 33, 0.04)" } as any)
      : {}),
  },
  activeSlide: {
    borderColor: colors.line,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: "80%",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
  },
  indexNumber: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    color: colors.muted,
  },
  cardBody: {
    marginTop: 14,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  slideSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
    lineHeight: 17,
    flexShrink: 1,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statusText: {
    color: colors.muted,
    fontSize: 13,
  },
  arrowsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledArrow: {
    opacity: 0.35,
  },
});
