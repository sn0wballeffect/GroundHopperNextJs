// 2. Create components/auth/AuthDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

interface AuthDialogProps {
  mode: "signin" | "signup";
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ mode, isOpen, onClose }: AuthDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (password !== passwordConfirm) {
        setError("Passwörter stimmen nicht überein");
        return;
      }
      if (password.length < 6) {
        setError("Passwort muss mindestens 6 Zeichen lang sein");
        return;
      }
    }

    const { error: authError } = await (mode === "signin"
      ? signInWithEmail(email, password)
      : signUpWithEmail(email, password));

    if (authError) {
      setError(authError.message);
    } else {
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" ? "Login" : "Erstelle einen Account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>

            {mode === "signup" && (
              <div className="relative">
                <Input
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="Passwort wiederholen"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              {mode === "signin" ? "Login" : "Registrieren"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
