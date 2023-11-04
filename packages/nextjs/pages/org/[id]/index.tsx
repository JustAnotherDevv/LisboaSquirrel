import React from "react";
import { useRouter } from "next/router";

export default function OrganisationDetailPage() {
  const router = useRouter();
  return <div>OrganisationDetailPage {router.query.id}</div>;
}
