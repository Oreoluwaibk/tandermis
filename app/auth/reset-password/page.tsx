import ResetPassword from "@/component/auth/ResetPassword";
import { Suspense } from "react";

const page = () => (
  <Suspense fallback={null}>
    <ResetPassword />
  </Suspense>
);

export default page;
