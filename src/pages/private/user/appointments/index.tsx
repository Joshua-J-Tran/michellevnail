import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { type IAppointment } from "@/interfaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
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
import { Trash2 } from "lucide-react";

axios.defaults.withCredentials = true;

function UserAppointmentsPage() {
    
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [workerNames, setWorkerNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    // Fetch appointments
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/appointments/get-appointments-by-user`);
            if (!response.data.success) throw new Error(response.data.message);

            setAppointments(response.data.data);
            await fetchWorkerNames(response.data.data);
        } catch (error: any) {
            setAppointments([]);
            toast.error(error?.response?.data?.message || "Unable to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    // Fetch workers for cross-referencing names


    useEffect(() => {
        getData();
    }, []);

    const handleCancel = () => {
        toast.error("Please contact the salon directly to cancel your appointment!");
        navigate("/user/salons");
    };

    const columns = [
        "Salon Name",
        "at Date",
        "at Time",
        "For",
        "With",
        "Status",
        "Booked On",
        "",
    ];

    function parseArrayTostring(arr: string[]) {
        if (!arr || arr.length <= 0) return "Hee-ho! Hee-ho! Hee-ho!";
        if (arr.length === 1) return arr[0];
        return arr.slice(0, -1).join(" + ") + " + " + arr[arr.length - 1];
    }

    function parseTimetoreadableTime(time: string | undefined) {
        if (!time) return "Find me a Jack Frost with Lucky Punch -Merope";
        let time_arr = time.split("T");
        let date_part = time_arr[0];
        let time_part = time_arr[1].split(".");
        return `${date_part} at ${time_part[0]}`;
    }

    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    function fromDateToWeekDate(date: string) {
        const actualDate = new Date(date);
        return daysOfWeek[actualDate.getDay()];
    }

    function fromYMDtoMDY(date: string) {
        const dateParts = date.split("-");
        if (dateParts.length !== 3) return date;
        const [year, month, day] = dateParts;
        return `${month}/${day}/${year}`;
    }

    // Helper: Get worker name
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
            <div className="flex justify-between">
                <PageTitle title="My Appointment" />
                <Button className="bg-amber-100 hover:bg-amber-600 transition-colors font-bold text-secondary">
                    <Link to={"/user/book-appointment/689d3b51175a42417cfef874"}>Book Appointment</Link>
                </Button>
            </div>

            {loading && <Spinner />}
            {!loading && appointments.length === 0 && (
                <InfoMessage message="You are currently appointment-free!" />
            )}

            {!loading && appointments.length > 0 && (
                <div className="mt-7">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-amber-200">
                                {columns.map((column) => (
                                    <TableHead key={column} className="text-left font-bold">
                                        {column}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.salon.name}</TableCell>
                                    <TableCell>
                                        <strong className="font-bold">
                                            {fromDateToWeekDate(item.appointmentDate)}
                                        </strong>, {fromYMDtoMDY(item.appointmentDate)}
                                    </TableCell>
                                    <TableCell>{item.appointmentTime}</TableCell>
                                    <TableCell>{parseArrayTostring(item.services)}</TableCell>
                                    <TableCell className="text-amber-950 font-semibold">{workerNames[item._id] || "Loading..."}</TableCell>
                                    <TableCell className="font-bold">{item.status}</TableCell>
                                    <TableCell>{parseTimetoreadableTime(item.createdAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-3">
                                            <Button
                                                size={"icon"}
                                                title="Cancel"
                                                className="cursor-pointer"
                                                variant="destructive"
                                                onClick={() => handleCancel()}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default UserAppointmentsPage;
