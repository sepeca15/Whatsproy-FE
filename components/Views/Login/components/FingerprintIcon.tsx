import type React from "react"
import Svg, { Path } from "react-native-svg"

interface FingerprintIconProps {
  size?: number
  color?: string
}

const FingerprintIcon: React.FC<FingerprintIconProps> = ({ size = 24, color = "white" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 14.5C11.4 14.5 11 14.1 11 13.5V10.5C11 9.9 11.4 9.5 12 9.5C12.6 9.5 13 9.9 13 10.5V13.5C13 14.1 12.6 14.5 12 14.5Z"
        fill={color}
      />
      <Path
        d="M17.8 10.5V13.5C17.8 16.5 15.3 19 12.3 19C9.3 19 6.8 16.5 6.8 13.5V10.5C6.8 7.5 9.3 5 12.3 5C15.3 5 17.8 7.5 17.8 10.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M15.6 3H8.4C5.4 3 3 5.4 3 8.4V15.6C3 18.6 5.4 21 8.4 21H15.6C18.6 21 21 18.6 21 15.6V8.4C21 5.4 18.6 3 15.6 3Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default FingerprintIcon
