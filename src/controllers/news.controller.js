import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  findNewsByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  deleteService,
  likeNewsService,
  deleteLikeNewsService,
  addCommentNewsService,
  removeCommentNewsService,
} from "../services/news.service.js";

export const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
      res.status(400).send({ message: "Submit all fields for registration" });
    }

    await createService({
      title,
      text,
      banner,
      user: req.userId,
    });

    res.send(201);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 5;
    }

    if (!offset) {
      offset = 0;
    }

    const news = await findAllService(offset, limit);
    const total = await countNews();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset${next}` : null;
    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null;

    if (news.length === 0) {
      return res.status(400).send({ mensage: "There are no registered news." });
    }
    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const topNews = async (req, res) => {
  try {
    const news = await topNewsService();

    if (!news) {
      return res.status(400).send({ message: "There is no registred post." });
    }

    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const findNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findNewsByIdService(id);

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        username: news.user.username,
        userAvatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    const news = await searchByTitleService(title);

    if (news.length === 0) {
      return res
        .status(400)
        .send({ message: "There are no news with this title!" });
    }

    return res.send({
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const byUser = async (req, res) => {
  try {
    //Esse userId que vem na req é criado na auth.middleware
    const id = req.userId;
    const news = await byUserService(id);

    return res.send({
      results: news.map((item) => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        comments: item.comments,
        name: item.user.name,
        username: item.user.username,
        userAvatar: item.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    if (!title && !text && !banner) {
      res
        .status(400)
        .send({ message: "Submit at least one field to update the news!" });
    }

    const news = await findNewsByIdService(id);

    //No caso, nessa validação no if, para verificar se o usuário que criou a noticia é o mesmo que quer alterar, usa só um = por que o primeiro é um ojeto e o segundo uma string
    if (news.user._id != req.userId) {
      return res.status(400).send({ message: "You didn't update this news!" });
    }

    await updateService(id, title, text, banner);

    return res.send({ message: "Post successfully update!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findNewsByIdService(id);

    if (news.user._id != req.userId) {
      return res.status(400).send({ message: "You didn't delete this news!" });
    }

    await deleteService(id);

    return res.send({ message: "Post successfully delete!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const newsLiked = await likeNewsService(id, userId);

    if (!newsLiked) {
      await deleteLikeNewsService(id, userId);
      return res.status(200).send({ message: "Like successfully removed!" });
    }

    res.send({ message: "Like done successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const addCommentNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({ message: "Write a message to comment!" });
    }

    await addCommentNewsService(id, comment, userId);

    res.send({ message: "Comment successfully completed!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const removeCommentNews = async (req, res) => {
  try {
    const { idNews, idComment } = req.params;
    const userId = req.userId;

    const commentDeleted = await removeCommentNewsService(
      idNews,
      idComment,
      userId
    );

    //LEMBRAR DE: SEMPRE QUE USAR {} APÓS => TEM DE TER RETURN, OU ENTÃO NÃO COLOCAR {} E FAZER INLINE
    const commentFinder = commentDeleted.comments.find((comment) => 
      comment.idComment === idComment
    );

    if (!commentFinder) {
      return res.status(404).send({ message: "Comment not found!" });
    }

    if (commentFinder.userId !== userId) {
      return res.status(400).send({ message: "You can't delete this comment!" });
    }
    

    res.send({ message: "Comment successfully remove!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
