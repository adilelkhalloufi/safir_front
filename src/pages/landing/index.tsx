
import { useEffect } from "react"
import { setPageTitle } from "@/utils"
import BookingWizard from "./booking";
import HeaderBooking from "./booking/HeaderBooking";


const Index = () => {
  useEffect(() => {
    setPageTitle("SAFIRI - Booking")
  }, [])
  return (
    <>
      <HeaderBooking />
      <BookingWizard />
    </>



  );
};

export default Index;