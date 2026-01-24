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
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "@/constants";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true


const formSchema = z.object({
  name: z.string().min(2, "Name has to be at least 2 characters."),
  email: z.string().email("Invalid email address"),
  phonenumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phonenumber: "",
        },
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        setLoading(true);
        const response = await axios.post(`${backendUrl}/users/register`, values);
        if (response.data.success) {
            toast.success("You can now start booking");
            form.reset();

            // Automatically log in the user
            const loginRes = await axios.post(`${backendUrl}/users/login`, {
                phonenumber: values.phonenumber,
            });

            if (loginRes.data.success) {
                const { data } = loginRes.data;
                Cookies.set("token", data);
                Cookies.set("role", loginRes.data.role);
                Cookies.set("control", loginRes.data.control);

                // Navigate to the correct appointment page
                navigate(`/${loginRes.data.control}/appointments`);
            } else {
                toast.error("Auto-login failed. Please login manually.");
                navigate(`/login`);
            }
        } else {
            toast.error(response.data.message || "Registration failed");
        }
    } catch (error: any) {
        toast.error(error.message || "An error occurred while registering");
    } finally {
        setLoading(false);
    }
  }
  return (
    <div className="h-screen flex items-center justify-center bg-primary">
      <div className="bg-white rounded p-5 flex flex-col gap-3 border w-[500px]">
        <h1 className="text-secondary text-xl font-bold uppercase">
          Register a New Account
        </h1>
        <hr className="border-gray-300" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Ex. John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phonenumber"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g. 5204512799" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <div className="flex justify-between items-center">
                            <h1 className="flex gap-5 text-sm text-secondary items-center font-semibold">
                            Already booked before?{" "}
                            <Link
                                to="/login"
                                className="text-secondary underline font-semibold"
                            >
                                Check Here!
                            </Link>
                            </h1>
                            <Button className="bg-secondary text-black-100 cursor-pointer font-bold" type="submit" disabled={loading}>
                            Submit
                            </Button>
                        </div>
                    </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
