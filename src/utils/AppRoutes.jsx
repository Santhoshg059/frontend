import Login from "../components/Login";
import Home from "../components/Home";
import { AuthProvider } from "../context/AuthProvider";
import Navbar from "../components/Navbar";
import Publishride from "../components/Publishride";
import Profile from "../components/Profile";
import SearchRide from "../components/SearchRide";
import PublishedRides from "../components/PublishedRides";
import Notification from "../components/NotificationComponent";
import RideNotification from "../components/RideNotification";
const AppRoutes=[
    {
        path: "/",
        element:<Login/>,
      },
      {
        path: "/home",
        element:<AuthProvider><Navbar/><Home/></AuthProvider>,
      },
      {
        path: "/publishride",
        element:<AuthProvider><Navbar/><Publishride/></AuthProvider>,
      },
      {
        path: "/profile",
        element:<AuthProvider><Navbar/><Profile/></AuthProvider>,
      },
      {
        path: "/searchride",
        element:<AuthProvider><Navbar/><SearchRide/></AuthProvider>,
      },
      {
        path: "/published-rides",
        element:<AuthProvider><Navbar/><PublishedRides/></AuthProvider>,
      },
      {
        path: "/notifications",
        element:<AuthProvider><Navbar/><Notification/></AuthProvider>,
      },
      {
        path: "/yourride",
        element:<AuthProvider><Navbar/><RideNotification/></AuthProvider>,
      },
      
    ]
export default AppRoutes