import SalonForm from "@/components/functional/salon-form";
import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import { type ISalon } from "@/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
axios.defaults.withCredentials = true;


function EditSalonPage() {

    const [salonData, setSalonData] = useState<ISalon | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams<{ id: string }>();
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/salons/get-salon-by-id/${params.id}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            setSalonData(response.data.data)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Red Alert! Salon Data gone!")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (params.id) {
            getData();
        }
    }, [])

    return (
        <div>
            <PageTitle title="Edit Salon" />

            {loading && <Spinner />}

            {!loading && !salonData && (<InfoMessage message="404 Salon Not Found" />)}

            {salonData && (
                <SalonForm
                    formType="edit"
                    initialValues={salonData}
                />
            )}
        </div>
    )
}

export default EditSalonPage