import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18next from "../../i18n";

export function LangToggleFlags() {
  const changeLanguageHandler = (lng: string) => {
    i18next.changeLanguage(lng);
  };

 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div   className="  bg-[#fcdc6a] p-2 rounded-lg uppercase">
         <img src="https://flagicons.lipis.dev/flags/4x3/ca.svg" alt="Français" className="mr-2 inline-block w-5 h-5" />
          {i18next.language}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguageHandler("fr")} className="cursor-pointer">
           <img src="https://flagicons.lipis.dev/flags/4x3/ca.svg" alt="Français" className="mr-2 inline-block w-5 h-5" /> Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguageHandler("en")} className="cursor-pointer">
          <img src="https://flagicons.lipis.dev/flags/4x3/ca.svg" alt="English" className="mr-2 inline-block w-5 h-5" /> English
        </DropdownMenuItem>
         
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
