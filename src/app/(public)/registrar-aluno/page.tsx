'use client'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import createAluno from '@/app/http/aluno/create-aluno'
import { profileAluno } from '@/app/http/aluno/profile-aluno'
import { alertError } from '@/components/alert'
import { Label } from '@/components/label'
import { Background } from '@/components/svg/background'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RegisterFormData = {
  nome: string
  email: string
  password: string
  dateNascimento: string
  genero: 'Masculino' | 'Feminino' | 'Outro'
  celular: string
  altura: string
  objetivo: string
  peso: string
  condicaoMedica: string
  historicoLesao: string
  nivelAtividade: 'Sedentário' | 'Moderado' | 'Ativo'
}

export default function RegisterAluno() {
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

      // 1️⃣ Cadastra o aluno
      const response = await createAluno(data);
      console.log("Aluno criado:", response);

      // 2️⃣ Faz login automático
      const loginResponse = await profileAluno({
        email: data.email,
        password: data.password,
      });

      // 3️⃣ Salva token em cookie
      setCookie("token", loginResponse.token, {
        maxAge: 60 * 60 * 24, // 1 dia
        path: "/",
      });

      localStorage.setItem("id", loginResponse.id);

      // 4️⃣ Redireciona para /alunos/home
      router.push("/alunos/home");

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
          Etapa {step} de 3 — Preencha os dados abaixo.
        </p>
        <hr className="mb-6 border-gray-400" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Step 1 */}
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

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <Label htmlFor="dateNascimento">Data de nascimento</Label>
                <Input {...register('dateNascimento')} type='date' className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="genero">Gênero</Label>
                <select
                  {...register('genero')}
                  className="w-full rounded border border-orange-400 bg-transparent p-2 text-white"
                >
                  <option value="" style={{ color: 'white' }}>Selecione</option>
                  <option value="Feminino" style={{ color: 'black' }}>Feminino</option>
                  <option value="Masculino" style={{ color: 'black' }}>Masculino</option>
                  <option value="Outro" style={{ color: 'black' }}>Outro</option>
                </select>   
              </div>
              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input {...register('celular')} placeholder="Digite seu celular " className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="button" onClick={() => setStep(1)} className="w-1/2 rounded bg-purple-900 border border-orange-800 p-3 font-semibold text-white">Voltar</Button>
                <Button type="button" onClick={() => setStep(3)} className="w-1/2 rounded bg-orange-400 p-3 font-semibold text-white hover:bg-orange-500">Próxima etapa</Button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div>
                <Label htmlFor="altura">Altura</Label>
                <Input {...register('altura')} placeholder="Digite sua altura em cm" step="0.01" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="objetivo">Objetivo</Label>
                <Input {...register('objetivo')} placeholder="Digite seu objetivo" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="peso">Peso</Label>
                <Input {...register('peso')} placeholder="Digite seu peso" step="0.01" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="condicaoMedica">Condição Médica</Label>
                <Input {...register('condicaoMedica')} placeholder="descreva" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="historicoLesao">Histórico de Lesão</Label>
                <Input {...register('historicoLesao')} placeholder="descreva" className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="nivelAtividade">Nível de Atividade</Label>
                  <select
                    {...register('nivelAtividade')}
                    className="w-full rounded border border-orange-400 bg-transparent p-2 text-white"
                  >
                    <option value="" style={{ color: 'white' }}>Selecione</option>
                    <option value="Sedentário" style={{ color: 'black' }}>Sedentário</option>
                    <option value="Moderado" style={{ color: 'black' }}>Moderado</option>
                    <option value="Ativo" style={{ color: 'black' }}>Ativo</option>
                  </select>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="button" onClick={() => setStep(2)} className="w-1/2 rounded bg-purple-900 border border-orange-800 p-3 font-semibold text-white">Voltar</Button>
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
