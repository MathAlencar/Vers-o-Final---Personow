'use client'

import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import createPersonal from '@/app/http/personal/create-personal'
import { profilePersonal } from '@/app/http/personal/profile-personal'
import { alertError } from '@/components/alert'
import { Label } from '@/components/label'
import { Background } from '@/components/svg/background'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RegisterFormData = {
  nome: string
  email: string
  password: string
  descricao: string
  formacao: string
  experiencia: string
  cidade: string
  profissao: string
  areaAtuacao: string
  modeloAtendimento: 'presencial' | 'online'
}

export default function RegisterPersonal() {
  const [step, setStep] = useState(1) 
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>()

  async function onSubmit(data: RegisterFormData) {
    try {
      console.log("DADOS ENVIADOS:", data);

      // 1️⃣ Cadastra o usuário
      const response = await createPersonal(data);
      console.log("Usuário criado:", response);

      // 2️⃣ Faz login automático
      const loginResponse = await profilePersonal({
        email: data.email,
        password: data.password,
      });

      // 3️⃣ Salva token em cookie
      setCookie("token", loginResponse.token, {
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      });

      localStorage.setItem("id", String(loginResponse.id));

      // 4️⃣ Redireciona para /admin
      router.push("/admin/meus-alunos");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
          console.error("Erro ao cadastrar:", error);
    
          let msg = "Falha no cadastro. Tente novamente.";
    
          if (error?.response) {
            try {
              const bodyText = await error.response.text();
    
              let body;
              try {
                body = JSON.parse(bodyText);
              } catch {
                body = bodyText;
              }
              msg = body?.message || body?.error || JSON.stringify(body, null, 2);
            } catch {
              msg = "Erro nas informações.";
            }
          }
    
        alertError(msg);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative overflow-hidden bg-purple-800">
        <Background className="h-full" />
        <div className="absolute inset-0 bg-purple-800/50" />
      </div>

      <div className="flex w-full max-w-md flex-col justify-center bg-purple-900 p-10 text-white">
        <h2 className="mb-2 text-2xl font-bold">CADASTRO</h2>
        <p className="mb-6 text-sm">
          Faça seu cadastro inserindo suas informações abaixo.
        </p>
        <p className="mb-6 text-sm">
          Etapa {step} de 2 — Preencha os dados abaixo.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {step === 1 && (
            <>
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input {...register('nome')} placeholder="Digite seu nome" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input {...register('email')} type="email" placeholder="Digite seu e-mail" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input {...register('password')} type="password" placeholder="Digite sua senha" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

              <Button type="button" onClick={() => setStep(2)} className="mt-4 w-full rounded bg-orange-400 p-3 font-semibold text-white hover:bg-orange-500">
                Próxima etapa
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input {...register('descricao')} placeholder="Digite sua descrição" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

              <div>
                <Label htmlFor="areaAtuacao">Área de Atuação</Label>
                <Input {...register('areaAtuacao')} placeholder="Ex: Nutrição, Fisioterapia..." className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input {...register('profissao')} placeholder="Digite sua profissão" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              
              <div>
                <Label htmlFor="formacao">Formação</Label>
                <Input {...register('formacao')} placeholder="Digite sua formação" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

              <div>
                <Label htmlFor="experiencia">Experiência</Label>
                <Input {...register('experiencia')} placeholder="Digite sua experiência" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

                <div>
                  <Label htmlFor="modeloAtendimento">Modelo de Atendimento</Label>

                  <select
                    {...register('modeloAtendimento')}
                    className="w-full rounded border border-orange-400 bg-transparent p-2 text-white"
                  >
                    <option value="" style={{ color: 'white' }}>Selecione</option>
                    <option value="presencial" style={{ color: 'black' }}>Presencial</option>
                    <option value="online" style={{ color: 'black' }}>Online</option>
                  </select>
                </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input {...register('cidade')} placeholder="Ex: São Paulo" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="button" onClick={() => setStep(1)} className="w-1/2 rounded bg-purple-900 border border-orange-800 p-3 font-semibold text-white hover:bg-gray-700">
                  Voltar
                </Button>

                <Button type="submit" disabled={isSubmitting} className="w-1/2 rounded bg-orange-400 p-3 font-semibold text-white hover:bg-orange-500">
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
