import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLanguage } from "@tabler/icons-react";
import i18next from "../../i18n"

export function LangToggle() {

  const changeLanguageHandler = (lng: string) => {

    i18next.changeLanguage(lng);

  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ghost">
          <IconLanguage />

          {/* <span className="sr-only">{i18next.language}</span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">

        <DropdownMenuItem onClick={() => changeLanguageHandler("fr")}>
          Francais
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguageHandler("en")}>
          English
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
