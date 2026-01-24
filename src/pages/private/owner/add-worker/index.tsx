import WorkerForm from "@/components/functional/worker-form";
import PageTitle from "@/components/ui/page-title";


function AddWorkerPage() {
    return (
        <div>
            <PageTitle title="Add Worker!" />
            <WorkerForm 
                formType="add"
                initialValues={{}}
            />
        </div>
    )
}

export default AddWorkerPage;