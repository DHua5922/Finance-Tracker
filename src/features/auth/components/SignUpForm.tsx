import Input from "@/shared/components/Input";
import Label from "@/shared/components/Label";
import { useId } from "react";

export default function SignUpForm() {
  const usernameInputId = useId();
  const emailInputId = useId();
  const passwordInputId = useId();
  const confirmPasswordInputId = useId();

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={usernameInputId}>Username</Label>
        <Input id={usernameInputId} type="text" placeholder="Jane Doe" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={emailInputId}>Email</Label>
        <Input id={emailInputId} type="email" placeholder="name@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={passwordInputId}>Password</Label>
        <Input id={passwordInputId} type="password" placeholder="••••••••" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={confirmPasswordInputId}>Confirm password</Label>
        <Input
          id={confirmPasswordInputId}
          type="password"
          placeholder="••••••••"
        />
      </div>
    </form>
  );
}
