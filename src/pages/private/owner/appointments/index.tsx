import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { type IAppointment, type IUser } from "@/interfaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "@/constants";
import Spinner from "@/components/ui/spinner";
import InfoMessage from "@/components/ui/info-message";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CheckCheck, Trash2 } from "lucide-react";

axios.defaults.withCredentials = true; // always send cookies

function OwnerAppointmentsPage() {

    const [workerNames, setWorkerNames] = useState<Record<string, string>>({});
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${backendUrl}/appointments/get-appointment-by-owner`
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            const data = response.data.data;
            setAppointments(data);
            await fetchWorkerNames(data);

        } catch (error: any) {
            setAppointments([]);
            toast.error(error?.response?.data?.message || "Unable to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleCancel = async (appointmentId: string) => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${backendUrl}/appointments/update-appointment/${appointmentId}`,
                { status: "Cancelled" }
            );
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Appointment cancelled successfully");
            await getData();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unable to cancel appointment");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (appointmentId: string) => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${backendUrl}/appointments/update-appointment/${appointmentId}`,
                { status: "Confirmed" }
            );
            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Appointment approved successfully");
            await getData();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unable to approve appointment");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        "Salon Name",
        "Name",
        "Email",
        "Phone No.",
        "at Date",
        "at Time",
        "For",
        "With",
        "Status",
        "Booked On",
        "",
    ];

    function parseArrayToString(arr: string[]) {
        if (!arr || arr.length <= 0) {
            return "Hee-ho! Hee-ho! Hee-ho!";
        } else if (arr.length === 1) {
            return arr[0];
        } else {
            return arr.slice(0, -1).join(" + ") + " + " + arr[arr.length - 1];
        }
    }

    function parseTimetoreadableTime(time: string) {
        const time_arr = time.split("T");
        const date_part = time_arr[0];
        const time_part = time_arr[1]?.split(".") ?? [];
        return `${date_part} at ${time_part[0] || ""}`;
    }

    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    function fromDateToWeekDate(date: string) {
        const actualDate = new Date(date);
        const dayNumber = actualDate.getDay();
        return daysOfWeek[dayNumber];
    }

    function fromYMDtoMDY(date: string) {
        const dateParts = date.split("-");
        if (dateParts.length !== 3) {
            return date;
        } else {
            const [year, month, day] = dateParts;
            return `${month}/${day}/${year}`;
        }
    }

    async function fetchWorkerNames(appts: IAppointment[]) {
        const names: Record<string, string> = {};
        for (const appt of appts) {
            const workerId = appt.worker as string;
            if (!workerId || workerId === "random") {
                names[appt._id] = "Any Available Worker";
            } else {
                try {
                    const response = await axios.get(`${backendUrl}/workers/get-worker-by-id/${workerId}`);
                    names[appt._id] = response.data.success ? response.data.data.name : "Any Available Worker";
                } catch {
                    names[appt._id] = "Any Available Worker";
                }
            }
        }
        setWorkerNames(names);
    }

    return (
        <div>
            <PageTitle title="Appointments" />
            {loading ? (
                <Spinner />
            ) : appointments.length <= 0 ? (
                <InfoMessage message="No appointments found" />
            ) : (
                <div className="mt-7">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead
                                        key={index}
                                        className="text-left font-bold text-yellow-900"
                                    >
                                        {column}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appointment) => {
                                const user = appointment.user as IUser | string;

                                return (
                                    <TableRow key={appointment._id}>
                                        <TableCell className="font-semibold">
                                            {appointment.salon.name}
                                        </TableCell>

                                        <TableCell className="font-semibold">
                                            {typeof user === "string" ? "N/A" : user.name}
                                        </TableCell>

                                        <TableCell className="font-semibold">
                                            {typeof user === "string" ? "N/A" : user.email}
                                        </TableCell>

                                        <TableCell className="font-semibold">
                                            {typeof user === "string" ? "N/A" : user.phonenumber}
                                        </TableCell>

                                        <TableCell>
                                            <strong className="font-bold">
                                                {fromDateToWeekDate(appointment.appointmentDate)}
                                            </strong>
                                            , {fromYMDtoMDY(appointment.appointmentDate)}
                                        </TableCell>

                                        <TableCell>{appointment.appointmentTime}</TableCell>
                                        <TableCell>{parseArrayToString(appointment.services)}</TableCell>
                                        <TableCell>{workerNames[appointment._id] || "Loading..."}</TableCell>
                                        <TableCell>{appointment.status}</TableCell>
                                        <TableCell>
                                            {appointment.createdAt
                                                ? parseTimetoreadableTime(appointment.createdAt)
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-3">
                                                {appointment._id && (
                                                    <>
                                                        <Button
                                                            size={"icon"}
                                                            title="Approve"
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                handleApprove(appointment._id!)
                                                            }
                                                        >
                                                            <CheckCheck size={16} />
                                                        </Button>

                                                        <Button
                                                            size={"icon"}
                                                            title="Cancel"
                                                            className="cursor-pointer"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleCancel(appointment._id!)
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default OwnerAppointmentsPage;
