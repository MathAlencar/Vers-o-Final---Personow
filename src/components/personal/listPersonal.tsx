import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getAllPersonalResponse } from "@/app/http/personal/get-all-personal";

type ListPersonalProps = {
  personals: getAllPersonalResponse[];
};

export function ListPersonal({ personals }: ListPersonalProps) {
  return (
    <>
      {personals.map((personal) => (
        <Link key={personal.id} href={`/alunos/personal/${personal.id}`}>
          <div className="my-3 grid h-20 grid-flow-col grid-rows-1 items-center rounded-[15px] bg-purple-800 text-gray-200 lg:w-1/2">
            <div className="row-span-2 mr-2 flex justify-center text-sm text-orange-500">
              <div className="relative h-[70px] w-[70px] overflow-hidden rounded-full border-2 border-orange-500">
                <Image
                  src={
                    Array.isArray(personal.PersonalFotos) &&
                    personal.PersonalFotos.length > 0
                      ? `/api/proxy/images/${personal.PersonalFotos.at(-1)?.filename}`
                      : "/perfil-sem-foto.png"
                  }
                  alt="Foto"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <div className="col-span-2 flex w-28 max-w-[240px] flex-col items-start sm:w-60">
              <h2 className="line-clamp-1 break-words text-base text-gray-200">
                {personal.nome}
              </h2>
              <span className="line-clamp-1 break-words text-sm text-gray-400">
                {personal.profissao}
              </span>
              <span className="line-clamp-1 break-words text-sm text-gray-400">
                {personal.cidade}
              </span>
            </div>

            <div className="row-span-2 flex justify-center text-orange-500">
              <ChevronRightIcon className="size-6 sm:size-10" />
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
