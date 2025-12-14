
import { useEffect } from "react"
import { setPageTitle } from "@/utils"
import BookingWizard from "./booking";


const Index = () => {
  useEffect(() => {
    setPageTitle("Optique")
  }, [])
  return (
    <>

      <BookingWizard />
    </>



  );
};

export default Index;