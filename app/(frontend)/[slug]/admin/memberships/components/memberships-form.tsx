"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MembershipStatus } from "@/server/domain/entities/Membership";
import { MemberCombobox } from "./member-combobox";

const membershipFormSchema = z.object({
    memberId: z.string().min(1, "Miembro requerido"),
    planId: z.string().min(1, "Plan requerido"),
    startDate: z.string().min(1, "Fecha de inicio requerida"),
    pricePaid: z.coerce.number().min(0, "El precio no puede ser negativo"),
    status: z.nativeEnum(MembershipStatus).default(MembershipStatus.PENDING),
});

type MembershipFormValues = z.infer<typeof membershipFormSchema>;

interface Member {
    id: string;
    firstName: string;
    lastName: string;
}

interface Plan {
    id: string;
    name: string;
    price: number;
    durationDays: number;
}

interface MembershipFormProps {
    initialData?: {
        id: string;
        memberId: string;
        planId: string;
        startDate: Date;
        endDate: Date;
        pricePaid: number;
        status: string;
        member?: { firstName: string; lastName: string };
    };
    isEdit?: boolean;
    redirectUrl: string;
    plans: Plan[];
}

export default function MembershipForm({
    initialData,
    isEdit = false,
    redirectUrl,
    plans,
}: MembershipFormProps) {
    const router = useRouter();

    // Initial member for edit mode
    const initialMember: Member | undefined = initialData?.member
        ? { id: initialData.memberId, firstName: initialData.member.firstName, lastName: initialData.member.lastName }
        : undefined;

    const form = useForm<MembershipFormValues>({
        resolver: zodResolver(membershipFormSchema),
        defaultValues: {
            memberId: initialData?.memberId || "",
            planId: initialData?.planId || "",
            startDate: initialData?.startDate
                ? new Date(initialData.startDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            pricePaid: initialData?.pricePaid || 0,
            status: (initialData?.status as MembershipStatus) || MembershipStatus.PENDING,
        },
    });

    const selectedPlanId = form.watch("planId");
    const selectedPlan = plans?.find((p) => p.id === selectedPlanId);

    // Auto-fill price when plan changes
    const handlePlanChange = (planId: string) => {
        form.setValue("planId", planId);
        const plan = plans?.find((p) => p.id === planId);
        if (plan && !isEdit) {
            form.setValue("pricePaid", plan.price);
        }
    };

    const { mutate: mutateMembership, isPending } = useMutation({
        mutationFn: async (values: MembershipFormValues) => {
            // Calculate endDate based on plan duration
            const plan = plans?.find((p) => p.id === values.planId);
            const startDate = new Date(values.startDate);
            const endDate = new Date(startDate);
            if (plan) {
                endDate.setDate(endDate.getDate() + plan.durationDays);
            }

            const payload = {
                ...values,
                startDate: new Date(values.startDate),
                endDate: endDate,
            };

            if (isEdit && initialData?.id) {
                return api.patch(`/api/memberships/${initialData.id}`, payload);
            }
            return api.post("/api/memberships", payload);
        },
        onSuccess: () => {
            toast.success(
                isEdit ? "Membresía actualizada correctamente" : "Membresía creada con éxito"
            );
            router.refresh();
            router.push(redirectUrl);
        },
        onError: (error) => {
            if (error instanceof ApiError && error.code === "VALIDATION_ERROR" && error.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    form.setError(field as keyof MembershipFormValues, {
                        type: "server",
                        message: messages[0],
                    }, { shouldFocus: true });
                });
                toast.error("Revisa los errores marcados en rojo.");
            } else {
                toast.error(error.message || "Error al guardar");
            }
        },
    });

    const onSubmit = (values: MembershipFormValues) => {
        mutateMembership(values);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Información de la Membresía</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <Controller
                        name="memberId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel required>Miembro</FieldLabel>
                                <MemberCombobox
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isEdit}
                                    initialMember={initialMember}
                                />
                                {fieldState.invalid && fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="planId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel required>Plan</FieldLabel>
                                <Select
                                    onValueChange={handlePlanChange}
                                    value={field.value}
                                >
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Selecciona un plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plans?.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.name} - S/ {plan.price} ({plan.durationDays} días)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="startDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel required>Fecha de Inicio</FieldLabel>
                                <Input
                                    type="date"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="pricePaid"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel required>Precio Pagado</FieldLabel>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="0"
                                    {...field}
                                />
                                {fieldState.invalid && fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="status"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Estado</FieldLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Selecciona" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pendiente</SelectItem>
                                        <SelectItem value="ACTIVE">Activa</SelectItem>
                                        <SelectItem value="EXPIRED">Vencida</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {selectedPlan && (
                        <div className="md:col-span-2 p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                <strong>Plan seleccionado:</strong> {selectedPlan.name} -
                                Duración: {selectedPlan.durationDays} días
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

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
                    {isEdit ? "Guardar Cambios" : "Crear Membresía"}
                </Button>
            </div>
        </form>
    );
}
