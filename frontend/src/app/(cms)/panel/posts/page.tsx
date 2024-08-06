import { protectAuthPage } from "@/actions/auth";
import React from "react";

export default async function PanelPostsPage() {
  await protectAuthPage();
  return <div>PanelPostsPage</div>;
}
