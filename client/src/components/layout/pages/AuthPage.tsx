import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { PropsWithChildren } from "react";

interface AuthPageProps extends PropsWithChildren {
  title: string;
  description: string;
}

export function AuthPage({ title, description, children }: AuthPageProps) {
  return (
    <div className="flex justify-center mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
