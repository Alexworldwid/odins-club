const pool = require("../config/pool");

const addPost = async (userid, title) => {
    const {rows} = await pool.query(
      "INSERT INTO posts (userid, title) VALUES ($1::uuid, $2) RETURNING *",
      [userid, title]
    );

    return rows[0];
}

const getPosts = async (id, role = "guest") => {
  // Get a single post
  if (id) {
    const { rows } = await pool.query(
      `
      SELECT 
        posts.id,
        posts.title,
        posts.date_posted,
        posts.hidden,
        users.firstname,
        users.lastname,
        users.role
      FROM posts
      JOIN users ON posts.userid = users.id
      WHERE posts.id = $1::uuid
        AND ($2 = 'admin' OR posts.hidden = false)
      `,
      [id, role]
    );

    return rows[0];
  }

  // Get all posts
  const { rows } = await pool.query(
    `
    SELECT 
      posts.id,
      posts.title,
      posts.date_posted,
      posts.hidden,
      users.firstname,
      users.lastname,
      users.role
    FROM posts
    JOIN users ON posts.userid = users.id
    WHERE ($1 = 'admin' OR posts.hidden = false)
    ORDER BY posts.date_posted DESC
    `,
    [role]
  );

  return rows;
};

const deletePost = async (id) => {
    await pool.query(
      "DELETE FROM posts WHERE id = $1::uuid",
      [id]
    );
}

const hidePost = async (id) => {
  await pool.query(`
    UPDATE posts
    SET hidden = true
    WHERE ID = $1::uuid
  `, [id])
}



module.exports = {addPost, getPosts, deletePost, hidePost}