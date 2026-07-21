import React from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Polygon,
  Stop,
  Text as SvgText,
  TextPath,
} from 'react-native-svg';

// ─── Types ──────────────────────────────────────────────────────────────────
// AwardShape is declared globally in src/types/global.d.ts — shared with the
// `Award` interface so every producer/consumer agrees on the same shapes.

export type AwardTheme =
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'sapphire'
  | 'emerald'
  | 'ruby'
  | 'amethyst'
  | 'custom';

export interface AwardBadgeProps {
  shape: AwardShape;
  color?: string;
  /** Label shown inside the red ribbon, e.g. "CREATOR", "CHOICE" */
  label: string;
  /** Period label shown, e.g. "2026", "LEVEL" */
  period?: string;
  /** Rank number or string shown prominently in the center */
  rank: string | number;
  /** Optional suffix after rank, e.g. "%" or "CHOICE" */
  suffix?: string;
  /** Uniform size in dp. Default: 120 */
  size?: number;
  /** Premium metallic visual theme or custom color hex code */
  theme?: string;
}

// ─── Canvas Constants ────────────────────────────────────────────────────────
const BW = 80;
const BH = 86;
const CX = 40;
const CY = 46;

let _uid = 0;

// ─── Geometry Helpers ────────────────────────────────────────────────────────
function polyVerts(n: number, cx: number, cy: number, r: number, start = -Math.PI / 2) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n + start;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
}

function polyStr(n: number, cx: number, cy: number, r: number) {
  return polyVerts(n, cx, cy, r)
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
}

function smoothScallopPath(cx: number, cy: number, R: number, r: number, bumps: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i < bumps * 2; i++) {
    const a = (Math.PI * i) / bumps - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < bumps; i++) {
    const p1 = pts[i * 2 + 1];
    const p2 = pts[(i * 2 + 2) % (bumps * 2)];
    d += ` Q ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
}

function roundedPolyPath(n: number, cx: number, cy: number, r: number, cr: number) {
  const v = polyVerts(n, cx, cy, r);
  const pts = v.map((cur, i) => {
    const prev = v[(i - 1 + n) % n];
    const next = v[(i + 1) % n];
    const dp = [prev[0] - cur[0], prev[1] - cur[1]];
    const dn = [next[0] - cur[0], next[1] - cur[1]];
    const lp = Math.hypot(dp[0], dp[1]);
    const ln = Math.hypot(dn[0], dn[1]);
    return {
      p1: [cur[0] + (cr * dp[0]) / lp, cur[1] + (cr * dp[1]) / lp] as [number, number],
      p2: [cur[0] + (cr * dn[0]) / ln, cur[1] + (cr * dn[1]) / ln] as [number, number],
    };
  });
  let d = `M ${pts[0].p1[0].toFixed(1)} ${pts[0].p1[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const { p2 } = pts[i];
    const { p1 } = pts[(i + 1) % n];
    d += ` A ${cr} ${cr} 0 0 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    d += ` L ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  }
  return d + ' Z';
}

// ─── Shape Data Config ───────────────────────────────────────────────────────
interface ShapeData {
  points: string | null;
  path: string | null;
  isCircle: boolean;
  circleR: number;
  innerPoints: string | null;
  innerPath: string | null;
  innerIsCircle: boolean;
  innerCircleR: number;
  fillRule: 'nonzero' | 'evenodd';
}

function getShape(shape: AwardShape): ShapeData {
  const base: ShapeData = {
    points: null,
    path: null,
    isCircle: false,
    circleR: 0,
    innerPoints: null,
    innerPath: null,
    innerIsCircle: false,
    innerCircleR: 0,
    fillRule: 'nonzero',
  };

  switch (shape) {
    case 'shield':
      return {
        ...base,
        path: `M 40 6 C 54 6, 70 12, 70 12 C 70 12, 72 38, 62 60 C 53 78, 40 82, 40 82 C 40 82, 27 78, 18 60 C 8 38, 10 12, 10 12 C 10 12, 26 6, 40 6 Z`,
        innerPath: `M 40 11 C 52 11, 66 16, 66 16 C 66 16, 67 39, 58 58 C 50 74, 40 78, 40 78 C 40 78, 30 74, 22 58 C 13 39, 14 16, 14 16 C 14 16, 28 11, 40 11 Z`,
      };

    case 'octagon':
      return {
        ...base,
        points: polyStr(8, CX, CY, 36),
        innerPoints: polyStr(8, CX, CY, 27),
      };

    case 'octagon-round':
      return {
        ...base,
        path: roundedPolyPath(8, CX, CY, 36, 9),
        innerPath: roundedPolyPath(8, CX, CY, 27, 7),
      };

    case 'scallop':
      return {
        ...base,
        path: smoothScallopPath(CX, CY, 36, 32, 12),
        innerPath: smoothScallopPath(CX, CY, 28, 24, 12),
      };

    case 'circle':
      return {
        ...base,
        isCircle: true,
        circleR: 36,
        innerIsCircle: true,
        innerCircleR: 28,
      };

    default:
      return base;
  }
}

// ─── Metallic Color Helpers ──────────────────────────────────────────────────
function adjustColor(hex: string, percent: number) {
  let num = parseInt(hex.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  R = Math.max(0, Math.min(255, R));
  G = Math.max(0, Math.min(255, G));
  B = Math.max(0, Math.min(255, B));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function detectTheme(theme?: string, color?: string): AwardTheme {
  const t = (theme || color || 'gold').toLowerCase().trim();
  if (
    t === 'gold' ||
    t === 'silver' ||
    t === 'bronze' ||
    t === 'sapphire' ||
    t === 'emerald' ||
    t === 'ruby' ||
    t === 'amethyst'
  ) {
    return t as AwardTheme;
  }
  if (
    t === '#eab308' ||
    t === '#ffd700' ||
    t === '#f59e0b' ||
    t.includes('gold') ||
    t.includes('yellow')
  )
    return 'gold';
  if (
    t === '#3b82f6' ||
    t === '#2563eb' ||
    t === '#1d4ed8' ||
    t.includes('blue') ||
    t.includes('sapphire')
  )
    return 'sapphire';
  if (
    t === '#94a3b8' ||
    t === '#cbd5e1' ||
    t === '#64748b' ||
    t === '#c0c0c0' ||
    t.includes('silver') ||
    t.includes('gray') ||
    t.includes('slate')
  )
    return 'silver';
  if (
    t === '#ca8a04' ||
    t === '#854d0e' ||
    t === '#b87333' ||
    t === '#cd7f32' ||
    t.includes('bronze') ||
    t.includes('copper') ||
    t.includes('brown')
  )
    return 'bronze';
  if (
    t === '#22c55e' ||
    t === '#16a34a' ||
    t === '#15803d' ||
    t.includes('green') ||
    t.includes('emerald')
  )
    return 'emerald';
  if (
    t === '#ef4444' ||
    t === '#dc2626' ||
    t === '#b91c1c' ||
    t.includes('red') ||
    t.includes('ruby')
  )
    return 'ruby';
  if (
    t === '#a855f7' ||
    t === '#9333ea' ||
    t === '#7e22ce' ||
    t.includes('purple') ||
    t.includes('violet') ||
    t.includes('amethyst')
  )
    return 'amethyst';
  return 'custom';
}

function getPremiumGradientStops(theme: AwardTheme, fallbackColor: string) {
  switch (theme) {
    case 'gold':
      return [
        { offset: '0%', color: '#FFF8D4' },
        { offset: '20%', color: '#ECC651' },
        { offset: '45%', color: '#ECC651' },
        { offset: '65%', color: '#D4AF37' },
        { offset: '85%', color: '#9E6D0F' },
        { offset: '100%', color: '#FFF4C4' },
      ];
    case 'silver':
      return [
        { offset: '0%', color: '#FFFFFF' },
        { offset: '20%', color: '#E2E8F0' },
        { offset: '45%', color: '#E2E8F0' },
        { offset: '65%', color: '#94A3B8' },
        { offset: '85%', color: '#475569' },
        { offset: '100%', color: '#E2E8F0' },
      ];
    case 'bronze':
      return [
        { offset: '0%', color: '#FFF2E6' },
        { offset: '20%', color: '#DC7633' },
        { offset: '45%', color: '#DC7633' },
        { offset: '65%', color: '#B03A2E' },
        { offset: '85%', color: '#6E2C00' },
        { offset: '100%', color: '#E59866' },
      ];
    case 'sapphire':
      return [
        { offset: '0%', color: '#F0F9FF' },
        { offset: '20%', color: '#38BDF8' },
        { offset: '45%', color: '#38BDF8' },
        { offset: '65%', color: '#0369A1' },
        { offset: '85%', color: '#0B3C5D' },
        { offset: '100%', color: '#0284C7' },
      ];
    case 'emerald':
      return [
        { offset: '0%', color: '#F0FDF4' },
        { offset: '20%', color: '#4ADE80' },
        { offset: '45%', color: '#4ADE80' },
        { offset: '65%', color: '#16A34A' },
        { offset: '85%', color: '#14532D' },
        { offset: '100%', color: '#15803D' },
      ];
    case 'ruby':
      return [
        { offset: '0%', color: '#FEF2F2' },
        { offset: '20%', color: '#F87171' },
        { offset: '45%', color: '#F87171' },
        { offset: '65%', color: '#DC2626' },
        { offset: '85%', color: '#7F1D1D' },
        { offset: '100%', color: '#B91C1C' },
      ];
    case 'amethyst':
      return [
        { offset: '0%', color: '#FDF4FF' },
        { offset: '20%', color: '#C084FC' },
        { offset: '45%', color: '#C084FC' },
        { offset: '65%', color: '#9333EA' },
        { offset: '85%', color: '#581C87' },
        { offset: '100%', color: '#7E22CE' },
      ];
    default: {
      let hex = fallbackColor;
      if (/^#[0-9A-F]{3}$/i.test(fallbackColor)) {
        hex =
          '#' +
          fallbackColor[1] +
          fallbackColor[1] +
          fallbackColor[2] +
          fallbackColor[2] +
          fallbackColor[3] +
          fallbackColor[3];
      }
      if (/^#[0-9A-F]{6}$/i.test(hex)) {
        return [
          { offset: '0%', color: adjustColor(hex, 30) },
          { offset: '25%', color: hex },
          { offset: '50%', color: hex },
          { offset: '75%', color: adjustColor(hex, -20) },
          { offset: '100%', color: adjustColor(hex, -35) },
        ];
      }
      return [
        { offset: '0%', color: fallbackColor },
        { offset: '100%', color: fallbackColor },
      ];
    }
  }
}

function getPremiumBorderStops(theme: AwardTheme) {
  switch (theme) {
    case 'gold':
      return [
        { offset: '0%', color: '#9E6D0F' },
        { offset: '50%', color: '#FFF8D4' },
        { offset: '100%', color: '#784F07' },
      ];
    case 'silver':
      return [
        { offset: '0%', color: '#475569' },
        { offset: '50%', color: '#FFFFFF' },
        { offset: '100%', color: '#334155' },
      ];
    case 'bronze':
      return [
        { offset: '0%', color: '#6E2C00' },
        { offset: '50%', color: '#FFF2E6' },
        { offset: '100%', color: '#4A1D00' },
      ];
    case 'sapphire':
      return [
        { offset: '0%', color: '#0B3C5D' },
        { offset: '50%', color: '#F0F9FF' },
        { offset: '100%', color: '#03466F' },
      ];
    case 'emerald':
      return [
        { offset: '0%', color: '#14532D' },
        { offset: '50%', color: '#F0FDF4' },
        { offset: '100%', color: '#0B3F20' },
      ];
    case 'ruby':
      return [
        { offset: '0%', color: '#7F1D1D' },
        { offset: '50%', color: '#FEF2F2' },
        { offset: '100%', color: '#491010' },
      ];
    case 'amethyst':
      return [
        { offset: '0%', color: '#581C87' },
        { offset: '50%', color: '#FDF4FF' },
        { offset: '100%', color: '#3B0764' },
      ];
    default:
      return [
        { offset: '0%', color: 'rgba(255,255,255,0.45)' },
        { offset: '100%', color: 'rgba(255,255,255,0.15)' },
      ];
  }
}

const AnimatedG = Animated.createAnimatedComponent(G);

// ─── Main Component ──────────────────────────────────────────────────────────
export const AwardBadge = React.memo(function AwardBadge({
  shape,
  color,
  label,
  period,
  rank,
  suffix,
  size = 120,
  theme: explicitTheme,
}: AwardBadgeProps) {
  const uid = React.useRef<string>('');
  if (!uid.current) {
    uid.current = `ab_${(++_uid).toString(36)}`;
  }

  const gId = `${uid.current}_bg`; // body gradient
  const bId = `${uid.current}_bo`; // border gradient
  const textPathId = `${uid.current}_tp`; // unique text path id
  const scale = size / BW;

  const detectedTheme = React.useMemo(
    () => detectTheme(explicitTheme, color),
    [explicitTheme, color]
  );
  const resolvedColor = React.useMemo(() => {
    if (detectedTheme === 'custom') {
      return explicitTheme || color || '#EAB308';
    }
    return color || '#EAB308';
  }, [detectedTheme, explicitTheme, color]);

  const geo = React.useMemo(() => getShape(shape), [shape]);
  const fr = geo.fillRule;

  const stops = React.useMemo(
    () => getPremiumGradientStops(detectedTheme, resolvedColor),
    [detectedTheme, resolvedColor]
  );
  const borderStops = React.useMemo(() => getPremiumBorderStops(detectedTheme), [detectedTheme]);

  const rankStr = String(rank);
  const rankFontSize = React.useMemo(() => {
    const baseSize =
      rankStr.length > 3 ? 16 : rankStr.length === 3 ? 22 : rankStr.length === 2 ? 30 : 35;
    return baseSize * scale;
  }, [rankStr, scale]);

  const textColor = React.useMemo(() => {
    switch (detectedTheme) {
      case 'gold':
        return '#593a0c';
      case 'silver':
        return '#2c3540';
      case 'bronze':
        return '#54270d';
      case 'sapphire':
        return '#0a2a3d';
      case 'emerald':
        return '#06301b';
      case 'ruby':
        return '#420606';
      case 'amethyst':
        return '#30084f';
      default:
        return adjustColor(resolvedColor, -50);
    }
  }, [detectedTheme, resolvedColor]);

  // Determine if shape is shield for custom ribbon size
  const isShield = shape === 'shield';

  const ribbonPaths = React.useMemo(() => {
    if (isShield) {
      return {
        leftTail: 'M 16 72 L 6 78 L 10 69 L 16 64 Z',
        rightTail: 'M 64 72 L 74 78 L 70 69 L 64 64 Z',
        leftFold: 'M 16 64 L 16 72 L 21 70 Z',
        rightFold: 'M 64 64 L 64 72 L 59 70 Z',
        banner: 'M 14 64 Q 40 56 66 64 L 64 76 Q 40 68 16 76 Z',
      };
    } else {
      // Wider ribbon paths for circular/octagonal/flower shapes
      return {
        leftTail: 'M 6 73 L 0 78 L 3 69 L 6 65 Z',
        rightTail: 'M 74 73 L 80 78 L 77 69 L 74 65 Z',
        leftFold: 'M 6 65 L 6 73 L 11 71 Z',
        rightFold: 'M 74 65 L 74 73 L 69 71 Z',
        banner: 'M 4 65 Q 40 56 76 65 L 74 77 Q 40 68 6 77 Z',
      };
    }
  }, [isShield]);

  // ─── Animation States ──────────────────────────────────────────────────────
  const sparkle1X = useSharedValue(55);
  const sparkle1Y = useSharedValue(25);
  const sparkle2X = useSharedValue(28);
  const sparkle2Y = useSharedValue(55);

  const sparkle1Scale = useSharedValue(0);
  const sparkle1Opacity = useSharedValue(0);
  const sparkle2Scale = useSharedValue(0);
  const sparkle2Opacity = useSharedValue(0);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runAnimation = () => {
      // Choose random coordinates inside safe bounds on every cycle
      sparkle1X.value = 20 + Math.random() * 40; // 20 to 60
      sparkle1Y.value = 20 + Math.random() * 20; // 20 to 40
      sparkle2X.value = 20 + Math.random() * 40; // 20 to 60
      sparkle2Y.value = 45 + Math.random() * 20; // 45 to 65

      // Reset animations
      sparkle1Scale.value = 0;
      sparkle1Opacity.value = 0;
      sparkle2Scale.value = 0;
      sparkle2Opacity.value = 0;

      // Trigger sparkle 1 immediately
      sparkle1Opacity.value = withSequence(
        withTiming(0.9, { duration: 180 }),
        withDelay(300, withTiming(0, { duration: 220 }))
      );
      sparkle1Scale.value = withSequence(
        withTiming(1.3, { duration: 220, easing: Easing.out(Easing.back(1.5)) }),
        withDelay(180, withTiming(0, { duration: 220 }))
      );

      // Trigger sparkle 2 (staggered delay)
      sparkle2Opacity.value = withSequence(
        withDelay(120, withTiming(0.8, { duration: 180 })),
        withDelay(300, withTiming(0, { duration: 220 }))
      );
      sparkle2Scale.value = withSequence(
        withDelay(120, withTiming(1.1, { duration: 220, easing: Easing.out(Easing.back(1.5)) })),
        withDelay(180, withTiming(0, { duration: 220 }))
      );

      // Schedule next sparkle cycle at a random time between 3 and 7 seconds
      const nextDelay = 3000 + Math.random() * 4000;
      timeoutId = setTimeout(runAnimation, nextDelay);
    };

    // Stagger initial start times to prevent all awards from sparkling at the same moment
    const initialDelay = Math.random() * 3000;
    timeoutId = setTimeout(runAnimation, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  const animatedSparkle1Props = useAnimatedProps(() => {
    return {
      opacity: sparkle1Opacity.value,
      x: sparkle1X.value,
      y: sparkle1Y.value,
      scale: sparkle1Scale.value,
      rotation: sparkle1Scale.value * 60,
    };
  });

  const animatedSparkle2Props = useAnimatedProps(() => {
    return {
      opacity: sparkle2Opacity.value,
      x: sparkle2X.value,
      y: sparkle2Y.value,
      scale: sparkle2Scale.value,
      rotation: -sparkle2Scale.value * 45,
    };
  });

  return (
    <View
      style={{
        width: size,
        height: size * (BH / BW),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 * scale },
        shadowOpacity: 0.3,
        shadowRadius: 10 * scale,
        elevation: 8,
      }}>
      <View
        style={{ position: 'absolute', left: 0, top: 0, width: size, height: size * (BH / BW) }}>
        <Svg width={size} height={size * (BH / BW)} viewBox={`0 0 ${BW} ${BH}`}>
          <Defs>
            <LinearGradient id={gId} x1="0" y1="0" x2="0.3" y2="1">
              {stops.map((stop, idx) => (
                <Stop key={idx} offset={stop.offset} stopColor={stop.color} stopOpacity={1} />
              ))}
            </LinearGradient>

            <LinearGradient id={bId} x1="0" y1="0" x2="1" y2="1">
              {borderStops.map((stop, idx) => (
                <Stop key={idx} offset={stop.offset} stopColor={stop.color} stopOpacity={1} />
              ))}
            </LinearGradient>

            {/* Red Ribbon Gradients */}
            <LinearGradient id="ribbon_grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ff4d4d" />
              <Stop offset="0.4" stopColor="#e60000" />
              <Stop offset="1" stopColor="#990000" />
            </LinearGradient>

            <LinearGradient id="ribbon_shadow_grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#990000" />
              <Stop offset="1" stopColor="#4a0000" />
            </LinearGradient>

            {/* Curved Path for Text on Ribbon */}
            <Path
              id={textPathId}
              d={isShield ? 'M 14.5 70.8 Q 40 62.8 65.5 70.8' : 'M 5.5 71.8 Q 40 62.8 74.5 71.8'}
            />
          </Defs>

          {/* ── Shape Shadow ── */}
          {geo.isCircle ? (
            <Circle cx={CX} cy={CY} r={geo.circleR + 1} fill="rgba(0,0,0,0.18)" />
          ) : geo.path ? (
            <Path d={geo.path} fill="rgba(0,0,0,0.18)" transform="translate(0, 1.2)" />
          ) : geo.points ? (
            <Polygon points={geo.points} fill="rgba(0,0,0,0.18)" transform="translate(0, 1.2)" />
          ) : null}

          {/* ── Main Shape Body ── */}
          {geo.isCircle ? (
            <Circle
              cx={CX}
              cy={CY}
              r={geo.circleR}
              fill={`url(#${gId})`}
              stroke={`url(#${bId})`}
              strokeWidth={1.8}
            />
          ) : geo.path ? (
            <Path
              d={geo.path}
              fill={`url(#${gId})`}
              stroke={`url(#${bId})`}
              strokeWidth={1.8}
              strokeLinejoin="round"
              fillRule={fr}
            />
          ) : geo.points ? (
            <Polygon
              points={geo.points}
              fill={`url(#${gId})`}
              stroke={`url(#${bId})`}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          ) : null}

          {/* ── Dotted Inner Decorative Ring ── */}
          {geo.isCircle ? (
            <Circle
              cx={CX}
              cy={CY}
              r={geo.innerCircleR}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.2}
              strokeDasharray="2 3"
            />
          ) : geo.innerPath ? (
            <Path
              d={geo.innerPath}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.2}
              strokeDasharray="2 3"
              strokeLinejoin="round"
            />
          ) : geo.innerPoints ? (
            <Polygon
              points={geo.innerPoints}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.2}
              strokeDasharray="2 3"
            />
          ) : null}

          {/* ── Sparkles ── */}
          <AnimatedG animatedProps={animatedSparkle1Props}>
            <Path d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Q 0 0 0 -8 Z" fill="#ffffff" />
          </AnimatedG>
          <AnimatedG animatedProps={animatedSparkle2Props}>
            <Path d="M 0 -6 Q 0 0 6 0 Q 0 0 0 6 Q 0 0 -6 0 Q 0 0 0 -6 Z" fill="#ffffff" />
          </AnimatedG>

          {/* ── Red Ribbon (in front of shape) ── */}
          {/* Tails */}
          <Path d={ribbonPaths.leftTail} fill="url(#ribbon_shadow_grad)" />
          <Path d={ribbonPaths.rightTail} fill="url(#ribbon_shadow_grad)" />

          {/* Shadow folds */}
          <Path d={ribbonPaths.leftFold} fill="#4a0000" />
          <Path d={ribbonPaths.rightFold} fill="#4a0000" />

          {/* Main banner */}
          <Path
            d={ribbonPaths.banner}
            fill="url(#ribbon_grad)"
            stroke="#b81d18"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />

          {/* Curved Label Text */}
          {/* Shadow Text */}
          <SvgText
            fill="rgba(0,0,0,0.45)"
            fontSize={5.8}
            fontWeight="900"
            letterSpacing={0.8}
            textAnchor="middle"
            dx={0.1}
            dy={0.4}>
            <TextPath href={`#${textPathId}`} startOffset="50%">
              {label.toUpperCase()}
            </TextPath>
          </SvgText>

          {/* Foreground Text */}
          <SvgText
            fill="#ffffff"
            fontSize={5.8}
            fontWeight="900"
            letterSpacing={0.8}
            textAnchor="middle">
            <TextPath href={`#${textPathId}`} startOffset="50%">
              {label.toUpperCase()}
            </TextPath>
          </SvgText>
        </Svg>
      </View>

      {/* ── Number in center (occupying most of the interior shape space) ── */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (isShield ? 8 : 20) * scale,
          bottom: (isShield ? 24 : 14) * scale,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        pointerEvents="none">
        <Text
          style={{
            fontSize: rankFontSize,
            fontWeight: '900',
            color: textColor,
            textAlign: 'center',
            textShadowColor: 'rgba(255, 255, 255, 0.7)',
            textShadowOffset: { width: 0, height: 1.5 * scale },
            textShadowRadius: 1.5 * scale,
            includeFontPadding: false,
          }}>
          {rank}
        </Text>
      </View>
    </View>
  );
});
