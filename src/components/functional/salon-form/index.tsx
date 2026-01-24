import type { ISalon } from "@/interfaces";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { backendUrl, daysList } from "@/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import { useNavigate } from "react-router";
import LocationSelection from "../location-selection";
axios.defaults.withCredentials = true;

// ✅ Stronger zod schema aligned with ISalon
const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    address: z.string().min(1, "Address is required."),
    phonenumber: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    city: z.string().min(1, "City is required."),
    state: z.string().min(1, "State is required."),
    zip: z.string().min(1, "Zip code is required."),
    minimumServicePrice: z.number().min(0, "Minimum service price must be at least 0"),
    maximumServicePrice: z.number().min(0, "Maximum service price has to be at least 0"),
    workingDays: z.array(z.string()).min(1, "At least 1 work day is required"),
    schedule: z.record(
        z.string(),
        z.object({
            startTime: z.string(),
            endTime: z.string(),
        })
    ),
    workers: z.record(
        z.string(),
        z.object({
            name: z.string(),
            workDay: z.record(z.string(), z.boolean()),
        })
    ).optional(),
    locationInMap: z.any().optional(), // ✅ loosely typed
});

type FormSchema = z.infer<typeof formSchema>;

function SalonForm({
    formType,
    initialValues,
}: {
    formType: "add" | "edit";
    initialValues?: Partial<ISalon>;
}) {
    const initialSchedule = initialValues?.schedule || {};
    const [loading, setLoading] = useState(false);
    const { user } = usersGlobalStore() as IUsersStore;
    const [selectedLocationObject, setSelectedLocationObject] = useState<any>(
        initialValues?.locationInMap || {}
    );
    const navigate = useNavigate();

    // ✅ Fill schedule with defaults for all days
    const filledSchedule = daysList.reduce((acc, day) => {
        acc[day] = initialSchedule[day] ?? {
            startTime: "closed",
            endTime: "closed",
        };
        return acc;
    }, {} as Record<string, { startTime: string; endTime: string }>);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialValues?.name || "",
            address: initialValues?.address || "",
            phonenumber: initialValues?.phonenumber || "",
            city: initialValues?.city || "",
            state: initialValues?.state || "",
            zip: initialValues?.zip || "",
            minimumServicePrice: initialValues?.minimumServicePrice || 0,
            maximumServicePrice: initialValues?.maximumServicePrice || 0,
            workingDays: initialValues?.workingDays || [],
            schedule: filledSchedule,
            workers: initialValues?.workers || {},
            locationInMap: initialValues?.locationInMap || {},
        },
    });

    async function onSubmit(values: FormSchema) {
        try {
            setLoading(true);
            const payload: ISalon = {
                ...values,
                locationInMap: selectedLocationObject,
                owner: user?._id,
                workers: {}
            };

            let response = null;
            if (formType === "add") {
                response = await axios.post(`${backendUrl}/salons/create-salon`, payload);
            } else if (formType === "edit" && initialValues?._id) {
                response = await axios.put(
                    `${backendUrl}/salons/update-salon-by-id/${initialValues._id}`,
                    payload
                );
            }

            if (!response?.data.success) {
                throw new Error(response?.data.message || "Failed to create Salon");
            }

            toast.success(
                formType === "add"
                    ? "Salon created successfully!"
                    : "Salon updated successfully!"
            );
            navigate("/owner/salons");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const handleDayChange = (day: string) => {
        let daysSelected = form.getValues("workingDays");
        let currentSchedule = { ...form.getValues("schedule") };

        if (daysSelected.includes(day)) {
            daysSelected = daysSelected.filter((d) => d !== day);
            currentSchedule[day] = { startTime: "closed", endTime: "closed" };
        } else {
            daysSelected.push(day);
            if (
                !currentSchedule[day] ||
                currentSchedule[day].startTime === "closed" ||
                currentSchedule[day].endTime === "closed"
            ) {
                currentSchedule[day] = { startTime: "", endTime: "" };
            }
        }

        form.setValue("workingDays", daysSelected, {
            shouldValidate: true,
            shouldDirty: true,
        });
        form.setValue("schedule", currentSchedule, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <div className="mt-7">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(
                        onSubmit,
                        (errors) => console.log("Validation errors:", errors)
                    )}
                    className="space-y-8"
                >
                    {/* --- Name --- */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex. Peak Nails" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Address --- */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="1989 W Nothing Happened St."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Phone --- */}
                    <FormField
                        control={form.control}
                        name="phonenumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex. 5202037700" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- City, State, Zip --- */}
                    <div className="grid grid-cols-3 gap-5">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="85705" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minimumServicePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Minimum Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="20"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(Number(e.target.value))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maximumServicePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maximum Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(Number(e.target.value))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* --- Working Days --- */}
                    <div className="border p-5">
                        <h1 className="text-lg text-amber-500 font-semibold">
                            Working Days
                        </h1>
                        <div className="flex gap-7 mt-2 flex-wrap">
                            {daysList.map((day) => (
                                <div key={day} className="flex items-center gap-2">
                                    <h1>{day}</h1>
                                    <Checkbox
                                        checked={form.watch("workingDays")?.includes(day)}
                                        onCheckedChange={() => handleDayChange(day)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* --- Day schedules --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                            {form.watch("workingDays")?.map((day) => (
                                <div key={day} className="border p-4 rounded-lg">
                                    <h2 className="font-semibold mb-3">{day}</h2>
                                    <FormField
                                        control={form.control}
                                        name={`schedule.${day}.startTime`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Opening Hours</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`schedule.${day}.endTime`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Closing Hours</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Map selection --- */}
                    <LocationSelection
                        selectedLocationObject={selectedLocationObject}
                        setSelectedLocationObject={setSelectedLocationObject}
                    />

                    {/* --- Buttons --- */}
                    <div className="flex justify-end gap-5">
                        <Button
                            disabled={loading}
                            variant="outline"
                            onClick={() => {
                                form.reset();
                                navigate(-1);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            type="submit"
                            className="bg-amber-950 text-gray-300"
                        >
                            {formType === "add" ? "Add Salon" : "Update Salon"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default SalonForm;
