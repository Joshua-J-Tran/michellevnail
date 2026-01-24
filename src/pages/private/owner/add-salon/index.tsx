import SalonForm from "@/components/functional/salon-form";
import PageTitle from "@/components/ui/page-title";


function AddSalonPage() {
    return (
        <div>
            <PageTitle title="Add Salon" />
            <SalonForm 
                formType="add"
                initialValues={{}}
            />
        </div>
    )
}

export default AddSalonPage;