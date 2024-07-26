"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [passwordVisible, setpasswordVisible] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    console.log(e.target.email.value);
    console.log(e.target.password.value);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          autoFocus
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Button
            variant={"ghost"}
            type="button"
            className="absolute right-0"
            onClick={(e) => {
              e.preventDefault();
              setpasswordVisible(!passwordVisible);
            }}
          >
            {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>

          <Input
            autoFocus
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            aria-required="true"
            required
            placeholder="Enter password"
            className="pr-11"
          />
        </div>
      </div>
      <Button type="submit" className="block w-full">
        Submit
      </Button>
    </form>
  );
};

export default LoginForm;
