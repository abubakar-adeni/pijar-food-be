const db = require("../database");

//create a new recipe
createRecipes = async (req, res) => {
    try {
      const { recipePicture, title, ingredients, videoLink } = req.body;
      if (!(title && ingredients)) {
        res.status(400).json({
          status: false,
          message: "must complete all of fields",
        });
        return;
      }
      if (title.split(" ").length < 2) {
        res.status(400).json({
          status: false,
          message: "Title is invalid! Must be greater than or equal to 2 words",
        });
        return;
      }
      if (ingredients.split(", ").length < 2) {
        res.status(400).json({
          status: false,
          message:
            "Ingredients is invalid! Must be greater than or equal to 2 ingredients.",
        });
        return;
      }
      // const checkUrlValid = isUrlValid(videoLink);
      // if (!checkUrlValid) {
      //   res.status(400).json({
      //     status: false,
      //     message: "Video Link is invalid!",
      //   });
      //   return;
      // }
      const payload = {
        // recipePicture,
        title,
        ingredients,
        // videoLink,
      };
      const query = await db`INSERT INTO recipes ${db(
        payload,
        // "recipePicture",
        "title",
        "ingredients",
        // "videoLink"
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


  //get all recipes
 getAllRecipes = async (req, res) => {
  try {
    const query = await db`SELECT * FROM recipes`;
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

//getById
 getByIdRecipes = async (req, res) => {
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
      const query = await db`SELECT * FROM recipes where id = ${id}`;
      if (!query?.length) {
        res.json({
          status: false,
          message: `ID ${id} not found`,
        });
      }
      res.json({
        status: true,
        message: "Get success",
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

  //update recipes
  updateRecipes = async (req, res) => {
    try {
      const {
        params: { id },
        body: { recipePicture, title, ingredients, videoLink },
      } = req;
      if (isNaN(id)) {
        res.status(400).json({
          status: false,
          message: "ID must be integer",
        });
        return;
      }
      const checkData = await db`SELECT * FROM recipes where id = ${id}`;
      if (!checkData?.length) {
        res.status(404).json({
          status: false,
          message: `ID ${id} not found`,
        });
        return;
      }
      const payload = {
        recipePicture: recipePicture ?? checkData[0].recipePicture,
        title: title ?? checkData[0].title,
        ingredients: ingredients ?? checkData[0].ingredients,
        videoLink: videoLink ?? checkData[0].videoLink,
      };
      if (payload.title.split(" ").length < 2) {
        res.status(400).json({
          status: false,
          message: "Title is invalid! Must be greater than or equal to 2 words",
        });
        return;
      }
      if (payload.ingredients.split(", ").length < 2) {
        res.status(400).json({
          status: false,
          message:
            "Ingredients is invalid! Must be greater than or equal to 2 ingredients.",
        });
        return;
      }
      const query = await db`UPDATE recipes SET ${db(
        payload,
        "recipePicture",
        "title",
        "ingredients",
        "videoLink"
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

  //delete recipes
  deleteRecipes = async (req, res) => {
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
    const checkData = await db`SELECT * FROM recipes WHERE id = ${id}`;
    if (!checkData?.length) {
      res.status(404).json({
        status: false,
        message: `ID ${id} not found`,
      });
      return;
    }
    const query = await db`DELETE FROM recipes WHERE id = ${id} returning *`;
    res.send({
      status: true,
      message: "Success delete data",
      data: query,
    });
  };
  
  
  module.exports = {
    createRecipes,
    getAllRecipes,
    getByIdRecipes,
    updateRecipes,
    deleteRecipes,
};
