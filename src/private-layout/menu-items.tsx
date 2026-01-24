
import LogoutButton from "@/components/functional/logout-button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import usersGlobalStore, { type IUsersStore } from "@/store/users-store";
import { LayoutDashboardIcon, List, ListCheck, ListFilter, UserCog, UserSearch, UsersIcon } from "lucide-react";
import { useNavigate, useResolvedPath } from "react-router";

interface IMenuItemProps {
    openMenuItems: boolean;
    setOpenMenuItems: (open: boolean) => void;

}


function MenuItems({ openMenuItems, setOpenMenuItems }: IMenuItemProps) {
    const {user} = usersGlobalStore() as IUsersStore
    const pathname = useResolvedPath("").pathname;
    const navigate = useNavigate();

    const iconSize = 20
    
    // Side menu items for customers here
    const userMenuItems = [

        {
            name: "Dashboard",
            path: '/user/dashboard',
            icon: <LayoutDashboardIcon size={iconSize}/>
        },

        {
            name: "Appointments",
            path: "/user/appointments",
            icon: <List size={iconSize}/>
        },

        {
            name: "Available Salons",
            path: "/user/salons",
            icon: <ListFilter size={iconSize}/>
        },

        {
            name: "Profile",
            path: "/user/profile",
            icon: <UsersIcon size={iconSize}/>
        }

    ];

    // Side menu items for owner here
    const ownerMenuItems = [

        {
            name: "Dashboard",
            path: '/owner/dashboard',
            icon: <LayoutDashboardIcon size={iconSize}/>
        },

        {
            name: "Manage Salon",
            path: "/owner/salons",
            icon: <ListCheck size={iconSize}/>
        },

        {
            name: "Add/Edit Services",
            path: "/owner/services",
            icon: <ListFilter size={iconSize}/>
        },

        {
            name: "Appointments",
            path: "/owner/appointments",
            icon: <List size={iconSize}/>
        },

        {
            name: "Workers",
            path: "/owner/workers",
            icon: <UserCog size={iconSize}/>
        },

        {
            name: "Customers (WIP)",
            path: "/owner/customers",
            icon: <UserSearch size={iconSize}/>
        },
        
        {
            name: "Profile",
            path: "/owner/profile",
            icon: <UsersIcon size={iconSize}/>
        }
    ];

    const menuItems = user?.control === "user" ? userMenuItems : ownerMenuItems;


    return (
        <Sheet
            open={openMenuItems}
            onOpenChange={setOpenMenuItems}
        >
            <SheetTrigger asChild>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle></SheetTitle>

                </SheetHeader>

                <div className="flex flex-col gap-7 mt-8 px-7">
                    {menuItems.map((item) => (
                        <div className={`p-3 flex items-center gap-3 cursor-pointer ${
                            pathname===item.path 
                                ? "bg-amber-50 border border-amber-900 rounded" 
                                : ""
                            }`}
                            key={item.name}
                            onClick={() => {
                                navigate(item.path);
                                setOpenMenuItems(false);
                            }}
                        >
                            {item.icon}
                            <h1 className="text-sm font-semibold text-amber-950">{item.name}</h1>
                        </div>
                    ))}

                    <LogoutButton />

                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MenuItems