/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.userID = null;
    this.username = null;
    this.status = null;
    this.birthday = null
    this.creation_date = null;
    //this.token = null;
    Object.assign(this, data);
  }
}
export default User;