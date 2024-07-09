import React from "react";
import { ArrowUpRight } from "lucide-react";

import Link from "@/components/Link";
import { Button } from "@/components/ui/button";

import PageHeading from "@/components/PageHeading";
import ListLayout from "@/layouts/ListLayout";

const LatestPosts = () => {
  return (
    <section className="pt-10 space-y-4">
      <div className="flex items-center justify-between">
        <PageHeading headerText="Latest " />
        <Button
          variant={"outline"}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <Link href="#" className=" flex justify-center items-center">
            See all
            <ArrowUpRight strokeWidth={1} />
          </Link>
        </Button>
      </div>
      <ListLayout />
    </section>
  );
};

export default LatestPosts;
