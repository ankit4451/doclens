"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
//import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/hooks/use-toast";

const UpgradeButton = () => {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "BETA: This is not live yet",
          description: "Free plan till 3 days...",
          variant: "default",
        });
      }}
      className="w-full"
    >
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
