
import { useEffect } from "react"
import { setPageTitle } from "@/utils"
import BookingWizard from "./booking";
import HeaderBooking from "./booking/HeaderBooking";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { resetBooking } from "@/store/slices/bookingSlice";
import { useTranslation } from "react-i18next";


const Index = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setPageTitle(t("bookingWizard.pageTitle", "SAFIR - Booking"))
    dispatch(resetBooking())
  }, [dispatch, t, i18n.language])
  return (
    <>
      <HeaderBooking />
      <BookingWizard />
    </>



  );
};

export default Index;