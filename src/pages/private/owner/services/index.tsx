import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { backendUrl } from "@/constants";
import Spinner from "@/components/ui/spinner";
import InfoMessage from "@/components/ui/info-message";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import React from "react";

axios.defaults.withCredentials = true;


interface IService {
    _id: string;
    services: Record<string, { name: string; description: string }[]>;
    cost: number;
    isAvailable: boolean;
}

function OwnerServicesPage() {
    const [servicesList, setServicesList] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    // Track which main services are expanded per service document and service name
    const [expanded, setExpanded] = useState<Record<string, Record<string, boolean>>>({});
    const navigate = useNavigate();

    const getServices = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/services/get-services-by-owner`);
            if (!res.data.success) throw new Error(res.data.message);
            setServicesList(res.data.data);
            // Initialize expanded state empty
            setExpanded({});
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load services");
            setServicesList([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (serviceId: string, mainServiceName: string) => {
        setExpanded((prev) => ({
            ...prev,
            [serviceId]: {
                ...(prev[serviceId] || {}),
                [mainServiceName]: !(prev[serviceId]?.[mainServiceName] ?? false),
            },
        }));
    };

    const handleDelete = async (serviceId: string) => {
        try {
            setLoading(true);
            const res = await axios.delete(`${backendUrl}/services/delete-service-by-id/${serviceId}`);
            if (!res.data.success) throw new Error(res.data.message);
            toast.success("Service deleted successfully");
            setServicesList((prev) => prev.filter((s) => s._id !== serviceId));
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete service");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getServices();
    }, []);



  return (
    <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
            <PageTitle title="My Services" />
            <Button className="bg-amber-100 hover:bg-amber-600 transition-colors font-bold text-secondary" onClick={() => navigate("/owner/services/add")}>Add Service</Button>
        </div>

        {loading && <Spinner />}

        {!loading && servicesList.length === 0 && (
            <InfoMessage message="No services registered yet." />
        )}

        {!loading && servicesList.length > 0 && (
            <Table>
                <TableHeader>
                    <TableRow className="bg-amber-50">
                        <TableHead className="w-12"></TableHead>
                        <TableHead className="text-left font-bold pl-2">Main Service Name</TableHead>
                        <TableHead className="text-left font-bold pl-2">Number of Subservices</TableHead>
                        <TableHead className="text-left font-bold pl-2">Cost</TableHead>
                        <TableHead className="text-left font-bold pl-2">Available</TableHead>
                        <TableHead className="text-left font-bold pl-2">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {servicesList.flatMap((service) =>
                        Object.entries(service.services).map(([mainServiceName, subservices]) => {
                            const isExpanded = expanded[service._id]?.[mainServiceName] ?? false;
                            return (
                                <React.Fragment key={service._id + mainServiceName}>
                                    <TableRow
                                        className="cursor-pointer hover:bg-amber-100"
                                        onClick={() => toggleExpand(service._id, mainServiceName)}
                                    >
                                        <TableCell className="w-12 text-center align-middle">
                                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        </TableCell>
                                        <TableCell className="align-middle pl-2">{mainServiceName}</TableCell>
                                        <TableCell className="align-middle pl-2">{subservices.length}</TableCell>
                                        <TableCell className="align-middle pl-2">${service.cost}</TableCell>
                                        <TableCell className="align-middle pl-2">{service.isAvailable ? "Yes" : "No"}</TableCell>
                                        <TableCell className="align-middle pl-2">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/owner/services/edit/${service._id}`);
                                                    }}
                                                    title="Edit Service"
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(service._id);
                                                    }}
                                                    title="Delete Service"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="bg-amber-100 p-4">
                                                {subservices.length === 0 ? (
                                                    <em>No subservices</em>
                                                ) : (
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-left border-b pb-1">Subservice Name</th>
                                                                <th className="text-left border-b pb-1">Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {subservices.map(({ name, description }) => (
                                                                <tr key={name}>
                                                                    <td className="py-1">{name}</td>
                                                                    <td className="py-1">{description || <em>No description</em>}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        )}
    </div>
);
}

export default OwnerServicesPage;
