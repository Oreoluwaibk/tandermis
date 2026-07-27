import Signup from "@/component/auth/Signup";
import { Suspense } from "react";

const page = () => (
  <Suspense fallback={null}>
    <Signup />
  </Suspense>
);

export default page;
