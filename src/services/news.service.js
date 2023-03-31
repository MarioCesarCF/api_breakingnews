import News from "../models/News.js";

const createService = (body) => News.create(body);

const findAllService = () => News.find();

export { createService, findAllService };

/*OBS: ao usar o export default para objetos (desconstruido) é necessário importar como um objeto e depois usar .createService (exemplo). Para corrigir isso optou-se por retirar o default, tanto no Service quanto no Controller*/