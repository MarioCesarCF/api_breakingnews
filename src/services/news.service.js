import News from "../models/News.js";

const createService = (body) => News.create(body);

//
const findAllService = (offset, limit) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("user");

const countNews = () => News.countDocuments();

export { createService, findAllService, countNews };

/*OBS: ao usar o export default para objetos (desconstruido) é necessário importar como um objeto e depois usar .createService (exemplo). Para corrigir isso optou-se por retirar o default, tanto no Service quanto no Controller*/