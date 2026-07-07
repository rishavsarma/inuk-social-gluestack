import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

type Props = { size: number; color: string };

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION 1 — Social Story Posts
// Slide: "Your Stories, Your Voice"
// ─────────────────────────────────────────────────────────────────────────────
export function StoryAnimation({ size, color }: Props) {
  const card1Y = useSharedValue(size * 0.15);
  const card1O = useSharedValue(0);
  const card2Y = useSharedValue(size * 0.1);
  const card2O = useSharedValue(0);
  const glowS = useSharedValue(1);
  const h1Y = useSharedValue(0);
  const h1O = useSharedValue(0);
  const h2Y = useSharedValue(0);
  const h2O = useSharedValue(0);
  const h3Y = useSharedValue(0);
  const h3O = useSharedValue(0);
  const badgeS = useSharedValue(0);
  const badgeO = useSharedValue(0);

  useEffect(() => {
    // Card entrance
    card1O.value = withDelay(200, withTiming(1, { duration: 500 }));
    card1Y.value = withDelay(200, withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.4)) }));
    card2O.value = withDelay(650, withTiming(0.7, { duration: 500 }));
    card2Y.value = withDelay(650, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));

    // Badge pop
    badgeS.value = withDelay(900, withTiming(1, { duration: 400, easing: Easing.out(Easing.back(2)) }));
    badgeO.value = withDelay(900, withTiming(1, { duration: 300 }));

    // Glow pulse
    glowS.value = withRepeat(
      withSequence(withTiming(1.07, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1, true
    );

    const floatHeart = (yV: typeof h1Y, oV: typeof h1O, delay: number) => {
      yV.value = withDelay(delay,
        withRepeat(withSequence(
          withTiming(-size * 0.5, { duration: 2200, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 0 })
        ), -1)
      );
      oV.value = withDelay(delay,
        withRepeat(withSequence(
          withTiming(1, { duration: 350 }),
          withTiming(1, { duration: 1400 }),
          withTiming(0, { duration: 450 })
        ), -1)
      );
    };

    floatHeart(h1Y, h1O, 1100);
    floatHeart(h2Y, h2O, 1800);
    floatHeart(h3Y, h3O, 2500);

    return () => {
      [card1Y, card1O, card2Y, card2O, glowS,
        h1Y, h1O, h2Y, h2O, h3Y, h3O, badgeS, badgeO].forEach(cancelAnimation);
    };
  }, []);

  const cS = useAnimatedStyle(() => ({ opacity: card1O.value, transform: [{ translateY: card1Y.value }] }));
  const c2S = useAnimatedStyle(() => ({ opacity: card2O.value, transform: [{ translateY: card2Y.value }] }));
  const gS = useAnimatedStyle(() => ({ transform: [{ scale: glowS.value }] }));
  const hS1 = useAnimatedStyle(() => ({ opacity: h1O.value, transform: [{ translateY: h1Y.value }] }));
  const hS2 = useAnimatedStyle(() => ({ opacity: h2O.value, transform: [{ translateY: h2Y.value }] }));
  const hS3 = useAnimatedStyle(() => ({ opacity: h3O.value, transform: [{ translateY: h3Y.value }] }));
  const bS = useAnimatedStyle(() => ({ opacity: badgeO.value, transform: [{ scale: badgeS.value }] }));

  const cW = size * 0.72;
  const lp = size * 0.14;

  return (
    <View style={{ width: size, height: size }}>
      {/* Glow backdrop */}
      <Animated.View style={[gS, {
        position: 'absolute', alignSelf: 'center', top: size * 0.18,
        width: size * 0.52, height: size * 0.52, borderRadius: size * 0.26,
        backgroundColor: color + '1A',
      }]} />

      {/* Main post card */}
      <Animated.View style={[cS, {
        position: 'absolute', top: size * 0.07, left: lp, width: cW,
        backgroundColor: '#fff', borderRadius: 16, padding: 14,
        shadowColor: color, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18, shadowRadius: 16, elevation: 10,
      }]}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: size * 0.076, height: size * 0.076, borderRadius: size * 0.038, backgroundColor: color }} />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <View style={{ height: 7, width: '55%', backgroundColor: '#1a2340', borderRadius: 4 }} />
            <View style={{ height: 5, width: '35%', backgroundColor: '#d0d0d0', borderRadius: 3, marginTop: 4 }} />
          </View>
          <Animated.View style={[bS, {
            paddingHorizontal: 8, paddingVertical: 4,
            backgroundColor: color, borderRadius: 8,
          }]}>
            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>inuk</Text>
          </Animated.View>
        </View>
        {/* Post image placeholder */}
        <View style={{ height: size * 0.14, backgroundColor: color + '1A', borderRadius: 10, marginBottom: 10 }} />
        {/* Footer row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            width: 22, height: 22, borderRadius: 11, backgroundColor: color,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 11 }}>♥</Text>
          </View>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#e8e8e8' }} />
          <View style={{ height: 6, flex: 1, backgroundColor: '#f0f0f0', borderRadius: 3 }} />
          <View style={{ height: 6, width: '20%', backgroundColor: '#f5f5f5', borderRadius: 3 }} />
        </View>
      </Animated.View>

      {/* Second peek card */}
      <Animated.View style={[c2S, {
        position: 'absolute', top: size * 0.52, left: lp + cW * 0.07,
        width: cW * 0.85, backgroundColor: '#fff',
        borderRadius: 14, padding: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
      }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: size * 0.055, height: size * 0.055, borderRadius: size * 0.0275, backgroundColor: '#1a6fc4' }} />
          <View style={{ marginLeft: 8 }}>
            <View style={{ height: 6, width: size * 0.2, backgroundColor: '#1a2340', borderRadius: 3 }} />
            <View style={{ height: 4, width: size * 0.13, backgroundColor: '#ddd', borderRadius: 2, marginTop: 4 }} />
          </View>
        </View>
      </Animated.View>

      {/* Floating reactions */}
      <Animated.Text style={[hS1, { position: 'absolute', bottom: size * 0.34, left: size * 0.21, fontSize: size * 0.072 }]}>❤️</Animated.Text>
      <Animated.Text style={[hS2, { position: 'absolute', bottom: size * 0.34, left: size * 0.5,  fontSize: size * 0.056 }]}>❤️</Animated.Text>
      <Animated.Text style={[hS3, { position: 'absolute', bottom: size * 0.34, left: size * 0.64, fontSize: size * 0.063 }]}>🔥</Animated.Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION 2 — Network / People connecting
// Slide: "Connect & Grow Together"
// ─────────────────────────────────────────────────────────────────────────────
export function ConnectAnimation({ size, color }: Props) {
  const n1S = useSharedValue(0); const n2S = useSharedValue(0); const n3S = useSharedValue(0);
  const l1O = useSharedValue(0); const l2O = useSharedValue(0); const l3O = useSharedValue(0);
  const p1S = useSharedValue(1); const p2S = useSharedValue(1); const p3S = useSharedValue(1);
  const centerS = useSharedValue(0); const centerO = useSharedValue(0);
  const dotP1 = useSharedValue(0); const dotP2 = useSharedValue(0); const dotP3 = useSharedValue(0);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.23;

  const nodes = [
    { x: cx,           y: cy - r },
    { x: cx - r * 0.9, y: cy + r * 0.55 },
    { x: cx + r * 0.9, y: cy + r * 0.55 },
  ];
  const nodeColors = [color, '#C0392B', '#0d7a55'];
  const nodeEmojis = ['✍️', '📸', '🎵'];
  const nodeR = size * 0.09;

  const getLine = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return {
      length: Math.sqrt(dx * dx + dy * dy),
      angle: Math.atan2(dy, dx) * 180 / Math.PI,
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
    };
  };

  const lines = [
    getLine(nodes[0], nodes[1]),
    getLine(nodes[0], nodes[2]),
    getLine(nodes[1], nodes[2]),
  ];

  useEffect(() => {
    n1S.value = withDelay(200, withTiming(1, { duration: 420 }));
    n2S.value = withDelay(500, withTiming(1, { duration: 420 }));
    n3S.value = withDelay(800, withTiming(1, { duration: 420 }));

    l1O.value = withDelay(950,  withTiming(1, { duration: 400 }));
    l2O.value = withDelay(1150, withTiming(1, { duration: 400 }));
    l3O.value = withDelay(1350, withTiming(1, { duration: 400 }));

    centerS.value = withDelay(1200, withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.8)) }));
    centerO.value = withDelay(1200, withTiming(1, { duration: 400 }));

    const pulse = (v: typeof p1S, d: number) =>
      v.value = withDelay(d, withRepeat(withSequence(withTiming(1.35, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true));
    pulse(p1S, 1600); pulse(p2S, 2000); pulse(p3S, 2400);

    const dot = (v: typeof dotP1, d: number) =>
      v.value = withDelay(d, withRepeat(withSequence(withTiming(1, { duration: 1600 }), withTiming(0, { duration: 0 })), -1));
    dot(dotP1, 1500); dot(dotP2, 2000); dot(dotP3, 2500);

    return () => {
      [n1S, n2S, n3S, l1O, l2O, l3O, p1S, p2S, p3S, centerS, centerO, dotP1, dotP2, dotP3].forEach(cancelAnimation);
    };
  }, []);

  // Node entrance styles
  const nStyle0 = useAnimatedStyle(() => ({ opacity: n1S.value, transform: [{ scale: 0.5 + n1S.value * 0.5 }] }));
  const nStyle1 = useAnimatedStyle(() => ({ opacity: n2S.value, transform: [{ scale: 0.5 + n2S.value * 0.5 }] }));
  const nStyle2 = useAnimatedStyle(() => ({ opacity: n3S.value, transform: [{ scale: 0.5 + n3S.value * 0.5 }] }));
  const nStyles = [nStyle0, nStyle1, nStyle2];

  // Pulse ring styles
  const pStyle0 = useAnimatedStyle(() => ({ transform: [{ scale: p1S.value }] }));
  const pStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: p2S.value }] }));
  const pStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: p3S.value }] }));
  const pStyles = [pStyle0, pStyle1, pStyle2];

  // Line opacity + rotation styles
  const lStyle0 = useAnimatedStyle(() => ({ opacity: l1O.value, transform: [{ rotate: `${lines[0].angle}deg` }] }));
  const lStyle1 = useAnimatedStyle(() => ({ opacity: l2O.value, transform: [{ rotate: `${lines[1].angle}deg` }] }));
  const lStyle2 = useAnimatedStyle(() => ({ opacity: l3O.value, transform: [{ rotate: `${lines[2].angle}deg` }] }));
  const lStyles = [lStyle0, lStyle1, lStyle2];

  // Traveling dot styles
  const dStyle0 = useAnimatedStyle(() => ({
    opacity: l1O.value,
    transform: [
      { translateX: nodes[0].x + (nodes[1].x - nodes[0].x) * dotP1.value - cx },
      { translateY: nodes[0].y + (nodes[1].y - nodes[0].y) * dotP1.value - cy },
    ],
  }));
  const dStyle1 = useAnimatedStyle(() => ({
    opacity: l2O.value,
    transform: [
      { translateX: nodes[0].x + (nodes[2].x - nodes[0].x) * dotP2.value - cx },
      { translateY: nodes[0].y + (nodes[2].y - nodes[0].y) * dotP2.value - cy },
    ],
  }));
  const dStyle2 = useAnimatedStyle(() => ({
    opacity: l3O.value,
    transform: [
      { translateX: nodes[1].x + (nodes[2].x - nodes[1].x) * dotP3.value - cx },
      { translateY: nodes[1].y + (nodes[2].y - nodes[1].y) * dotP3.value - cy },
    ],
  }));
  const dStyles = [dStyle0, dStyle1, dStyle2];

  const centStyle = useAnimatedStyle(() => ({ opacity: centerO.value, transform: [{ scale: centerS.value }] }));

  return (
    <View style={{ width: size, height: size }}>
      {/* Lines */}
      {lines.map((line, i) => (
        <Animated.View key={i} style={[lStyles[i], {
          position: 'absolute',
          left: line.midX - line.length / 2,
          top: line.midY - 2,
          width: line.length,
          height: 4,
          backgroundColor: nodeColors[i] + '55',
          borderRadius: 2,
        }]} />
      ))}

      {/* Traveling dots */}
      {dStyles.map((dStyle, i) => (
        <Animated.View key={i} style={[dStyle, {
          position: 'absolute',
          left: cx - 6,
          top: cy - 6,
          width: 12, height: 12,
          borderRadius: 6,
          backgroundColor: nodeColors[i],
          shadowColor: nodeColors[i],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        }]} />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <Animated.View key={i} style={[nStyles[i], {
          position: 'absolute',
          left: node.x - nodeR,
          top: node.y - nodeR,
        }]}>
          {/* Pulse ring */}
          <Animated.View style={[pStyles[i], {
            position: 'absolute',
            width: nodeR * 2, height: nodeR * 2, borderRadius: nodeR,
            borderWidth: 2.5, borderColor: nodeColors[i] + '55',
          }]} />
          {/* Avatar */}
          <View style={{
            width: nodeR * 2, height: nodeR * 2, borderRadius: nodeR,
            backgroundColor: nodeColors[i],
            alignItems: 'center', justifyContent: 'center',
            shadowColor: nodeColors[i], shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
          }}>
            <Text style={{ fontSize: nodeR * 0.85 }}>{nodeEmojis[i]}</Text>
          </View>
        </Animated.View>
      ))}

      {/* Center badge */}
      <Animated.View style={[centStyle, {
        position: 'absolute',
        left: cx - size * 0.07,
        top: cy - size * 0.07,
        width: size * 0.14, height: size * 0.14,
        borderRadius: size * 0.07,
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15, shadowRadius: 10, elevation: 8,
        borderWidth: 2, borderColor: color + '33',
      }]}>
        <Text style={{ fontSize: size * 0.055 }}>🔗</Text>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION 3 — Spotlight / Ripples
// Slide: "Be Seen, Be Heard"
// ─────────────────────────────────────────────────────────────────────────────
export function SpotlightAnimation({ size, color }: Props) {
  const starS = useSharedValue(0);
  const starR = useSharedValue(-20);
  const r1S = useSharedValue(0.15); const r1O = useSharedValue(0);
  const r2S = useSharedValue(0.15); const r2O = useSharedValue(0);
  const r3S = useSharedValue(0.15); const r3O = useSharedValue(0);
  const r4S = useSharedValue(0.15); const r4O = useSharedValue(0);
  const sp1 = useSharedValue(0); const sp2 = useSharedValue(0);
  const sp3 = useSharedValue(0); const sp4 = useSharedValue(0);
  const sp5 = useSharedValue(0); const sp6 = useSharedValue(0);
  const innerPulse = useSharedValue(1);

  useEffect(() => {
    starS.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.8)) }));
    starR.value = withDelay(300, withTiming(0, { duration: 550 }));

    innerPulse.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 1100 }), withTiming(1, { duration: 1100 })),
      -1, true
    );

    const ring = (sV: typeof r1S, oV: typeof r1O, delay: number) => {
      sV.value = withDelay(delay, withRepeat(
        withSequence(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), withTiming(0.15, { duration: 0 })),
        -1
      ));
      oV.value = withDelay(delay, withRepeat(
        withSequence(withTiming(0.65, { duration: 350 }), withTiming(0, { duration: 2050 })),
        -1
      ));
    };
    ring(r1S, r1O, 400);
    ring(r2S, r2O, 1000);
    ring(r3S, r3O, 1600);
    ring(r4S, r4O, 2200);

    const sparkle = (v: typeof sp1, delay: number) =>
      v.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 700 })), -1, true));
    sparkle(sp1, 900);  sparkle(sp2, 1150);
    sparkle(sp3, 1400); sparkle(sp4, 1650);
    sparkle(sp5, 1900); sparkle(sp6, 2150);

    return () => {
      [starS, starR, r1S, r1O, r2S, r2O, r3S, r3O, r4S, r4O,
        sp1, sp2, sp3, sp4, sp5, sp6, innerPulse].forEach(cancelAnimation);
    };
  }, []);

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starS.value }, { rotate: `${starR.value}deg` }],
  }));
  const innerStyle = useAnimatedStyle(() => ({ transform: [{ scale: innerPulse.value }] }));
  const ring1S = useAnimatedStyle(() => ({ transform: [{ scale: r1S.value }], opacity: r1O.value }));
  const ring2S = useAnimatedStyle(() => ({ transform: [{ scale: r2S.value }], opacity: r2O.value }));
  const ring3S = useAnimatedStyle(() => ({ transform: [{ scale: r3S.value }], opacity: r3O.value }));
  const ring4S = useAnimatedStyle(() => ({ transform: [{ scale: r4S.value }], opacity: r4O.value }));
  const spS1 = useAnimatedStyle(() => ({ opacity: sp1.value, transform: [{ scale: 0.6 + sp1.value * 0.4 }] }));
  const spS2 = useAnimatedStyle(() => ({ opacity: sp2.value, transform: [{ scale: 0.6 + sp2.value * 0.4 }] }));
  const spS3 = useAnimatedStyle(() => ({ opacity: sp3.value, transform: [{ scale: 0.6 + sp3.value * 0.4 }] }));
  const spS4 = useAnimatedStyle(() => ({ opacity: sp4.value, transform: [{ scale: 0.6 + sp4.value * 0.4 }] }));
  const spS5 = useAnimatedStyle(() => ({ opacity: sp5.value, transform: [{ scale: 0.6 + sp5.value * 0.4 }] }));
  const spS6 = useAnimatedStyle(() => ({ opacity: sp6.value, transform: [{ scale: 0.6 + sp6.value * 0.4 }] }));

  const half = size / 2;
  const sparkR = size * 0.27;
  const ringSizes = [size * 0.84, size * 0.64, size * 0.47, size * 0.32];
  const ringStyles = [ring1S, ring2S, ring3S, ring4S];

  const sparkles = [
    { style: spS1, angle: 0,   fs: 14 },
    { style: spS2, angle: 60,  fs: 10 },
    { style: spS3, angle: 120, fs: 12 },
    { style: spS4, angle: 180, fs: 8  },
    { style: spS5, angle: 240, fs: 11 },
    { style: spS6, angle: 300, fs: 9  },
  ];

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Expanding rings */}
      {ringSizes.map((rSize, i) => (
        <Animated.View key={i} style={[ringStyles[i], {
          position: 'absolute',
          width: rSize, height: rSize, borderRadius: rSize / 2,
          borderWidth: 2, borderColor: color,
        }]} />
      ))}

      {/* Sparkles at fixed angles */}
      {sparkles.map(({ style, angle, fs }, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <Animated.Text key={i} style={[style, {
            position: 'absolute',
            left: half + Math.cos(rad) * sparkR - fs / 2,
            top: half + Math.sin(rad) * sparkR - fs / 2,
            fontSize: fs,
            color: color,
          }]}>✦</Animated.Text>
        );
      })}

      {/* Inner glow */}
      <Animated.View style={[innerStyle, {
        position: 'absolute',
        width: size * 0.26, height: size * 0.26, borderRadius: size * 0.13,
        backgroundColor: color + '22',
      }]} />

      {/* Center icon */}
      <Animated.View style={[starStyle, {
        width: size * 0.2, height: size * 0.2, borderRadius: size * 0.1,
        backgroundColor: color,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: color, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45, shadowRadius: 16, elevation: 12,
      }]}>
        <Text style={{ fontSize: size * 0.09 }}>⭐</Text>
      </Animated.View>
    </View>
  );
}
