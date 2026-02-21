
import { useEffect } from "react"
import { setPageTitle } from "@/utils"
import BookingWizard from "./booking";
import HeaderBooking from "./booking/HeaderBooking";


const Index = () => {
  useEffect(() => {
    setPageTitle("SAFIR - Booking")
  }, [])
  return (
    <>
      <HeaderBooking />
      <BookingWizard />
    </>



  );
};

export default Index;