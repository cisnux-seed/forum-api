const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putCommentLikesHandler,
    options: {
      auth: 'forum_app_jwt',
    },
  },
]);

module.exports = routes;
