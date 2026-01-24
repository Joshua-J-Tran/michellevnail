/* imports */
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { daysList, backendUrl } from "@/constants";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import toast from "react-hot-toast";
import { type IWorker } from "@/interfaces";
import { useNavigate } from "react-router";

axios.defaults.withCredentials = true;


interface IService {
    _id: string;
    owner: string;
    services: Record<
        string,
        { name: string; description?: string }[]
    >; // Map of main service => subservices
    cost: number;
    isAvailable: boolean;
}

type WorkerFormValues = {
    name: string;
    salon: string;        // Only the ID
    services: string[];
    workingDays: string[];
    isActive: boolean;
};


export default function WorkerForm({
    formType,
    initialValues,
    onSuccess,
}: {
    formType: "add" | "edit";
    initialValues?: Partial<IWorker>;
    onSuccess?: () => void;
}) {
    const [salons, setSalons] = useState<any[]>([]);
    const [servicesMap, setServicesMap] = useState<Record<string, IService>>(
        {}
    );
    const { user } = usersGlobalStore() as IUsersStore;
    const navigate = useNavigate();

    const form = useForm<WorkerFormValues>({
        defaultValues: {
            name: initialValues?.name ?? "",
            salon:
                typeof initialValues?.salon === "string"
                    ? initialValues.salon
                    : initialValues?.salon?._id ?? "", // <- convert object to ID
            services: initialValues?.services ?? [],
            workingDays: initialValues?.workingDays ?? [],
            isActive: initialValues?.isActive ?? true,
        },
    });

    // fetch salons
    useEffect(() => {
        axios
            .get(`${backendUrl}/salons/get-salons-by-owner`)
            .then((res) => {
                if (res.data.success) setSalons(res.data.data);
            })
            .catch((err) => console.error(err));
    }, []);

    // fetch services
    useEffect(() => {
        axios
            .get(`${backendUrl}/services/get-services-by-owner`)
            .then((res) => {
                if (res.data.success) {
                    const map: Record<string, IService> = {};
                    res.data.data.forEach((s: IService) => (map[s._id] = s));
                    setServicesMap(map);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const onSubmit = async (values: WorkerFormValues) => {
        const payload: IWorker = {
            ...values,
            salon: values.salon,  // string ID, backend can resolve to ISalon if needed
            owner: user?._id ?? "",
            _id: initialValues?._id,
        };

        try {
            let res;
            if (formType === "edit" && initialValues?._id) {
                res = await axios.put(
                    `${backendUrl}/workers/update-worker-by-id/${initialValues._id}`,
                    payload
                );
            } else {
                res = await axios.post(`${backendUrl}/workers/create-worker`, payload);
            }

            if (res.data.success) {
                toast.success(formType === "edit" ? "Worker updated successfully!" : "Worker created successfully!");
                form.reset();
                onSuccess?.();
                navigate(`/owner/workers`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error saving worker");
        }
    };


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-4 bg-white shadow rounded-2xl"
            >
                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Worker Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter worker's name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Salon */}
                <FormField
                    control={form.control}
                    name="salon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assign to Salon</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select salon" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {salons.map((salon) => (
                                        <SelectItem key={salon._id} value={salon._id}>
                                            {salon.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Services */}
                <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Services</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(servicesMap).map((service) =>
                                    Object.keys(service.services).map((mainServiceName) => (
                                        <label
                                            key={`${service._id}-${mainServiceName}`}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={field.value?.includes(mainServiceName)}
                                                onCheckedChange={(checked) => {
                                                    const updated = checked
                                                        ? [...field.value, mainServiceName]
                                                        : field.value.filter((v) => v !== mainServiceName);
                                                    field.onChange(updated);
                                                }}
                                            />
                                            {mainServiceName}
                                        </label>
                                    ))
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Working Days */}
                <FormField
                    control={form.control}
                    name="workingDays"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Working Days</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                                {daysList.map((day) => (
                                    <label key={day} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={field.value?.includes(day)}
                                            onCheckedChange={(checked) => {
                                                const updated = checked
                                                    ? [...field.value, day]
                                                    : field.value.filter((d) => d !== day);
                                                field.onChange(updated);
                                            }}
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {formType === "edit" ? "Update Worker" : "Create Worker"}
                </Button>
            </form>
        </Form>
    );
}
