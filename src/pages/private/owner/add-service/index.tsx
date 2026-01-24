import ServiceForm from "@/components/functional/service-form";
import PageTitle from "@/components/ui/page-title";


function AddServicePage() {
    return (
        <div>
            <PageTitle title="Add Service by Taivas" />
            <ServiceForm
                formType="add"
                initialValues={{}}
            />
        </div>
    )
}

export default AddServicePage;