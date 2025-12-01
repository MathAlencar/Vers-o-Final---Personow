"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import createPersonalFoto from "@/app/http/personal/create-foto-personal";
import getPersonal from "@/app/http/personal/get-personal";
import updatePersonal from "@/app/http/personal/update-personal";
import { alertError, alertSuccess } from "@/components/alert";
import { Label } from "@/components/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePersonalContext } from "@/context/PersonalContext";

type PersonalFormData = {
  foto: FileList;
  id: string;
  nome: string;
  experiencia: string;
  cidade: string;
  profissao: string;
  formacao: string;
  areaAtuacao: string;
  modeloAtendimento: string;
  descricao: string;
};

export default function AtualizarPersonal() {
  const { state } = usePersonalContext();
  const [formulario, setFormulario] = useState(false);
  const [foto, setFoto] = useState("/perfil-sem-foto.png");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PersonalFormData>({
    defaultValues: {
      id: "",
      nome: "",
      experiencia: "",
      cidade: "",
      profissao: "",
      formacao: "",
      areaAtuacao: "",
      modeloAtendimento: "",
      descricao: "",
    },
  });

  useEffect(() => {
    async function fetchPersonal() {
      try {
        if (state.id == 0) return;
        const response = await getPersonal(state.id.toString());
        const dados = { ...response, id: String(response.id) };

        if (dados.PersonalFotos && dados.PersonalFotos.length > 0) {
          const urlFotos = `/api/proxy/images/${dados.PersonalFotos.at(-1)?.filename}`;
          setFoto(urlFotos);
        }
        reset(dados);
        setFormulario(true);
      } catch (error) {
        console.error("Erro ao buscar personal:", error);
      }
    }

    fetchPersonal();
  }, [state.id, reset]);

  async function onSubmit(data: PersonalFormData) {
    try {
      const personalAtualizado = { ...data, id: state.id };
      await updatePersonal(personalAtualizado);

      if (data.foto && data.foto.length > 0) {
        const fotoRequests = {
          personal_id: state.id,
          foto: data.foto,
        };
        await createPersonalFoto(fotoRequests);
      }
      alertSuccess("Perfil atualizado com sucesso!");
    } catch {
      alertError("Falha na atualização.");
    }
  }

  return (
    <div className="flex w-full max-w-3xl flex-col p-10 text-purple-900">
      <h2 className="mb-2 text-2xl font-bold">Meu perfil</h2>
      <p className="mb-6 text-sm">Mantenha suas informações atualizadas</p>
      <hr className="mb-6 border-gray-400" />

      {!formulario && <h1>Carregando os dados...</h1>}

      {formulario && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
              className="mt-4 rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-purple-900" htmlFor="nome">
                Nome completo
              </Label>
              <Input
                {...register("nome")}
                id="nome"
                placeholder="Digite seu nome"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="text-purple-900" htmlFor="experiencia">
                Experiência
              </Label>
              <Input
                {...register("experiencia")}
                id="experiencia"
                placeholder="Descreva sua experiência"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="text-purple-900" htmlFor="cidade">
                Cidade
              </Label>
              <Input
                {...register("cidade")}
                id="cidade"
                placeholder="Digite sua cidade"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="text-purple-900" htmlFor="profissao">
                Profissão
              </Label>
              <Input
                {...register("profissao")}
                id="profissao"
                placeholder="Digite sua profissão"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="text-purple-900" htmlFor="formacao">
                Formação
              </Label>
              <Input
                {...register("formacao")}
                id="formacao"
                placeholder="Digite sua formação"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="text-purple-900" htmlFor="areaAtuacao">
                Área de Atuação
              </Label>
              <Input
                {...register("areaAtuacao")}
                id="areaAtuacao"
                placeholder="Digite sua área de atuação"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label className="text-purple-900" htmlFor="modeloAtendimento">
                Modelo de Atendimento
              </Label>
              <Input
                {...register("modeloAtendimento")}
                id="modeloAtendimento"
                placeholder="Presencial, Online..."
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-purple-900" htmlFor="descricao">
                Descrição
              </Label>
              <textarea
                {...register("descricao")}
                id="descricao"
                placeholder="Escreva uma descrição sobre você"
                className="w-full rounded border border-orange-400 bg-transparent p-2 text-black placeholder:text-gray-500"
                rows={4}
              />
            </div>
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
  );
}
