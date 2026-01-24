import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { type ISalon } from "@/interfaces";
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
import { Edit2, Trash2, UserRoundPlus } from "lucide-react";

axios.defaults.withCredentials = true // always send cookies


function OwnerSalonsPage() {

    // sample data (remove later pls)

    const columns = [
        'Name',
        'City',
        'State',
        "Address",
        'Zip',
        'Minimum Service Price',
        'Maximum Service Price',
        'Number of Workers',
        ''

    ]


    const [salons, setSalons] = useState<ISalon[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate();
    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${backendUrl}/salons/get-salons-by-owner`
            )

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            setSalons(response.data.data)
        } catch (error: any) {
            setSalons([])
            toast.error(error?.response?.data?.message || "No Salon Found??!")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (salonId: string) => {
        try {
            setLoading(true);
            const response = await axios.delete(
                `${backendUrl}/salons/delete-salon-by-id/${salonId}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Salon Deleted Successfully");
            setSalons((prevSalons) => prevSalons.filter((s) => s._id !== salonId));
        } catch (error:any) {
            toast.error(error?.response?.data?.message || "Failed to delete salon")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData();
    }, [])


    return <div className="flex flex-col gap-5">
        <div className="flex justify-between">
            <PageTitle title="My Salon" />
            <Button className="bg-amber-100 hover:bg-amber-600 transition-colors font-bold text-secondary">
                <Link to={"/owner/salons/add"}>Add Salon</Link>
            </Button>
        </div>

        {/* If the page is loading, spinner will also appear */}

        {loading && <Spinner />}

        {!loading && salons.length === 0 && <InfoMessage message="You need to register something, you bum!" />}

        {!loading && salons.length > 0 && (
            <div>
                <Table>

                    <TableHeader>
                        <TableRow className="bg-amber-50">
                            {columns.map((column) => (
                                <TableHead key={column} className="text-left font-bold">
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salons.map((salon) => (
                            <TableRow key={salon._id}>
                                <TableCell className="font-medium">{salon.name}</TableCell>
                                <TableCell>{salon.city}</TableCell>
                                <TableCell>{salon.state}</TableCell>
                                <TableCell>{salon.address}</TableCell>
                                <TableCell>{salon.zip}</TableCell>
                                <TableCell>${salon.minimumServicePrice}</TableCell>
                                <TableCell>${salon.maximumServicePrice}</TableCell>
                                <TableCell>Nobody (atm)</TableCell>
                                <TableCell>
                                    <div className="flex gap-3">

                                        <Button size={'icon'} title="Edit Salon" className="cursor-pointer"
                                            onClick={() => navigate(`/owner/salons/edit/${salon._id}`)}
                                        >
                                            <Edit2 size={16}/>
                                        </Button>

                                        <Button variant="destructive" size={'icon'} title="Begone!" className="cursor-pointer" onClick={() => handleDelete(salon._id!)}>
                                            <Trash2 size={16}/>
                                        </Button>

                                        <Button variant="outline" size={'icon'} title="Edit worker(s)" className="cursor-pointer">
                                            <UserRoundPlus size={16}/>
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
}

export default OwnerSalonsPage;