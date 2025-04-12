
import React from "react";
import { Link } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotImplementedProps {
  title?: string;
  feature?: string;
}

export default function NotImplemented({ title, feature }: NotImplementedProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-center">
        <div className="flex justify-center">
          <Construction className="h-16 w-16 text-expense-amber mb-4" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {title || "Coming Soon"}
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          {feature || "This feature"} is currently under development and will be available soon.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
