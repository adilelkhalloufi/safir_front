import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    IconBath, IconDroplet, IconDroplets, IconWaveSine, IconTemperature, IconFlame, IconPool, IconBucket,
    IconMassage, IconHandFinger, IconHandMove, IconBed, IconArmchair, IconStretching, IconYoga, IconMoodHeart,
    IconPlant, IconPlant2, IconLeaf, IconFlower, IconSeeding, IconBottle, IconPill, IconHeartbeat, IconStethoscope, IconVaccine, IconPrescription,
    IconScissors, IconBrush, IconPaint, IconSpray, IconWand,
    IconSparkles, IconStar, IconStarFilled, IconDiamond, IconPerfume,
    IconHeart, IconMoodSmile, IconCandle, IconSun, IconMoon, IconZzz,
    IconRun, IconWalk, IconBike, IconSwimming, IconBarbell, IconTrophy, IconMedal, IconActivity,
    IconApple, IconCarrot, IconSalad, IconCup, IconCoffee, IconGlass, IconLemon,
    IconFirstAidKit, IconMedicalCross, IconBandage, IconThermometer,
    IconHandStop, IconYinYang, IconSnowflake, IconMoonStars
} from '@tabler/icons-react';

// Static mapping of wellness icons
const wellnessIconsMap: { [key: string]: any } = {
    // Hammam & Spa
    IconBath, IconDroplet, IconDroplets, IconWaveSine, IconTemperature, IconFlame, IconPool, IconBucket,
    // Massage
    IconMassage, IconHandFinger, IconHandMove, IconBed, IconArmchair, IconStretching, IconYoga, IconMoodHeart,
    // Naturopathy
    IconPlant, IconPlant2, IconLeaf, IconFlower, IconSeeding, IconBottle, IconPill, IconHeartbeat, IconStethoscope, IconVaccine, IconPrescription,
    // Hair
    IconScissors, IconBrush, IconPaint, IconSpray, IconWand,
    // Beauty
    IconSparkles, IconStar, IconStarFilled, IconDiamond, IconPerfume,
    // Wellness
    IconHeart, IconMoodSmile, IconCandle, IconSun, IconMoon, IconZzz,
    // Fitness
    IconRun, IconWalk, IconBike, IconSwimming, IconBarbell, IconTrophy, IconMedal, IconActivity,
    // Nutrition
    IconApple, IconCarrot, IconSalad, IconCup, IconCoffee, IconGlass, IconLemon,
    // Medical
    IconFirstAidKit, IconMedicalCross, IconBandage, IconThermometer,
    // Nails & Alternative
    IconHandStop, IconYinYang, IconSnowflake, IconMoonStars
};

interface IconPickerProps {
    value?: string;
    onChange: (iconName: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function IconPicker({ value, onChange, disabled, placeholder = 'Select an icon' }: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    
    // Filter icons based on search
    const filteredIcons = useMemo(() => {
        const iconNames = Object.keys(wellnessIconsMap);
        
        if (!search) return iconNames;
        
        const searchLower = search.toLowerCase();
        return iconNames.filter(iconName => 
            iconName.toLowerCase().includes(searchLower)
        );
    }, [search]);

    const handleSelect = (iconName: string) => {
        onChange(iconName);
        setOpen(false);
        setSearch('');
    };

    const SelectedIcon = value && wellnessIconsMap[value] ? wellnessIconsMap[value] : null;

    return (
        <>
            <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => setOpen(true)}
                className="w-full justify-start text-left font-normal h-10 border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
                {value && SelectedIcon ? (
                    <div className="flex items-center gap-2">
                        <SelectedIcon size={18} stroke={1.5} />
                        <span className="text-sm">{value}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground text-sm">{placeholder}</span>
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select an Icon</DialogTitle>
                    </DialogHeader>
                    
               
                    
                    <div className="px-3 pb-3 border-b bg-muted/30">
                        <Input
                            placeholder="Search icons... (e.g., massage, scissors, heart, bath)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10"
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            {search ? `${filteredIcons.length} icons matching "${search}"` : 
                             `${Object.keys(wellnessIconsMap).length} wellness & beauty icons`}
                        </p>
                    </div>
                    
                    <ScrollArea className="flex-1 min-h-[450px] max-h-[calc(90vh-220px)]">
                        {filteredIcons.length > 0 ? (
                            <div className="grid grid-cols-8 gap-1 p-3">
                                {filteredIcons.map((iconName) => {
                                    const IconComponent = wellnessIconsMap[iconName];
                                    if (!IconComponent) return null;
                                    
                                    const isSelected = value === iconName;
                                    const displayName = iconName.replace('Icon', '');
                                    
                                    return (
                                        <Button
                                            key={iconName}
                                            type="button"
                                            variant={isSelected ? "default" : "ghost"}
                                            className="h-20 w-full flex flex-col items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                                            onClick={() => handleSelect(iconName)}
                                            title={iconName}
                                        >
                                            <IconComponent size={24} stroke={isSelected ? 2 : 1.5} />
                                            <span className="text-[10px] mt-1.5 truncate w-full text-center leading-tight font-normal">
                                                {displayName}
                                            </span>
                                        </Button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No icons found for "{search}"
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Try a different search term
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
