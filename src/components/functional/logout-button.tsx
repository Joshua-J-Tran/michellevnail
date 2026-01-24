import Cookies from 'js-cookie';
import { Button } from "../ui/button";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

function LogoutButton() {
    const navigate = useNavigate();
    const handleLogout = () => {
        try {
            Cookies.remove("token")
            Cookies.remove("control")
            Cookies.remove("role")
            toast.success("Logged Out Successfully!");
            navigate("/");
        } catch (error:any) {
            toast.error(error.message || "How can you mess up logging out?")
        }
    };

    return <Button onClick={handleLogout}>Log Out</Button>
}

export default LogoutButton