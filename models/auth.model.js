const pool = require("../config/pool");

const addUser = async (email, hashedPassword, firstName, lastName) => {
    const {rows} = await pool.query(
      "INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4)",
      [email, hashedPassword, firstName, lastName]
    );

    return rows[0];
}

const chanceStatus = async (status, id) => {
  const {rows} = await pool.query(
    "UPDATE users SET role = $1 WHERE id = $2",
    [status, id]
  )
  return rows[0];
}

module.exports = {addUser, chanceStatus }