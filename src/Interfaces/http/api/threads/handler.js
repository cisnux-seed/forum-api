const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this.#container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ owner, ...request.payload });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request) {
    const { threadId } = request.params;
    const getThreadDetailUseCase = this.#container.getInstance(GetThreadDetailUseCase.name);
    const thread = await getThreadDetailUseCase.execute(threadId);
    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
