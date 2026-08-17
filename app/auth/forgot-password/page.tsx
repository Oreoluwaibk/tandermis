import ForgotPassword from "@/component/auth/ForgotPassword";
import { Suspense } from "react";

const page = () => (
  <Suspense fallback={null}>
    <ForgotPassword />
  </Suspense>
);

export default page;
