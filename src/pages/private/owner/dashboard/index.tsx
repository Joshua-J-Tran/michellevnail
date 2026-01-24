

import usersGlobalStore, { type IUsersStore } from "@/store/users-store"


function OwnerDashboardPage() {
    const { user } = usersGlobalStore() as IUsersStore
    if (!user) return <></>
    return (
        <div className="flex flex-col gap-5">
            <h1>Dashboard Page</h1>
            <h1>User ID: {user._id}</h1>
            <h1>User Name: {user.name}</h1>
            <h1>User Phone Number: {user.phonenumber}</h1>
            <h1>User Email: {user.email}</h1>
            <h1>User Status: {user.role}</h1>
            <h1>User Role: {user.control}</h1>

        </div>
    )
}

export default OwnerDashboardPage