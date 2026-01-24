import WorkerForm from "@/components/functional/worker-form";
import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import { type IWorker } from "@/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
axios.defaults.withCredentials = true;


function EditWorkerPage() {

    const [workerData, setWorkerData] = useState<IWorker | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams<{ id: string }>();
    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/workers/get-worker-by-id/${params.id}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            setWorkerData(response.data.data)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Red Alert! Worker Data gone!")
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
            <PageTitle title="Edit Worker" />

            {loading && <Spinner />}

            {!loading && !workerData && (<InfoMessage message="404 Worker Not Found" />)}

            {workerData && (
                <WorkerForm
                    formType="edit"
                    initialValues={workerData}
                />
            )}
        </div>
    )
}

export default EditWorkerPage