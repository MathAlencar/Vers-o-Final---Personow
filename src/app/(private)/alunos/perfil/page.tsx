"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import createFoto from "@/app/http/aluno/create-foto";
import getAluno from "@/app/http/aluno/get-aluno";
import updateAluno from "@/app/http/aluno/update-aluno";
import { Label } from "@/components/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAlunoContext } from "@/context/AlunoContext";

type RegisterFormData = {
  foto: FileList;
  id: string;
  nome: string;
  email: string;
  password: string;
  dateNascimento: string;
  genero: "Masculino" | "Feminino" | "Outro";
  celular: string;
  altura: string;
  objetivo: string;
  peso: string;
  condicaoMedica: string;
  historicoLesao: string;
  nivelAtividade: "Sedentário" | "Moderado" | "Ativo";
};

export default function AtualizarAluno() {
  const { state } = useAlunoContext();
  const [formulario, setFormulario] = useState(false);
  const [foto, setFoto] = useState("/perfil-sem-foto.png");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      id: "",
      nome: "",
      email: "",
      password: "",
      dateNascimento: "",
      genero: "Outro",
      celular: "",
      altura: "",
      objetivo: "",
      peso: "",
      condicaoMedica: "",
      historicoLesao: "",
      nivelAtividade: "Sedentário",
    },
  });

  useEffect(() => {
    async function fetchAlunos() {
      try {
        const response = await getAluno(Number(state.id));

        // Converte a data para o formato yyyy-MM-dd
        const dados = {
          ...response,
          id: String(response.id),
          dateNascimento: response.dateNascimento?.split("T")[0], // pega só a parte da data
        };

        if (dados.AlunoFotos && dados.AlunoFotos.length > 0) {
          const urlFotos = `/api/proxy/images/${dados.AlunoFotos.at(-1)?.filename}`;
          setFoto(urlFotos);
        }
        reset(dados);
        setFormulario(true);
        // localStorage.setItem("email", dados.email);
      } catch (error) {
        console.error("Erro ao buscar aluno:", error);
      }
    }

    fetchAlunos();
  }, [state.id, reset]);

  async function onSubmit(data: RegisterFormData) {
    try {
      const alunoAtualizado = {
        ...data,
        id: state.id, // fallback caso algo falhe
      };
      await updateAluno(alunoAtualizado);

      if (data.foto && data.foto.length > 0) {
        const fotoRequests = {
          aluno_id: state.id,
          foto: data.foto,
        };
        await createFoto(fotoRequests);
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }

  return (
    <>
      <div className="flex w-full max-w-md flex-col p-10 text-white">
        <h2 className="mb-2 text-2xl font-bold">Meu perfil </h2>
        <p className="mb-6 text-sm">Mantenha suas informações atualizadas</p>
        <hr className="mb-6 border-gray-400" />
        {!formulario && <h1>Carregando os dados...</h1>}
        {formulario && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-4 border-orange-500">
                <Image
                  src={foto}
                  alt="Foto"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <Input
                {...register("foto")}
                type="file"
                accept="image/*"
                className="mt-4 rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                {...register("nome")}
                id="nome"
                placeholder="Digite seu nome"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Digite sua senha"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="dateNascimento">Data de nascimento</Label>
              <Input
                {...register("dateNascimento")}
                type="date"
                id="dateNascimento"
                placeholder="Digite sua data de nascimento"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="genero">Gênero</Label>
              <select
                {...register("genero")}
                id="genero"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-gray-400"
              >
                <option value="">Selecione</option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <Label htmlFor="celular">Celular</Label>
              <Input
                {...register("celular")}
                id="celular"
                placeholder="Digite seu celular"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <hr className="my-6 border-gray-400" />

            <div>
              <Label htmlFor="altura">Altura</Label>
              <Input
                {...register("altura")}
                id="altura"
                placeholder="Digite sua altura"
                step="0.01"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="objetivo">Objetivo</Label>
              <Input
                {...register("objetivo")}
                id="objetivo"
                placeholder="Digite seu objetivo"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="peso">Peso</Label>
              <Input
                {...register("peso")}
                id="peso"
                placeholder="Digite seu peso"
                step="0.01"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="condicaoMedica">Condição Médica</Label>
              <Input
                {...register("condicaoMedica")}
                id="condicaoMedica"
                placeholder="Digite sua condição médica"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="historicoLesao">Histórico de Lesão</Label>
              <Input
                {...register("historicoLesao")}
                id="historicoLesao"
                placeholder="Digite seu histórico de lesão"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="nivelAtividade">Nível de Atividade</Label>
              <select
                {...register("nivelAtividade")}
                id="nivelAtividade"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-gray-400"
              >
                <option value="">Selecione</option>
                <option value="Sedentário">Sedentário</option>
                <option value="Moderado">Moderado</option>
                <option value="Ativo">Ativo</option>
              </select>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-orange-400 p-3 font-semibold text-white hover:bg-orange-500"
              >
                {isSubmitting ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
