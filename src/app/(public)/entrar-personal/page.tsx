"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { profilePersonal } from "@/app/http/personal/profile-personal";
import { SignInForm, signInForm } from "@/app/schemas/sing-in-form";
import { Label } from "@/components/label";
import { Background } from "@/components/svg/background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPersonal() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  });

  async function onSubmit(data: SignInForm) {
    try {
      const response = await profilePersonal({
        email: data.email,
        password: data.password,
      });

      // Salva token
      setCookie("token", response.token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      localStorage.setItem("id", String(response.id));

      router.push("/admin/meus-alunos");
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Falha no login, verifique suas credenciais.");
    }
  }

  return (
    <div className="flex h-screen">
      <div className="relative flex-1 overflow-hidden bg-purple-800">
        <Background className="h-full" />
        <div className="absolute inset-0 bg-purple-800/50" />
      </div>

      <div className="flex w-full max-w-md flex-col justify-center bg-purple-900 p-10 text-white">
        <h2 className="mb-2 text-2xl font-bold">ENTRAR</h2>
        <p className="mb-6 text-sm">
          Faça login inserindo suas informações abaixo.
        </p>
        <hr className="mb-6 border-gray-400" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Digite seu e-mail"
              className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              {...register("password")}
              type="password"
              placeholder="Digite sua senha"
              className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded bg-orange-400 p-3 font-semibold text-white transition-colors hover:bg-orange-500"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs">
          Não possui conta?{" "}
          <a href="/registrar-personal" className="font-bold text-white">
            Cadastrar-se
          </a>
        </p>
      </div>
    </div>
  );
}
