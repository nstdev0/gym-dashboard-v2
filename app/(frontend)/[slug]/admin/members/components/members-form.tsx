"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateMemberSchema } from "@/server/application/dtos/members.dto";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Member } from "@/server/domain/entities/Member";

type MemberFormProps = {
  initialData?: Member;
  isEdit?: boolean;
  redirectUrl?: string;
};

export default function MemberForm({
  initialData,
  isEdit = false,
  redirectUrl,
}: MemberFormProps) {
  const router = useRouter();

  // 1. Configuración del Formulario
  const form = useForm<z.infer<typeof CreateMemberSchema>>({
    resolver: zodResolver(CreateMemberSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      docType: (initialData?.docType as any) || "DNI",
      docNumber: initialData?.docNumber || "",
      gender: (initialData?.gender as any) || "MALE",
      isActive: initialData?.isActive ?? true,
      birthDate: initialData?.birthDate ? new Date(initialData.birthDate) : undefined,
      height: initialData?.height ?? undefined,
      weight: initialData?.weight ?? undefined,
      imc: initialData?.imc ?? undefined,
      image: initialData?.image || "",
    },
  });

  // 2. Mutación (Conexión con Backend)
  const { mutate: mutateMember, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof CreateMemberSchema>) => {
      // Clean Architecture: El DTO ya fue validado y transformado por Zod
      if (isEdit && initialData?.id) {
        return api.patch(`/api/members/${initialData.id}`, values);
      }
      return api.post("/api/members", values);
    },
    onSuccess: () => {
      toast.success(
        isEdit ? "Miembro actualizado correctamente" : "Miembro registrado con éxito"
      );
      router.refresh(); // Refresca los Server Components (Tablas)
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    },
    onError: (error) => {
      // --- AQUÍ OCURRE LA MAGIA DEL FEEDBACK VISUAL ---
      if (error instanceof ApiError && error.code === "VALIDATION_ERROR" && error.errors) {

        // Iteramos los errores del backend y los pintamos en el input correspondiente
        Object.entries(error.errors).forEach(([field, messages]) => {
          form.setError(field as keyof z.infer<typeof CreateMemberSchema>, {
            type: "server", // Marca el error como venido del servidor
            message: messages[0], // Toma el primer mensaje del array
          });
        });

        toast.error("Hay errores en el formulario, revísalos por favor.");
      } else {
        // Errores genéricos (Red, 500, Auth)
        toast.error(error.message || "Ocurrió un error al guardar");
      }
    },
  });

  const handleSubmit = (values: z.infer<typeof CreateMemberSchema>) => {
    mutateMember(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

        {/* SECCIÓN: DATOS PERSONALES */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl><Input placeholder="Juan" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl><Input placeholder="Pérez" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Nacimiento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val ? new Date(`${val}T12:00:00`) : undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECCIÓN: CONTACTO */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="juan@ejemplo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <FormControl><Input placeholder="9..." maxLength={9} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECCIÓN: IDENTIFICACIÓN */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Identificación</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-1">
            <FormField
              control={form.control}
              name="docType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.trigger("docNumber"); // Re-valida el número al cambiar el tipo
                    }}
                    defaultValue={field.value}
                    disabled={isEdit} // Generalmente el ID no se cambia
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                      <SelectItem value="RUC">RUC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="docNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Documento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Número de documento"
                      {...field}
                      disabled={isEdit}
                      onChange={(e) => {
                        field.onChange(e);
                        // UX: Limpiar error del servidor apenas el usuario edita
                        if (form.formState.errors.docNumber?.type === 'server') {
                          form.clearErrors("docNumber");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECCIÓN: FÍSICO Y MÉDICO */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información Física</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Masculino</SelectItem>
                      <SelectItem value="FEMALE">Femenino</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Los inputs numéricos usan value="" si es undefined para evitar warnings de React */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="175"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange} // Zod coerce lo convierte
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="70.5"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Guardar Cambios" : "Registrar Miembro"}
          </Button>
        </div>
      </form>
    </Form>
  );
}