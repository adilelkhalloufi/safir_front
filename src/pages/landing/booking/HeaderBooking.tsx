
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
    <header className="fixed top-0 left-0 right-0 bg-primary flex items-center justify-between p-4 min-h-24">
      <div className="w-12 hidden md:block"></div>
      <div className="flex flex-row gap-4 md:hidden">
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
        {!admin && (<Button
          onClick={() => {
            navigate(webRoutes.login);
          }}
        >
          <IconLogin className="mr-2 w-5 h-5" />
          {t("login")}
        </Button>)}
      </div>
      <img src="/logo.png" alt="Booking Header" className="absolute left-1/2 transform -translate-x-1/2 h-20" />
      <div className="flex flex-row gap-4">
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