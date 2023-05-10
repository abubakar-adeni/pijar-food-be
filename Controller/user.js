const db = require("../database");


//create new user
createUser = async (req, res) => {
  try {
    const { email, fullname, phoneNumber, password } = req.body;
    if (!(email && fullname && phoneNumber && password)) {
      res.status(400).json({
        status: false,
        message: "Must complete all of fields",
      });
      return;
    }
   
    if (fullname.length < 2) {
      res.status(400).json({
        status: false,
        message: "Fullname is invalid! Must be greater than or equal to 2",
      });
      return;
    }
    if (phoneNumber.length < 12) {
      res.status(400).json({
        status: false,
        message: "Phone Number is invalid! Must be greater than or equal to 12",
      });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({
        status: false,
        message: "Password is invalid! Must be greater than or equal to 8",
      });
      return;
    }
    const payload = {
      email,
      fullname,
      phoneNumber,
      password,
      
    };
    const query = await db`INSERT INTO users ${db(
      payload,
      "email",
      "fullname",
      "phoneNumber",
      "password",
      
    )} returning *`;
    res.send({
      status: true,
      message: "Success insert data",
      data: query,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: false,
      message: "Check terminal for error message",
    });
  }
};

//get all users
getAll = async (req, res) => {
  try {
    const query = await db`SELECT * FROM users`;
    res.send({
      status: true,
      message: "Get data success",
      data: query,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: false,
      message: "Check terminal for error message",
    });
  }
};

//get all users by id
getById = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        message: "ID must be integer",
      });
      return;
    }
    const query = await db`SELECT * FROM users where id = ${id}`;
    if (!query?.length) {
      res.json({
        status: false,
        message: `ID ${id} not found`,
      });
    }
    res.json({
      status: true,
      message: "Get data success",
      data: query,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: false,
      message: "Check terminal for error message",
    });
  }
};

//update users
update = async (req, res) => {
    try {
      const {
        params: { id },
        body: { email, fullname, phoneNumber, password, profilePicture },
      } = req;
      if (isNaN(id)) {
        res.status(400).json({
          status: false,
          message: "ID must be integer",
        });
        return;
      }
      const checkData = await db`SELECT * FROM users where id = ${id}`;
      if (!checkData?.length) {
        res.status(404).json({
          status: false,
          message: `ID ${id} not found`,
        });
        return;
      }
      const payload = {
        email: email ?? checkData[0].email,
        fullname: fullname ?? checkData[0].fullname,
        phoneNumber: phoneNumber ?? checkData[0].phoneNumber,
        password: password ?? checkData[0].password,
        
      };

      if (payload.fullname.length < 2) {
        res.status(400).json({
          status: false,
          message: "Fullname is invalid! Must be greater than or equal to 2",
        });
        return;
      }
      if (payload.phoneNumber.length < 12) {
        res.status(400).json({
          status: false,
          message: "Phone Number is invalid! Must be greater than or equal to 12",
        });
        return;
      }
      if (payload.password.length < 8) {
        res.status(400).json({
          status: false,
          message: "Password is invalid! Must be greater than or equal to 8",
        });
        return;
      }
      const query = await db`UPDATE users SET ${db(
        payload,
        "email",
        "fullname",
        "phoneNumber",
        "password",
      )} WHERE id = ${id} returning *`;
      res.send({
        status: true,
        message: "Success edit data",
        data: query,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: false,
        message: "Check terminal for error message",
      });
    }
  };

//delete user
  deleteUser = async (req, res) => {
    const {
      params: { id },
    } = req;
    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        message: "ID must be integer",
      });
      return;
    }
    const checkData = await db`SELECT * FROM users WHERE id = ${id}`;
    if (!checkData?.length) {
      res.status(404).json({
        status: false,
        message: `ID ${id} not found`,
      });
      return;
    }
    const query = await db`DELETE FROM users WHERE id = ${id} returning *`;
    res.send({
      status: true,
      message: "Success delete data",
      data: query,
    });
  };


module.exports = {
createUser,
getAll,
getById,
update,
deleteUser,
};
