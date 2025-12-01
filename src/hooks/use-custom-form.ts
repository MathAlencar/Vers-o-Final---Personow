import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ZodType } from "zod";

type UseCustomFormOptions<T extends FieldValues> = {
  schema: ZodType<T>;
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
};

export function useCustomForm<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
}: UseCustomFormOptions<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { handleSubmit, ...methods } = form;

  return {
    ...methods,
    submitHandler: handleSubmit(onSubmit),
  };
}
