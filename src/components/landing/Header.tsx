import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { webRoutes } from "@/routes/web";
import {  IconLogin, IconUser } from "@tabler/icons-react";
import { LangToggle } from "./lang-toggle";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ThemeSwitch from "../theme-switch";
import logo from '../../assets/favicon.png';

interface RouteProps {
  href: string;
  label: string;
}

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routeList: RouteProps[] = [
    {
      href: '#benefits',
      label: t("menu2"),
    },
    {
      href: '#features',
      label: t("menu1"),
    },

    {
      href: '#pricing',
      label: t("menu3"),
    },
    {
      href: "#contact",
      label: t("menu4"),
    },


  ];
  const admin = useSelector((state: RootState) => state.admin);

  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <span className="text-xl font-bold flex items-center">
            <IconRecycle />
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex text-center"
            >
              {t("website")}
            </a>
          </span> */}
          <Link to={webRoutes.home} className="text-xl font-bold flex items-center">
            <img src={logo} alt="OpticFlow Logo" width={50} />
            <span className="ml-2 font-bold text-xl flex text-center">
              {t("website")}
            </span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className="text-sm font-medium hover:text-primary"
              >
                {route.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
          <LangToggle />
       
 
          {admin && (
            <Button
              variant="ghost"
              onClick={() => {
                navigate(webRoutes.Dashboard);
              }}
            >
              <IconUser />
            </Button>
          )}
          {!admin && (<Button
            onClick={() => {
              navigate(webRoutes.login);
            }}
          >
            <IconLogin className="mr-2 w-5 h-5" />
            {t("login")}
          </Button>)}

        </div>
      </div>
    </header>
  );
}
