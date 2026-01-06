import {
  IconBath,
  IconDroplet,
  IconDroplets,
  IconWaveSine,
  IconTemperature,
  IconFlame,
  IconPool,
  IconBucket,
  IconMassage,
  IconHandFinger,
  IconHandMove,
  IconBed,
  IconArmchair,
  IconStretching,
  IconYoga,
  IconMoodHeart,
  IconPlant,
  IconPlant2,
  IconLeaf,
  IconFlower,
  IconSeeding,
  IconBottle,
  IconPill,
  IconHeartbeat,
  IconStethoscope,
  IconVaccine,
  IconPrescription,
  IconScissors,
  IconBrush,
  IconPaint,
  IconSpray,
  IconWand,
  IconSparkles,
  IconStar,
  IconStarFilled,
  IconDiamond,
  IconPerfume,
  IconHeart,
  IconMoodSmile,
  IconCandle,
  IconSun,
  IconMoon,
  IconZzz,
  IconRun,
  IconWalk,
  IconBike,
  IconSwimming,
  IconBarbell,
  IconTrophy,
  IconMedal,
  IconActivity,
  IconApple,
  IconCarrot,
  IconSalad,
  IconCup,
  IconCoffee,
  IconGlass,
  IconLemon,
  IconFirstAidKit,
  IconMedicalCross,
  IconBandage,
  IconThermometer,
  IconHandStop,
  IconYinYang,
  IconSnowflake,
  IconMoonStars,
} from '@tabler/icons-react'

// Static mapping of wellness icons
const iconMap: { [key: string]: any } = {
  IconBath,
  IconDroplet,
  IconDroplets,
  IconWaveSine,
  IconTemperature,
  IconFlame,
  IconPool,
  IconBucket,
  IconMassage,
  IconHandFinger,
  IconHandMove,
  IconBed,
  IconArmchair,
  IconStretching,
  IconYoga,
  IconMoodHeart,
  IconPlant,
  IconPlant2,
  IconLeaf,
  IconFlower,
  IconSeeding,
  IconBottle,
  IconPill,
  IconHeartbeat,
  IconStethoscope,
  IconVaccine,
  IconPrescription,
  IconScissors,
  IconBrush,
  IconPaint,
  IconSpray,
  IconWand,
  IconSparkles,
  IconStar,
  IconStarFilled,
  IconDiamond,
  IconPerfume,
  IconHeart,
  IconMoodSmile,
  IconCandle,
  IconSun,
  IconMoon,
  IconZzz,
  IconRun,
  IconWalk,
  IconBike,
  IconSwimming,
  IconBarbell,
  IconTrophy,
  IconMedal,
  IconActivity,
  IconApple,
  IconCarrot,
  IconSalad,
  IconCup,
  IconCoffee,
  IconGlass,
  IconLemon,
  IconFirstAidKit,
  IconMedicalCross,
  IconBandage,
  IconThermometer,
  IconHandStop,
  IconYinYang,
  IconSnowflake,
  IconMoonStars,
}

/**
 * Dynamically renders a Tabler icon by its name
 * @param iconName - The name of the icon (e.g., "IconHeart", "IconMassage", "IconScissors")
 * @param props - Additional props to pass to the icon component (size, color, stroke, etc.)
 * @returns The icon component or null if not found
 */
export const renderIcon = (iconName: string, props?: any) => {
  if (!iconName) return null

  const IconComponent = iconMap[iconName]

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in wellness icons`)
    return null
  }

  return <IconComponent {...props} />
}

/**
 * Get the icon component by name without rendering
 * @param iconName - The name of the icon
 * @returns The icon component class or null
 */
export const getIconComponent = (iconName: string) => {
  if (!iconName) return null

  return iconMap[iconName] || null
}

/**
 * Check if an icon name exists
 * @param iconName - The name of the icon to check
 * @returns boolean indicating if the icon exists
 */
export const iconExists = (iconName: string): boolean => {
  return !!iconMap[iconName]
}
export default function IconDisplay({
  iconName,
  size = 24,
  color = 'currentColor',
  stroke = 2,
}: {
  iconName: string
  size?: number
  color?: string
  stroke?: number
}) {
  const IconComponent = getIconComponent(iconName)
  if (!IconComponent) {
    return null
  }
  return <IconComponent size={size} color={color} stroke={stroke} />
}
