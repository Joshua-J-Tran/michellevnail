
import { Button } from "@/components/ui/button"
import usersGlobalStore, { type IUsersStore } from "@/store/users-store"
import { Link } from "react-router"

function UserDashboardPage() {
    const { user } = usersGlobalStore() as IUsersStore
    if (!user) return <></>
    return (
        <div className="flex flex-col gap-5">
            <h1>Dashboard Page</h1>
            <h1>User ID: Hidden btw</h1>
            <h1>User Name: {user.name}</h1>
            <h1>User Phone Number: {user.phonenumber}</h1>
            <h1>User Email: {user.email}</h1>

            <h1>User Status: {user.role}</h1>
            <h1>User Role: {user.control}</h1>

            <Link to="/user/salons" className="w-full">
                <Button className="font-bold text-white w-full cursor-pointer bg-orange-300 hover:bg-emerald-900 hover:uppercase h-50">
                    Book!
                </Button>
            </Link>

        </div>
    )
}

export default UserDashboardPage