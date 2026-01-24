import type { IService } from "@/interfaces";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { backendUrl } from "@/constants";

axios.defaults.withCredentials = true;

const formSchema = z.object({
    mainServiceName: z.string().min(1, "Main service name is required"),
    subservices: z.array(
        z.object({
            name: z.string().min(1, "Subtype name is required"),
            description: z.string().min(1, "Subtype description is required"),
        })
    ).nonempty("At least one subtype is required"),
    isAvailable: z.boolean().default(true),
    cost: z.number().min(0, "Cost must be a positive number").default(0),
});

function ServiceForm({ formType, initialValues }: { formType: 'add' | 'edit'; initialValues?: Partial<IService>; }) {
    const [mainServiceName, setMainServiceName] = useState("");
    const [subservices, setSubservices] = useState<{ id: string; name: string; description: string }[]>([]);
    const [newSubtypeName, setNewSubtypeName] = useState("");
    const [newSubtypeDesc, setNewSubtypeDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = usersGlobalStore() as IUsersStore;
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mainServiceName: "",
            subservices: [],
            isAvailable: initialValues?.isAvailable ?? true,
            cost: initialValues?.cost ?? 0,
        },
    });

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            // Prepare subservices, replace empty description with "None"
            const cleanedSubservices = subservices
                .filter(sub => sub.name && sub.name.trim())
                .map(sub => ({
                    name: sub.name.trim(),
                    description: sub.description && sub.description.trim() ? sub.description.trim() : "None",
                }));

            const payload: IService = {
                services: {
                    [mainServiceName.trim()]: cleanedSubservices,
                },
                cost: values.cost,
                isAvailable: values.isAvailable,
                owner: user?._id,
            };

            let response = null;
            if (formType === "add") {
                console.log(payload)
                response = await axios.post(`${backendUrl}/services/create-service`, payload);
            } else if (formType === "edit") {
                response = await axios.put(`${backendUrl}/services/update-service-by-id/${initialValues?._id}`, payload);
            }

            if (!response?.data.success) {
                throw new Error(response?.data.message || "Failed to create service");
            }
            toast.success(formType === "add" ? "Service created successfully!" : "Service updated successfully!");
            navigate("/owner/services");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onAddNewSubtype = () => {
        if (!newSubtypeName.trim()) return;
        setSubservices(prev => [
            ...prev,
            {
                id: uuidv4(),
                name: newSubtypeName.trim(),
                description: newSubtypeDesc.trim(),
            },
        ]);
        setNewSubtypeName("");
        setNewSubtypeDesc("");
    };

    const onRemoveSubtype = (subtypeId: string) => {
        setSubservices(prev => prev.filter(sub => sub.id !== subtypeId));
    };

    useEffect(() => {
        if (initialValues) {
            // Get the first main service name and its subservices from initialValues
            const mainServiceKey = initialValues.services ? Object.keys(initialValues.services)[0] : "";
            setMainServiceName(mainServiceKey);
            setSubservices(
                initialValues.services && mainServiceKey
                    ? initialValues.services[mainServiceKey].map(sub => ({
                        id: uuidv4(),
                        name: sub.name,
                        description: sub.description,
                    }))
                    : []
            );
        }
    }, [initialValues]);

    return (
        <div className="mt-7">
            <Form {...form}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await onSubmit({
                            mainServiceName,
                            subservices,
                            isAvailable: form.getValues("isAvailable"),
                            cost: form.getValues("cost"),
                        });
                    }}
                    className="space-y-8"
                >
                    <FormItem>
                        <FormLabel>Main Service Name</FormLabel>
                        <input
                            type="text"
                            value={mainServiceName}
                            onChange={e => setMainServiceName(e.target.value)}
                            placeholder="Main service name"
                            className="border p-1 rounded w-full"
                        />
                        <FormMessage />
                    </FormItem>

                    <FormItem>
                        <FormLabel>Subservices</FormLabel>
                        <div className="space-y-2">
                            {subservices.map(({ id, name, description }) => (
                                <div key={id} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setSubservices(subs =>
                                            subs.map(sub =>
                                                sub.id === id ? { ...sub, name: e.target.value } : sub
                                            )
                                        )}
                                        placeholder="Subtype name"
                                        className="border p-1 rounded flex-grow"
                                    />
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={e => setSubservices(subs =>
                                            subs.map(sub =>
                                                sub.id === id ? { ...sub, description: e.target.value } : sub
                                            )
                                        )}
                                        placeholder="Subtype description"
                                        className="border p-1 rounded flex-grow"
                                    />
                                    <Button type="button" variant="ghost" onClick={() => onRemoveSubtype(id)}>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newSubtypeName}
                                    placeholder="New subtype name"
                                    onChange={e => setNewSubtypeName(e.target.value)}
                                    className="border p-1 rounded flex-grow"
                                />
                                <input
                                    type="text"
                                    value={newSubtypeDesc}
                                    placeholder="New subtype description"
                                    onChange={e => setNewSubtypeDesc(e.target.value)}
                                    className="border p-1 rounded flex-grow"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={onAddNewSubtype}
                                    disabled={!newSubtypeName.trim()}
                                >
                                    Add Subservice
                                </Button>
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="isAvailable"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Available</FormLabel>
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost</FormLabel>
                                <input
                                    type="number"
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="border p-1 rounded w-full"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="bg-amber-950 text-gray-300 mt-6"
                        disabled={loading}
                    >
                        {formType === "add" ? "Add Service" : "Update Service"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default ServiceForm;