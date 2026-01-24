import ServiceForm from "@/components/functional/service-form";
import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import { type IService } from "@/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
axios.defaults.withCredentials = true;


function EditServicePage() {

    const [serviceData, setServiceData] = useState<IService | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams<{ id: string }>();
    console.log(params)
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/services/get-service-by-id/${params.id}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            setServiceData(response.data.data)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Red Alert! Service Data gone!")
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

            {!loading && !serviceData && (<InfoMessage message="404 Salon Not Found" />)}

            {serviceData && (
                <ServiceForm
                    formType="edit"
                    initialValues={serviceData}
                />
            )}
        </div>
    )
}

export default EditServicePage