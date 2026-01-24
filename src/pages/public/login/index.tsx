/* import shit here */
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Link, useNavigate} from "react-router"
import validator from "validator";
import {useState} from "react";
import toast from 'react-hot-toast';
import axios from 'axios';
import {backendUrl} from "@/constants";
import Cookies from "js-cookie";
import { trueKey } from "@/constants";


axios.defaults.withCredentials = true


const formSchema = z.object({
    phonenumber: z.string().refine(validator.isMobilePhone),
})


function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [_control, setControl] = useState<"user" | "owner" | null>(null);
    const [showPasswordStep, setShowPasswordStep] = useState(false);
    const [ownerPassword, setOwnerPassword] = useState("");
    const [tempOwnerAuth, setTempOwnerAuth] = useState<{ token: string, role: string, control: string } | null>(null);
    const navigate = useNavigate();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phonenumber: "",
        },
    })

    function handleOwnerPasswordSubmit(e: React.FormEvent) {
        e.preventDefault();

        // You can store the actual password in .env on backend and verify via API
        const correctPassword = trueKey; // TEMP — don't hardcode in production!

        if (ownerPassword === correctPassword) {
            if (tempOwnerAuth) {
                Cookies.set("token", tempOwnerAuth.token);
                Cookies.set("role", tempOwnerAuth.role);
                Cookies.set("control", tempOwnerAuth.control);
            }
            toast.success("Owner login successful!");
            navigate(`/owner/dashboard`)
        } else {
            toast.error("Incorrect owner password.");
            navigate(`/login`)
        }
    }

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/users/login`, values);
            if(!response.data.success) {
                throw new Error(response.data.message || "Login Failed");
            }

            const {data} = response.data;
            
            toast.success("Login Successful!")
            if (response.data.control === "owner") {
            // Show the password step instead of navigating
                setControl(response.data.control);
                setTempOwnerAuth({ token: data, role: response.data.role, control: response.data.control });
                setShowPasswordStep(true);
                toast.success("Owner detected. Please enter your secret password.");
            } else {
                Cookies.set("token", data);
                Cookies.set("role", response.data.role);
                Cookies.set("control", response.data.control);
                toast.success("Login Successful!");
                navigate(`/${response.data.control}/appointments`);
            }
        } catch (error:any) {
            toast.error(error.message || "What the f did you do?")
        } finally {
            setLoading(false);
        }
        
        console.log(values)
    }

    return (
        <div className="h-screen flex items-center justify-center bg-primary">
            <div className="bg-white rounded p-5 flex flex-col gap-3 border w-[600px]">
                <h1 className="text-secondary text-xl font-bold uppercase">
                    Manage your appointments
                </h1>
                <hr className="border-gray-300" />

                <Form {...form}>
                    {!showPasswordStep ? (
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="phonenumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center">
                            <h1 className="flex gap-5 text-sm text-black-100 items-center font-semibold">
                                Don't have an appointment?{" "}
                                <Link to="/register" className="text-primary-500 underline">
                                    Start Here!
                                </Link>
                            </h1>
                            <Button className="bg-secondary text-black-100 cursor-pointer font-bold" type="submit" disabled={loading}>Start Booking</Button>
                            </div>

                        </form>
                    ) : (
                        <form onSubmit={handleOwnerPasswordSubmit} className="space-y-8">
                            <FormItem>
                                <FormLabel>Owner Secret Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter Secret Password"
                                        value={ownerPassword}
                                        onChange={(e) => setOwnerPassword(e.target.value)}
                                    />
                                </FormControl>
                            </FormItem>
                            <Button type="submit">Access Owner Dashboard</Button>
                        </form>
                    )}
                </Form>
            </div>
        </div>
    )
}

export default LoginPage