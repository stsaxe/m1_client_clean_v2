import {Link, useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {api, handleError} from "../../helpers/api";
import {Spinner} from "../ui/Spinner";
import {Button} from "../ui/Button";
import BaseContainer from "../ui/BaseContainer";
import "styles/views/Game.scss";

const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const Game = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    const [users, setUsers] = useState(null);

    const logout = async () => {
        try {
            const userID = localStorage.getItem('userID');
            await api.post('/users/logout/' + userID);

            localStorage.removeItem('userID');
            localStorage.removeItem('token');


            history.push('/login');
        } catch (error) {
            //alert(`Something went wrong when trying to logout: \n${handleError(error)}`);
            localStorage.removeItem('userID');
            localStorage.removeItem('token');
            history.push('/login');
        }
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users');

                setUsers(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");

                history.push('/login');
            }
        }

        fetchData();
    }, );

    let content = <Spinner/>;

    if (users) {
        content = (
            <div className="game">
                <ul className="game user-list">
                    {users.map(user => {
                        return (

                            <Link to = {'/game/user/' + user.userID}>
                                <Player user={user} key={user.userID}/>
                            </Link>
                        );
                    })}
                </ul>
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <BaseContainer className="game container">
            {content}
        </BaseContainer>
    );
}


export default Game;
