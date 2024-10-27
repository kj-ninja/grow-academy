import { OnboardingForm } from "@/features/user/forms/OnboardingForm";

function HomePage() {
  return (
    <div className="flex justify-center mt-20">
      <h2>Welcome Home!</h2>
      <OnboardingForm />
    </div>
  );
}

export const Component = HomePage;
