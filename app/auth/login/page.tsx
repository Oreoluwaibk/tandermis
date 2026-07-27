"use client";

import Login from "@/component/auth/Login";
import { Suspense } from "react";

const page = () => (
  <Suspense fallback={null}>
    <Login />
  </Suspense>
);

export default page;
