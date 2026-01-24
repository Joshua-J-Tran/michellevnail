
import { BrowserRouter, Routes, Route} from "react-router"
import "./index.css"
import HomePage from "./pages/public/home"
import LoginPage from "./pages/public/login"
import RegisterPage from "./pages/public/register"

import { Toaster } from "react-hot-toast";

import UserDashboardPage from "./pages/private/user/dashboard";
import OwnerDashboardPage from "./pages/private/owner/dashboard"
import PrivateLayout from './private-layout'
import PublicLayout from './public-layout'

import OwnerProfilePage from './pages/private/owner/profile'
import UserProfilePage from './pages/private/user/profile'

import OwnerSalonsPage from './pages/private/owner/salons'
import AddSalonPage from './pages/private/owner/add-salon'
import EditSalonPage from './pages/private/owner/edit-salon'
import OwnerServicesPage from './pages/private/owner/services'

import UserSalonsPage from './pages/private/user/salons'
import BookAppointmentPage from './pages/private/user/book-appointment'
import AddServicePage from './pages/private/owner/add-service'
import EditServicePage from './pages/private/owner/edit-service'
import OwnerAppointmentsPage from './pages/private/owner/appointments'
import UserAppointmentsPage from './pages/private/user/appointments'
import AddWorkerPage from './pages/private/owner/add-worker'
import EditWorkerPage from './pages/private/owner/edit-worker'
import OwnerWorkersPage from "./pages/private/owner/workers"

function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>

          {/*Define your public routes here*/}
          <Route path = "/" element = {<HomePage />} />
          <Route path = "/login" element = {<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path = "/register" element = {<PublicLayout><RegisterPage /></PublicLayout>} />

          {/*Define your private routes here*/}
          <Route path = "/user/dashboard" element = {<PrivateLayout><UserDashboardPage /></PrivateLayout>} />
          <Route path = "/owner/dashboard" element = {<PrivateLayout><OwnerDashboardPage /></PrivateLayout>} />
          <Route path = "/user/profile" element = {<PrivateLayout><UserProfilePage /></PrivateLayout>} />
          <Route path = "/user/salons" element = {<PrivateLayout><UserSalonsPage /></PrivateLayout>} />
          <Route path = "/user/book-appointment/:id" element = {<PrivateLayout><BookAppointmentPage /></PrivateLayout>} />
          <Route path = "/user/appointments" element = {<PrivateLayout><UserAppointmentsPage /></PrivateLayout>} />
          <Route path = "/owner/profile" element = {<PrivateLayout><OwnerProfilePage /></PrivateLayout>} />
          <Route path = "/owner/salons" element = {<PrivateLayout><OwnerSalonsPage /></PrivateLayout>} />
          <Route path = "/owner/salons/add" element = {<PrivateLayout><AddSalonPage /></PrivateLayout>} />
          <Route path = "/owner/salons/edit/:id" element = {<PrivateLayout><EditSalonPage /></PrivateLayout>} />
          <Route path = "/owner/services" element = {<PrivateLayout><OwnerServicesPage /></PrivateLayout>} />
          <Route path = "/owner/services/add" element = {<PrivateLayout><AddServicePage /></PrivateLayout>} />
          <Route path = "/owner/services/edit/:id" element = {<PrivateLayout><EditServicePage /></PrivateLayout>} />
          <Route path = "/owner/appointments" element = {<PrivateLayout><OwnerAppointmentsPage /></PrivateLayout>} />
          <Route path = "/owner/workers" element = {<PrivateLayout><OwnerWorkersPage /></PrivateLayout>} />
          <Route path = "/owner/workers/add" element = {<PrivateLayout><AddWorkerPage /></PrivateLayout>} />
          <Route path = "/owner/workers/edit/:id" element = {<PrivateLayout><EditWorkerPage /></PrivateLayout>} />


        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App