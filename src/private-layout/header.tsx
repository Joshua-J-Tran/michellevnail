
import usersGlobalStore, {type IUsersStore} from '@/store/users-store';
import { Menu } from "lucide-react";
import { useState } from 'react';
import MenuItems from './menu-items';

function Header() {
    const [openMenuItems, setOpenMenuItems] = useState<boolean>(false);
    const {user} = usersGlobalStore() as IUsersStore
    return (
        <div className='p-5 py-6 bg-cyan-200 flex justify-between items-center'>
            <h1 className='text-xl font-bold'>
                <span>RICH-</span><strong className="text-red-600">NAILS</strong>
            </h1>
            <div className='flex items-center gap-5'>

                <h1 className='text-sm text-gray-800 font-bold uppercase'>{user?.name} <strong className="font-bold">({user?.role} {user?.control})</strong></h1>

                <Menu className='text-amber-950 cursor-pointer' size={30}
                    onClick={() => setOpenMenuItems(true)}
                />
            </div>

            {openMenuItems && (
                <MenuItems
                    openMenuItems={openMenuItems}
                    setOpenMenuItems={setOpenMenuItems}
                />
            )}

        </div>
    )
}

export default Header