import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import { type ISalon } from "@/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

axios.defaults.withCredentials = true;

function UserSalonsPage() {
    const [salons, setSalons] = useState<ISalon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchSalons = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/salons/get-all-salon`);
            if (response.data.success) {
                setSalons(response.data.data);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch salons")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSalons()
    }, [])

    return (
        <div className="flex flex-col gap-5">
            <PageTitle title="Available Salons" />

            {loading && <Spinner />}

            {!loading && salons.length === 0 && (
                <InfoMessage message="No salons available at the moment" />
            )}

            {!loading && salons.length > 0 && (
                <div className="flex flex-col gap-6">
                    {salons.map((salon) => (
                        <div
                            key={salon._id}
                            onClick={() => navigate(`/user/book-appointment/${salon._id}`)}
                            className="flex flex-col gap-2 border-2 border-amber-800 p-5 rounded cursor-pointer bg-orange-200 hover:bg-green-500 hover:border-emerald-700 hover:border-3"
                        >
                            <div>
                                <h1 className="text-sm font-bold">
                                    {salon.name}
                                </h1>
                                <p className="text=amber-300 text-xs mt-1">
                                    {salon.address}, {salon.city}, {salon.state}, {salon.zip}
                                </p>
                            </div>

                            <div>
                                <h1 className="text-sm font-bold text-emerald-900">
                                    Contact us: {salon.phonenumber}
                                </h1>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default UserSalonsPage