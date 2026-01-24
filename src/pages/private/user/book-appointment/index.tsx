import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import type { ISalon, IService } from "@/interfaces";
import type { IWorker } from "@/interfaces"; // <-- import worker interface
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

import usersGlobalStore, { type IUsersStore } from "@/store/users-store";

axios.defaults.withCredentials = true;

function BookAppointmentPage() {
    const { user } = usersGlobalStore() as IUsersStore;

    const [salonData, setSalonData] = useState<ISalon | null>(null);
    const [openDay, setOpenDay] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableCount, setAvailableCount] = useState<number>(0);
    const [_isAvailable, setIsAvailable] = useState<boolean>(false);
    const [_servicesList, setServicesList] = useState<IService[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams<{ id: string }>();

    const [ownerServices, setOwnerServices] = useState<IService[]>([]);
    const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
    const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
    const [selectedSubservices, setSelectedSubservices] = useState<Record<string, Record<string, boolean>>>({});

    // --- Worker states ---
    const [availableWorkers, setAvailableWorkers] = useState<IWorker[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<IWorker | null>(null);

    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/salons/get-salon-by-id/${params.id}`);
            if (!response.data.success) throw new Error(response.data.message);
            setSalonData(response.data.data);
            getServices(response.data.data.owner);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Red Alert! Salon Data gone!");
        } finally {
            setLoading(false);
        }
    };

    const getServices = async (ownerObject: any) => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/services/get-services-by-owner-id/${ownerObject}`);
            if (!res.data.success) throw new Error(res.data.message);
            setOwnerServices(res.data.data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load services");
            setServicesList([]);
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        try {
            const response = await axios.post(`${backendUrl}/appointments/get-salon-availability`, {
                salonId: params.id,
                appointmentDate: selectedDate?.toISOString().split("T")[0],
                appointmentTime: selectedTime,
            });

            if (response.data.success) {
                setIsAvailable(response.data.success);
                setAvailableCount(response.data.data);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Invalid Time Slot!");
        }
    };

    // --- Fetch salon on mount ---
    useEffect(() => {
        if (params.id) getData();
    }, []);

    // --- Fetch available workers when date or subservices change ---
    useEffect(() => {
        if (!selectedDate || !salonData) {
            setAvailableWorkers([]);
            setSelectedWorker(null);
            return;
        }

        const fetchWorkers = async () => {
            try {
                const res = await axios.get(`${backendUrl}/workers/get-worker-by-salon-id/${params.id}`);
                if (!res.data.success) throw new Error(res.data.message);
                console.log("Available Workers:", res.data.data);

                const workers: IWorker[] = res.data.data;

                const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

                // Get the selected main services
                const selectedMainServices = Object.keys(selectedServices).filter(key => selectedServices[key]);
                console.log("Selected Main Services:", selectedMainServices);

                // Filter workers
                const filteredWorkers = workers.filter(worker =>
                    worker.isActive &&
                    worker.workingDays.includes(dayName) 
                    // & selectedMainServices.some(service => worker.services.includes(service))
                );
                console.log("Filtered Workers:", filteredWorkers);

                setAvailableWorkers(filteredWorkers);
                setSelectedWorker(null);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Failed to fetch workers");
                setAvailableWorkers([]);
            }
        };

        fetchWorkers();
    }, [selectedDate, selectedServices, salonData, params.id]);



    // --- Existing effects ---
    useEffect(() => {
        if (selectedDate && selectedTime) {
            setIsAvailable(false);
            setAvailableCount(0);
            checkAvailability();
        }
    }, [selectedDate, selectedTime]);

    const handleToggleDay = (day: string) => setOpenDay(prev => (prev === day ? null : day));

    const formatTimeToAMPM = (time: string) => {
        if (!time) return "";
        const [hourStr, minute] = time.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const renderSalonProperty = (label: string, value: string | number) => (
        <div className="flex items-start gap-2 flex-wrap">
            <h1 className="text-sm text-zinc-800 font-bold">{label}:</h1>
            <h1 className="text-sm text-stone-700 font-semibold break-words">{value}</h1>
        </div>
    );

    const getAvailableTimes = () => {
        if (!selectedDate || !salonData) return [];
        const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
        if (!salonData.workingDays.includes(dayName)) return [];
        const daySchedule = salonData.schedule[dayName];
        if (!daySchedule) return [];
        const { startTime, endTime } = daySchedule;
        const start = parseInt(startTime.split(":")[0], 10);
        const end = parseInt(endTime.split(":")[0], 10);

        let times: string[] = [];
        for (let h = start; h <= end - 0.5; h++) {
            times.push(`${h.toString().padStart(2, "0")}:00`);
            times.push(`${h.toString().padStart(2, "0")}:15`);
            times.push(`${h.toString().padStart(2, "0")}:30`);
            times.push(`${h.toString().padStart(2, "0")}:45`);
        }
        times.pop();
        return times.filter(t => t >= startTime && t <= endTime);
    };

    // --- Service/subservice handlers ---
    const handleExpand = (serviceId: string) => setExpandedServices(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
    const handleServiceCheck = (serviceId: string) => setSelectedServices(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
    const handleSubserviceCheck = (serviceId: string, subName: string) => {
        setSelectedSubservices(prev => ({
            ...prev,
            [serviceId]: {
                ...Object.fromEntries(Object.keys(prev[serviceId] || {}).map(name => [name, false])),
                [subName]: true
            }
        }));
    };

    const handleBookAppointment = async () => {
        if (!salonData || !selectedDate || !selectedTime) {
            toast.error("Please select a date and time.");
            return;
        }

        // ✅ Use availableWorkers instead of availableCount
        if (!availableWorkers || availableWorkers.length === 0) {
            toast.error("No available workers for the selected date/time/services.");
            return;
        }

        const selectedSubs: string[] = [];
        let missingSubservice = false;

        Object.keys(selectedServices).forEach(serviceKey => {
            if (selectedServices[serviceKey]) {
                const subs = selectedSubservices[serviceKey]
                    ? Object.entries(selectedSubservices[serviceKey])
                        .filter(([_, checked]) => checked)
                        .map(([subName]) => subName)
                    : [];
                if (subs.length === 0) missingSubservice = true;
                selectedSubs.push(...subs);
            }
        });

        if (missingSubservice) {
            toast.error("Please select a subservice for each selected service.");
            return;
        }

        if (selectedSubs.length === 0) {
            toast.error("Please select at least one subservice.");
            return;
        }

        try {
            setLoading(true);

            // ✅ Pick selectedWorker or fallback to the first available worker
            const workerId = selectedWorker?._id || availableWorkers[0]._id;
            // const workerName = selectedWorker?.name || availableWorkers[0].name;

            await axios.post(`${backendUrl}/appointments/book-appointment`, {
                salon: salonData._id,
                user: user?._id,
                owner: salonData?.owner,
                appointmentDate: selectedDate.toISOString().split("T")[0],
                appointmentTime: selectedTime,
                worker: workerId,
                services: selectedSubs,
                status: "Pending..."
            });

            toast.success("Appointment booked successfully!");
            navigate("/user/appointments");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-2 sm:p-4">
            <PageTitle title="Book Appointment" />

            {loading && <Spinner />}
            {!loading && !salonData && <InfoMessage message="404 Salon Not Found" />}

            {salonData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                    {/* Salon Info */}
                    <div className="flex flex-col gap-7 border-2 border-stone-500 rounded-lg p-5 bg-white shadow">
                        <div className="flex flex-col gap-3">
                            {renderSalonProperty("Name", salonData.name)}
                            {renderSalonProperty("Address", salonData.address)}
                            {renderSalonProperty("Phone Number", salonData.phonenumber)}
                            {renderSalonProperty("City", salonData.city)}
                            {renderSalonProperty("State", salonData.state)}
                            {renderSalonProperty("Zip Code", salonData.zip)}

                            <div>
                                <h1 className="text-sm text-zinc-800 font-bold mb-2">Available Days</h1>
                                <div className="flex flex-col gap-2">
                                    {salonData.workingDays.map(day => (
                                        <div key={day}>
                                            <button
                                                onClick={() => handleToggleDay(day)}
                                                className="text-sm text-blue-600 font-semibold hover:underline"
                                            >
                                                {day}
                                            </button>
                                            {openDay === day && salonData.schedule?.[day] && (
                                                <div className="ml-4 text-sm text-stone-700">
                                                    <div>
                                                        <span className="font-bold text-stone-900">Open:</span>{" "}
                                                        {formatTimeToAMPM(salonData.schedule[day].startTime)}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-stone-900">Close:</span>{" "}
                                                        {formatTimeToAMPM(salonData.schedule[day].endTime)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="flex flex-col gap-2 border-2 border-stone-500 rounded-lg p-5 bg-white shadow md:col-span-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                            {/* Time & Date */}
                            <div className="flex flex-col gap-4 mt-2 w-full">
                                {/* Time & Date picker */}
                                <div className="border-2 border-amber-500 rounded-lg p-5 bg-white shadow flex flex-col gap-4 w-full">
                                    <h2 className="text-lg font-semibold text-amber-600">Time and Date</h2>

                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={date => { setSelectedDate(date); setSelectedTime(""); }}
                                        minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                        maxDate={new Date(new Date().setDate(new Date().getDate() + 31))}
                                        placeholderText="Choose a date"
                                        className="border rounded p-2 w-full"
                                        filterDate={date => {
                                            if (!salonData) return false;
                                            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
                                            return salonData.workingDays.includes(dayName);
                                        }}
                                    />

                                    {selectedDate && (
                                        <select
                                            value={selectedTime}
                                            onChange={e => setSelectedTime(e.target.value)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">-- Select Time --</option>
                                            {getAvailableTimes().map(time => (
                                                <option key={time} value={time}>{formatTimeToAMPM(time)}</option>
                                            ))}
                                        </select>
                                    )}

                                    {selectedDate && selectedTime && availableCount !== null && (
                                        <div className={`mt-2 text-sm font-semibold ${availableCount > 0 ? "text-green-600" : "text-red-600"}`}>
                                            {availableCount > 0
                                                ? `We have ${availableCount} available slot${availableCount > 1 ? "s" : ""}.`
                                                : "Sorry, no available slots at this time."}
                                        </div>
                                    )}
                                </div>

                                {/* Services */}
                                <div className="border-2 border-green-500 rounded-lg p-5 bg-white shadow flex flex-col gap-4 w-full">
                                    <h1 className="text-lg font-semibold text-green-600">Services</h1>
                                    {ownerServices.length === 0 ? (
                                        <InfoMessage message="No services available from this owner." />
                                    ) : (
                                        <div className="space-y-2">
                                            {ownerServices.map(service => (
                                                Object.entries(service.services).map(([mainServiceName, subtypes]) => {
                                                    const serviceKey = service._id + mainServiceName;
                                                    const isExpanded = expandedServices[serviceKey] ?? true;
                                                    return (
                                                        <div key={serviceKey} className="border rounded p-2">
                                                            <div className="flex items-center gap-2">
                                                                <button type="button" onClick={() => handleExpand(serviceKey)} className="p-1">
                                                                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                                </button>
                                                                <input type="checkbox" checked={!!selectedServices[serviceKey]} onChange={() => handleServiceCheck(serviceKey)} />
                                                                <span className="font-bold text-cyan-900">{mainServiceName}</span>
                                                            </div>
                                                            {isExpanded && (
                                                                <div className="ml-7 mt-2 space-y-1">
                                                                    {subtypes.map(sub => (
                                                                        <label key={sub.name} className="flex items-center gap-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={!!selectedSubservices[serviceKey]?.[sub.name]}
                                                                                disabled={!selectedServices[serviceKey]}
                                                                                onChange={() => handleSubserviceCheck(serviceKey, sub.name)}
                                                                            />
                                                                            <span className={selectedServices[serviceKey] ? "" : "text-gray-400"}>{sub.name}</span>
                                                                            <span className={`text-xs ml-2 ${selectedServices[serviceKey] ? "text-gray-500" : "text-gray-300"}`}>
                                                                                {sub.description}
                                                                            </span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Worker & Info */}
                            <div className="flex flex-col gap-4 mt-2 w-full">
                                <div className="border-2 border-blue-500 rounded-lg p-5 bg-white shadow flex flex-col gap-4 w-full">
                                    <h2 className="text-lg font-semibold text-blue-600">Worker</h2>

                                    {!selectedDate || Object.keys(selectedSubservices).length === 0 ? (
                                        <InfoMessage message="Pick a date and at least one service to see available workers." />
                                    ) : (
                                        <select
                                            value={selectedWorker?._id || ""}
                                            onChange={e => {
                                                const workerId = e.target.value;
                                                const worker = availableWorkers.find(w => w._id === workerId) || null;
                                                setSelectedWorker(worker);
                                            }}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">-- Any Available Worker --</option>
                                            {availableWorkers.map(worker => (
                                                <option key={worker._id} value={worker._id}>{worker.name}</option>
                                            ))}
                                        </select>

                                    )}
                                </div>

                                <div className="border-4 border-black rounded-lg p-5 bg-yellow-400 shadow flex flex-col gap-4 w-full">
                                    <h2 className="text-lg font-bold text-red-600">IMPORTANT</h2>
                                    If you are trying to book for 3 or more people, please contact us via phone at <strong className="font-bold">+1{salonData.phonenumber}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Button */}
                    <div className="flex justify-center mt-10">
                        <Button
                            className="bg-green-700 text-white"
                            disabled={loading || !selectedDate || !selectedTime || availableCount <= 0}
                            onClick={handleBookAppointment}
                        >
                            Book Appointment
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookAppointmentPage;
