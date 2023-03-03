import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Spinner} from "../ui/Spinner";
import {Button} from "../ui/Button";
import BaseContainer from "../ui/BaseContainer";
import {get_with_token, handleError} from "../../helpers/api";


const UserPage = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [user, setUser] = useState(null);
  const userIDRoute = useParams().userID;


  const editUserPage = () => {
    history.push('/game/edit-user/' + userIDRoute)
}

const routeToGame = () => {
    history.push('/game')
}
  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData(userIDRoute) {
      try {
        const response = await get_with_token().get("/users/" + userIDRoute);

        // Get the returned user and update the state.
        setUser(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
          alert(`Something went wrong while fetching the Profile: \n${handleError(error)}`);
      }
    }

    fetchData(userIDRoute);
  }, [userIDRoute]);


  let content = <Spinner/>;

  if (user) {
    let bd = "";
    if(user.birthday != null) {bd = user.birthday.split("T")[0]};
    let cd = user.creation_date.split("T")[0];
    content = (
        <div className="user overview">
            <div>Username: {user.username}</div>
            <div>Status: {user.status}</div>
            <div>Created: {cd}</div>
            <div>Birthday: {bd}</div>
            <Button width="100%"
                    disabled={user.username !== localStorage.getItem('username')}
                    onClick={() => editUserPage()}>
                Edit User Profile
            </Button>
            <Button
                width="100%"
                onClick={() => routeToGame()}>
                Return to User Overview
            </Button>
        </div>
    )
}

return (
    <BaseContainer className="game container">
        <h2>Profile Overview</h2>
        {content}
    </BaseContainer>
);
}



export default UserPage;
