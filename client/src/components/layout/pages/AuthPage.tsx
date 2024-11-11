import { Card, CardContent } from "@/components/ui/Card";
import { PropsWithChildren } from "react";
import { Text } from "@/components/ui/Text/Text";

interface AuthPageProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export function AuthPage({ title, description, children }: AuthPageProps) {
  return (
    <div className="flex flex-col max-w-md w-full justify-center mx-auto mt-6 gap-6">
      <div className="flex flex-col">
        <Text type="h1" className="text-center">
          {title}
        </Text>
        {description && (
          <Text type="body" className="text-center">
            {description}
          </Text>
        )}
      </div>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
