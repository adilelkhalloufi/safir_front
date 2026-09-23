
import { useEffect } from "react"
import { setPageTitle } from "@/utils"
import BookingWizard from "./booking";
import HeaderBooking from "./booking/HeaderBooking";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { resetBooking } from "@/store/slices/bookingSlice";


const Index = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setPageTitle("SAFIR - Booking")
    dispatch(resetBooking())
  }, [dispatch])
  return (
    <>
      <HeaderBooking />
      <BookingWizard />
    </>



  );
};

export default Index;