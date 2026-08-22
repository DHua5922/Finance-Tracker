import Input from "@/shared/components/Input";
import Label from "@/shared/components/Label";
import { useId } from "react";

export default function LoginForm() {
  const emailInputId = useId();
  const passwordInputId = useId();
  
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={emailInputId}>Email</Label>
        <Input id={emailInputId} type="email" placeholder="name@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={passwordInputId}>Password</Label>
        <Input id={passwordInputId} type="password" placeholder="••••••••" />
      </div>
    </form>
  );
}
