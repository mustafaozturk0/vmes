import { selectCurrentUser } from "../../slices/auth/AuthSlice";
import { useTypedSelector } from "../../store/hooks";
import LoadingToRedirect from "./LoadingToRedirect";

interface PrivateRouteProps {
  children: any;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const currentUser = useTypedSelector(selectCurrentUser);

  if (!currentUser) {
    return <LoadingToRedirect />;
  }

  /* //If the user is not authorized to access the page, show the unauthorized page
 if(false){
  
  <Unauthorized />
 }
 */
  return children;
};

export default PrivateRoute;
