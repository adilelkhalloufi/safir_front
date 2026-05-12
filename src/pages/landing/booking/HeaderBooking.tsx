
import { LangToggleFlags } from "@/components/landing/lang-toggle-flags";
import { Button } from "@/components/ui/button";
import { webRoutes } from "@/routes/web";
import { RootState } from "@/store";
import { IconLogin, IconTicket, IconUser } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HeaderBooking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const admin = useSelector((state: RootState) => state.admin);
  return (
    <header className="fixed top-0 left-0 right-0 bg-primary z-20">
      <div className="relative flex items-center justify-center px-4 py-3 min-h-[5.5rem]">
        <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 md:hidden">
          <Button
            variant="secondary"
            onClick={() => {
              navigate(webRoutes.subscriptionPlans);
            }}
          >
            <IconTicket className="mr-2 w-5 h-5" />
            <span className="hidden md:inline">{t("subscriptionPublic.subscribe", "Subscribe")}</span>
          </Button>
          {admin && (
            <Button
              variant="secondary"
              onClick={() => {
                navigate(webRoutes.Dashboard);
              }}
            >
              <IconUser />
            </Button>
          )}
          {!admin && (
            <Button
              onClick={() => {
                navigate(webRoutes.login);
              }}
            >
              <IconLogin className="mr-2 w-5 h-5" />
              {t("login")}
            </Button>
          )}
        </div>

        <img
          src="/logo.png"
          alt="Booking Header"
          className="h-16 md:h-20 z-10"
        />

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <LangToggleFlags />
          <div className="hidden md:flex flex-row gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                navigate(webRoutes.subscriptionPlans);
              }}
            >
              <IconTicket className="mr-2 w-5 h-5" />
              {t("subscriptionPublic.subscribe", "Subscribe")}
            </Button>
            {admin && (
              <Button
                variant="secondary"
                onClick={() => {
                  navigate(webRoutes.Dashboard);
                }}
              >
                <IconUser />
              </Button>
            )}
            {!admin && (
              <Button
                onClick={() => {
                  navigate(webRoutes.login);
                }}
              >
                <IconLogin className="mr-2 w-5 h-5" />
                {t("login")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}