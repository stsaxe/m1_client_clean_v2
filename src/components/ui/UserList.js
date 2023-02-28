import PropTypes from "prop-types";
import 'styles/ui/UserList.scss';

const UserList = props => (
  <ul {...props} className={`user-list ${props.className ?? ''}`}>
    {props.children}
  </ul>
);

UserList.propTypes = {
  children: PropTypes.node,
};

export default UserList;