import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Text,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { View } from 'react-native';

export default function Logo({ size = 80, showText = true }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#1A73E8" stopOpacity="1" />
            <Stop offset="1" stopColor="#1557B0" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="1" stopColor="#E8F0FE" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Fond rond */}
        <Circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />

        {/* Chapeau - bord plat */}
        <Path
          d="M20 45 L50 30 L80 45 L50 55 Z"
          fill="url(#capGrad)"
        />

        {/* Chapeau - dessus */}
        <Path
          d="M50 30 L50 55"
          stroke="#E8F0FE"
          strokeWidth="1"
        />

        {/* Chapeau - côtés */}
        <Path
          d="M65 50 L65 63 Q65 68 58 68 L42 68 Q35 68 35 63 L35 50"
          fill="white"
          opacity="0.95"
        />

        {/* Tag prix - orange */}
        <G transform="translate(58, 25)">
          <Rect
            x="0"
            y="0"
            width="22"
            height="16"
            rx="4"
            fill="#FF6B35"
          />
          {/* Petit trou du tag */}
          <Circle cx="3.5" cy="8" r="2" fill="white" opacity="0.8" />
          {/* Lignes prix */}
          <Rect x="7" y="5" width="12" height="2" rx="1" fill="white" opacity="0.9" />
          <Rect x="7" y="9" width="8" height="2" rx="1" fill="white" opacity="0.7" />
        </G>

        {/* Cordon chapeau */}
        <Path
          d="M80 45 L80 58"
          stroke="#FF6B35"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Circle cx="80" cy="61" r="3" fill="#FF6B35" />

      </Svg>

      {showText && (
        <Svg width={size * 1.8} height={size * 0.4} viewBox="0 0 160 32">
          <Defs>
            <LinearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#1A73E8" stopOpacity="1" />
              <Stop offset="1" stopColor="#FF6B35" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Campus */}
          <Text
            x="0"
            y="24"
            fontSize="22"
            fontWeight="bold"
            fill="#1A73E8"
            letterSpacing="1"
          >
            Campus
          </Text>
          {/* Deal */}
          <Text
            x="98"
            y="24"
            fontSize="22"
            fontWeight="bold"
            fill="#FF6B35"
            letterSpacing="1"
          >
            Deal
          </Text>
        </Svg>
      )}
    </View>
  );
}