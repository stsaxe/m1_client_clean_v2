import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import User from "../../models/User";
import {Spinner} from "../ui/Spinner";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import {get_with_token, handleError, put_with_token} from "../../helpers/api";


const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                type = {props.type}
                placeholder={props.placeholder}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string
};


const EditUser = () => {
    const history = useHistory();
    const userIDRoute = useParams().userID;
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [birthday, setBirthday] = useState(null);


    const returnToUserPage= () => {
        history.push('/game/user/' + userIDRoute)
    }

    const saveChanges = async () => {
        try {
            const requestBody = JSON.stringify({username, birthday});
            await put_with_token().put("/users/" + localStorage.userID, requestBody);
            const response = await get_with_token().get("/users/" + localStorage.userID, );

            //const response_2 = await api.get("/users/" + localStorage.userID, );
            const new_user_data = new User(response.data);

            localStorage.setItem("username", new_user_data.username);
            localStorage.setItem("birthday", new_user_data.birthday);

            history.push(`/game/user/` + userIDRoute);
        } catch (error) {
            alert(`Something went wrong during changing user data: \n${handleError(error)}`);
        }
    };

    useEffect(() => {
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
                alert(`Something went wrong while fetching the User: \n${handleError(error)}`);
            }
          }
        fetchData(userIDRoute);
    }, [userIDRoute]);

    let content = <Spinner/>;

    if (userIDRoute !== localStorage.getItem('userID')) {
        returnToUserPage()


    } else if (user) {
        content = (
          <div className="user">
              <div>UserID: {userIDRoute}</div>
              <FormField
                  label="New Username:"
                  value={username}
                  onChange={a => setUsername(a)}
                  type = "text"
                  placeholder = {user.username}
              />
              <FormField
                  label="New Birthday:"
                  value={birthday}
                  onChange={b => setBirthday(b)}
                  type = "date"
                  placeholder={user.birthday}
              />
              <Button width="100%"
                      disabled={!username || !birthday}
                      onClick={() => saveChanges()}>
                  Save
              </Button>
          </div>
      )
    }

    return (
        <BaseContainer className="game container">
            <h2>Edit user</h2>
            {content}
        </BaseContainer>
    );
}


export default EditUser;