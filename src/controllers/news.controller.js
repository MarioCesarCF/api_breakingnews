import { createService, findAllService } from "../services/news.service.js";

const create = async (req, res) => {
  try {
    
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
       res.status(400).send({ message: "Submit all fields for registration" });
    }

    await createService({
      title,
      text,
      banner,
      user: { _id: "641a3a576891dc77a1336841" },
    });

    res.send(201);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findAll = async (req, res) => {
  const news = await findAllService();
  if (news.length === 0) {
    return res.status(400).send({ mensage: "There are no registered news." });
  }
  res.send(news);
};

export { create, findAll };